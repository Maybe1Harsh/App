import React, { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Text, Card, Button } from 'react-native-paper';
import { supabase } from './supabaseClient';

export default function DoctorDashboardScreen({ route, navigation }) {
  const doctorEmail = route.params?.profile?.email || '';
  const doctorName = route.params?.profile?.name || '';
  const [patients, setPatients] = useState([]);
  const [schedule, setSchedule] = useState([]);

  // Fetch patients assigned to this doctor
  useEffect(() => {
    supabase
      .from('patients')
      .select('*')
      .eq('doctor_email', doctorEmail)
      .then(({ data }) => setPatients(data || []));
  }, [doctorEmail]);

  // Fetch today's schedule
  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    supabase
      .from('schedule')
      .select('*')
      .eq('doctor_email', doctorEmail)
      .eq('date', today)
      .then(({ data }) => setSchedule(data || []));
  }, [doctorEmail]);

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Text variant="headlineMedium" style={{ marginBottom: 10 }}>
        Welcome, Dr. {doctorName}
      </Text>
      <Text style={{ marginBottom: 20, fontSize: 16 }}>
        Total Patients: {patients.length}
      </Text>

      <Button
        mode="contained"
        onPress={() => navigation.navigate('AddPatient', { doctorEmail })}
        style={{ marginBottom: 20, backgroundColor: '#1976d2' }}
      >
        Add New Patient
      </Button>

      <Text variant="titleMedium" style={{ marginBottom: 10 }}>
        Today's Schedule
      </Text>
      {schedule.length === 0 ? (
        <Text style={{ marginBottom: 20 }}>No appointments scheduled for today.</Text>
      ) : (
        schedule.map(item => (
          <Card key={item.id} style={{ marginBottom: 10 }}>
            <Card.Content>
              <Text>Time: {item.time}</Text>
              <Text>Patient: {item.patient_name}</Text>
              <Text>Notes: {item.notes}</Text>
            </Card.Content>
          </Card>
        ))
      )}

      <Text variant="titleMedium" style={{ marginTop: 20, marginBottom: 10 }}>
        Patients List
      </Text>
      {patients.length === 0 ? (
        <Text>No patients assigned yet.</Text>
      ) : (
        patients.map(patient => (
          <Card key={patient.id} style={{ marginBottom: 10 }}>
            <Card.Content>
              <Text>Name: {patient.name}</Text>
              <Text>Email: {patient.email}</Text>
            </Card.Content>
          </Card>
        ))
      )}
    </ScrollView>
  );
}