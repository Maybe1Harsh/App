import React, { useEffect, useState, useCallback } from "react";
import { ScrollView, View } from "react-native";
import { Text, Card, Button, Divider } from "react-native-paper";
import { useFocusEffect } from '@react-navigation/native';
import { supabase } from "./supabaseClient";
import { useTranslation } from './hooks/useTranslation';

const { width } = Dimensions.get('window');

export default function DoctorDashboardScreen({ route, navigation }) {
  const { t } = useTranslation();
  const doctorEmail = route.params?.profile?.email || "";
  const doctorName = route.params?.profile?.name || "";
  const doctorProfile = route.params?.profile || {};
  const [patients, setPatients] = useState([]);
  const [schedule, setSchedule] = useState([]);

  // Fetch patients assigned to this doctor
  const fetchPatients = useCallback(() => {
    supabase
      .from("patients")
      .select("*")
      .eq("doctor_email", doctorEmail)
      .then(({ data }) => setPatients(data || []));
  }, [doctorEmail]);

  useFocusEffect(fetchPatients);

  // Real-time subscription for patients
  React.useEffect(() => {
    if (!doctorEmail) return;

    const channel = supabase
      .channel('patients_changes_' + doctorEmail)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'patients',
        },
        (payload) => {
          console.log('Patients change received!', payload);
          // Check if the change affects this doctor
          if (payload.new && payload.new.doctor_email === doctorEmail) {
            fetchPatients();
          } else if (payload.old && payload.old.doctor_email === doctorEmail) {
            fetchPatients();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [doctorEmail, fetchPatients]);

  // Real-time subscription for rejected requests
  React.useEffect(() => {
    if (!doctorEmail) return;

    const channel = supabase
      .channel('rejected_requests_changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'patient_requests',
        },
        (payload) => {
          if (payload.new && payload.new.status === 'rejected' && payload.new.doctor_email === doctorEmail) {
            alert(`Patient ${payload.new.patient_email} has rejected your request.`);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [doctorEmail]);

  // Check for declined requests and notify doctor
  React.useEffect(() => {
    const checkDeclinedRequests = async () => {
      const { data, error } = await supabase
        .from('patient_requests')
        .select('id, patient_email, doctor:Profiles(name)')
        .eq('doctor_email', doctorEmail)
        .eq('status', 'declined');

      if (error) {
        console.error('Error fetching declined requests:', error);
        return;
      }

      if (data && data.length > 0) {
        const declinedPatients = data.map(req => req.patient_email).join(', ');
        alert(`The following patients have declined your request: ${declinedPatients}`);

        // Optionally, update status to notified or delete the records
        // For now, we'll leave them as is
      }
    };

    if (doctorEmail) {
      checkDeclinedRequests();
    }
  }, [doctorEmail]);

  // Fetch today's schedule
  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    supabase
      .from("schedule")
      .select("*")
      .eq("doctor_email", doctorEmail)
      .eq("date", today)
      .then(({ data }) => setSchedule(data || []));
  }, [doctorEmail]);

  // Add logout handler similar to patient dashboard
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigation.reset({ index: 0, routes: [{ name: 'Landing' }] });
    } catch (e) {
      console.error('Logout error:', e);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        padding: 20,
        backgroundColor: "#f9fafc",
      }}
    >
      {/* Header */}
      <Card style={{ marginBottom: 20, backgroundColor: "#1976d2" }}>
        <Card.Content>
          <Text
            variant="headlineMedium"
            style={{ color: "white", fontWeight: "bold" }}
          >
            Welcome, Dr. {doctorName}
          </Text>
          <Text style={{ color: "white", marginTop: 5, fontSize: 16 }}>
            You have {patients.length} patients under your care.
          </Text>
        </Card.Content>
      </Card>

      {/* Action Buttons */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
        <Button
          mode="contained"
          onPress={() => navigation.navigate("AddPatient", { doctorEmail })}
          style={{
            flex: 1,
            marginRight: 8,
            backgroundColor: "#388e3c",
            borderRadius: 10,
            paddingVertical: 5,
          }}
          labelStyle={{ fontSize: 14 }}
        >
          ➕ Add Patient
        </Button>
        <Button
          mode="contained"
          onPress={() => navigation.navigate("DoctorPrescriptions", { profile: route.params?.profile })}
          style={{
            flex: 1,
            marginLeft: 8,
            backgroundColor: "#1976d2",
            borderRadius: 10,
            paddingVertical: 5,
          }}
          labelStyle={{ fontSize: 14 }}
        >
          📝 Prescriptions
        </Button>
      </View>
      
      <Button
        mode="contained"
        onPress={() => navigation.navigate("DietChartTemplates", { profile: route.params?.profile })}
        style={{
          marginBottom: 20,
          backgroundColor: "#ff9800",
          borderRadius: 10,
          paddingVertical: 5,
        }}
        labelStyle={{ fontSize: 16 }}
      >
        🍽️ Diet Charts
      </Button>

      {/* Schedule Section */}
      <Card style={{ marginBottom: 20, borderRadius: 12 }}>
        <Card.Content>
          <Text
            variant="titleMedium"
            style={{ fontWeight: "bold", marginBottom: 10 }}
          >
            📅 Today's Schedule
          </Text>
          <Divider style={{ marginBottom: 10 }} />
          {schedule.length === 0 ? (
            <Text>No appointments scheduled for today.</Text>
          ) : (
            schedule.map((item) => (
              <Card
                key={item.id}
                style={{
                  marginBottom: 10,
                  borderRadius: 10,
                  backgroundColor: "#e3f2fd",
                }}
              >
                <Card.Content>
                  <Text style={{ fontWeight: "bold" }}>🕒 {item.time}</Text>
                  <Text>👤 {item.patient_name}</Text>
                  <Text>📝 {item.notes}</Text>
                </Card.Content>
              </Card>
            ))
          )}
        </Card.Content>
      </Card>

      {/* Patients Section */}
      <Card style={{ marginBottom: 20, borderRadius: 12 }}>
        <Card.Content>
          <Text
            variant="titleMedium"
            style={{ fontWeight: "bold", marginBottom: 10 }}
          >
            👥 Patients List
          </Text>
          <Divider style={{ marginBottom: 10 }} />
          {patients.length === 0 ? (
            <Text>No patients assigned yet.</Text>
          ) : (
            patients.map((patient) => (
              <Card
                key={patient.id}
                style={{
                  marginBottom: 10,
                  borderRadius: 10,
                  backgroundColor: "#fff3e0",
                }}
              >
                <Card.Content>
                  <Text style={{ fontWeight: "bold" }}>
                    {patient.name}
                  </Text>
                  <Text>{patient.email}</Text>
                </Card.Content>
              </Card>
            ))
          )}
        </Card.Content>
      </Card>
    </ScrollView>
   );
}

// Comprehensive StyleSheet matching the landing and login page design
const dashboardStyles = {
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  headerSection: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  logoContainer: {
    width: 100,
    height: 100,
    backgroundColor: '#ffffff',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  logoEmoji: {
    fontSize: 40,
  },
  title: {
    color: '#2e7d32',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    color: '#4caf50',
    fontSize: 16,
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 20,
  },
  logoutButton: {
    borderColor: '#4caf50',
    borderWidth: 1,
    borderRadius: 20,
  },
  logoutButtonLabel: {
    color: '#4caf50',
    fontSize: 14,
  },
  
  // Stats Cards
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 15,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statCardContent: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2e7d32',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    fontWeight: '500',
  },
  
  // Section Cards
  sectionCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2e7d32',
  },
  sectionDivider: {
    marginBottom: 15,
    backgroundColor: '#e0e0e0',
  },
  
  // Chips
  scheduleChip: {
    backgroundColor: '#e8f5e8',
    borderColor: '#4caf50',
  },
  patientsChip: {
    backgroundColor: '#e3f2fd',
    borderColor: '#1976d2',
  },
  chipText: {
    fontSize: 12,
    color: '#2e7d32',
  },
  
  // Empty States
  emptyState: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#999999',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  
  // Add Patient Button
  addPatientButton: {
    backgroundColor: '#4caf50',
    borderRadius: 25,
    marginBottom: 20,
    shadowColor: '#4caf50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  addPatientButtonContent: {
    paddingVertical: 8,
  },
  addPatientButtonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  
  // Schedule List
  scheduleList: {
    gap: 12,
  },
  appointmentCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#4caf50',
  },
  appointmentContent: {
    paddingVertical: 15,
  },
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  appointmentTime: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2e7d32',
  },
  appointmentChip: {
    backgroundColor: '#e8f5e8',
  },
  appointmentChipText: {
    fontSize: 12,
    color: '#4caf50',
  },
  patientName: {
    fontSize: 15,
    color: '#424242',
    marginBottom: 4,
  },
  appointmentNotes: {
    fontSize: 14,
    color: '#666666',
    fontStyle: 'italic',
  },
  
  // Patients List
  patientsList: {
    gap: 12,
  },
  patientCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#1976d2',
  },
  patientContent: {
    paddingVertical: 15,
  },
  patientHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  patientAvatar: {
    backgroundColor: '#1976d2',
    marginRight: 15,
  },
  avatarLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  patientInfo: {
    flex: 1,
  },
  patientEmail: {
    fontSize: 14,
    color: '#666666',
    marginTop: 2,
  },
  patientAge: {
    fontSize: 13,
    color: '#888888',
    marginTop: 2,
  },
  
  // Quick Actions
  quickActionsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  quickActionButton: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
  },
  quickActionLabel: {
    fontSize: 14,
    color: '#2e7d32',
    fontWeight: '600',
  },
  
  // Footer
  footerSpacing: {
    height: 20,
  },
};





