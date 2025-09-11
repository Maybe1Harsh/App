import * as React from 'react';
import { ScrollView, View } from 'react-native';
import { Text, Button, Card } from 'react-native-paper';
import { supabase } from './supabaseClient';

export default function DashboardScreen({ navigation, route }) {
  const profile = route.params?.profile;
  const [pendingRequests, setPendingRequests] = React.useState([]);
  const [assignedDoctor, setAssignedDoctor] = React.useState(null);
  const [doctorModalVisible, setDoctorModalVisible] = React.useState(false);
  const [selectedRequest, setSelectedRequest] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  // Sample data for Ayurvedic dieticians
  const dieticians = [
    { name: 'Dr. Sharma', rating: 4.8, address: '123 Herbal St, Delhi', phone: '9876543210' },
    { name: 'Dr. Patel', rating: 4.6, address: '456 Ayurveda Rd, Mumbai', phone: '9123456780' },
    { name: 'Dr. Rao', rating: 4.7, address: '789 Wellness Ave, Bangalore', phone: '9988776655' },
  ];

  const fetchAssignedDoctor = React.useCallback(async () => {
    if (!profile?.email) return;

    const { data, error } = await supabase
      .from('patients')
      .select('doctor_email')
      .eq('email', profile.email)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching assigned doctor:', error);
      setAssignedDoctor(null);
      return;
    }

    if (data) {
      // Fetch doctor details
      const { data: doctorData, error: doctorError } = await supabase
        .from('Profiles')
        .select('name')
        .eq('email', data.doctor_email)
        .single();

      if (doctorError) {
        console.error('Error fetching doctor details:', doctorError);
        setAssignedDoctor(null);
        return;
      }

      setAssignedDoctor({
        email: data.doctor_email,
        name: doctorData.name
      });
    } else {
      setAssignedDoctor(null);
    }
  }, [profile]);

  const fetchPendingRequests = React.useCallback(async () => {
    if (!profile?.email) return;
    console.log('Fetching pending requests for patient:', profile.email);
    const { data, error } = await supabase
      .from('patient_requests')
      .select('id, doctor_email, status')
      .eq('patient_email', profile.email)
      .eq('status', 'pending');

    console.log('Fetched data:', data);
    console.log('Error:', error);

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching pending requests:', error);
      return;
    }

    if (data && data.length > 0) {
      console.log('Pending requests found:', data.length);
      // Fetch doctor names for each request
      const doctorEmails = data.map(req => req.doctor_email);
      const { data: doctorsData, error: doctorsError } = await supabase
        .from('Profiles')
        .select('email, name')
        .in('email', doctorEmails);

      if (doctorsError) {
        console.error('Error fetching doctors data:', doctorsError);
        return;
      }

      // Map doctor names to requests
      const requestsWithDoctorNames = data.map(req => {
        const doctor = doctorsData.find(d => d.email === req.doctor_email);
        return { ...req, doctor: doctor ? { name: doctor.name } : { name: 'Unknown' } };
      });

      console.log('Requests with doctor names:', requestsWithDoctorNames);
      setPendingRequests(requestsWithDoctorNames);
    } else {
      console.log('No pending requests found');
      setPendingRequests([]);
    }
  }, [profile]);

  React.useEffect(() => {
    fetchPendingRequests();
    fetchAssignedDoctor();
  }, [fetchPendingRequests, fetchAssignedDoctor, profile]);

  // Real-time subscription for patient requests
  React.useEffect(() => {
    if (!profile?.email) return;

    const channel = supabase
      .channel('patient_requests_changes_' + profile.email)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'patient_requests',
        },
        (payload) => {
          console.log('Patient requests change received!', payload);
          // Check if the change affects this patient
          if (payload.new && payload.new.patient_email === profile.email) {
            fetchPendingRequests();
          } else if (payload.old && payload.old.patient_email === profile.email) {
            fetchPendingRequests();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [profile?.email, fetchPendingRequests]);

  const handleApprove = async () => {
    if (!selectedRequest) return;
    setLoading(true);

    try {
      // Add patient to doctor's patients list
      const { error: insertError } = await supabase
        .from('patients')
        .insert([
          {
            name: profile.name,
            email: profile.email,
            doctor_email: selectedRequest.doctor_email,
            age: profile.age,
          },
        ]);

      if (insertError) {
        alert('Failed to add you to the doctor\'s patient list. Please try again.');
        setLoading(false);
        return;
      }

      // Update request status to approved
      const { error: updateError } = await supabase
        .from('patient_requests')
        .update({ status: 'approved' })
        .eq('id', selectedRequest.id);

      if (updateError) {
        alert('Failed to update request status. Please try again.');
        setLoading(false);
        return;
      }

      setDoctorModalVisible(false);
      setSelectedRequest(null);
      // Refresh the pending requests list and assigned doctor
      await fetchPendingRequests();
      await fetchAssignedDoctor();
      alert('You have approved the doctor\'s request and are now added to their patient list.');
    } catch (error) {
      console.error('Error approving request:', error);
      alert('An unexpected error occurred. Please try again.');
    }

    setLoading(false);
  };

  const handleReject = async () => {
    if (!selectedRequest) return;
    setLoading(true);

    try {
      // Update request status to rejected
      const { error: updateError } = await supabase
        .from('patient_requests')
        .update({ status: 'rejected' })
        .eq('id', selectedRequest.id);

      if (updateError) {
        alert('Failed to update request status. Please try again.');
        setLoading(false);
        return;
      }

      setDoctorModalVisible(false);
      setSelectedRequest(null);
      // Refresh the pending requests list
      await fetchPendingRequests();

      // Notify doctor about rejection - for simplicity, we can insert a notification record or just alert here
      alert('You have rejected the doctor\'s request. The doctor will be notified.');
    } catch (error) {
      console.error('Error rejecting request:', error);
      alert('An unexpected error occurred. Please try again.');
    }

    setLoading(false);
  };

  return (
    <>
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#f3f6fa' }}>
        <Text variant="headlineMedium" style={{ marginBottom: 20, color: '#2e7d32' }}>
          Welcome, Patient!
        </Text>

        {assignedDoctor && (
          <Card style={{
            width: '100%',
            marginBottom: 15,
            borderRadius: 16,
            backgroundColor: '#e8f5e8',
            borderWidth: 2,
            borderColor: '#4caf50'
          }}>
            <Card.Content style={{ alignItems: 'center' }}>
              <Text style={{
                fontSize: 18,
                fontWeight: 'bold',
                color: '#2e7d32',
                textAlign: 'center'
              }}>
                🎉 Your Doctor: Dr. {assignedDoctor.name}
              </Text>
              <Text style={{
                fontSize: 14,
                color: '#388e3c',
                textAlign: 'center',
                marginTop: 5
              }}>
                You are now under Dr. {assignedDoctor.name}'s care
              </Text>
            </Card.Content>
          </Card>
        )}

        <Button
          mode="contained"
          onPress={() => navigation.navigate('PatientPrescriptions', { profile })}
          style={{ marginBottom: 10, backgroundColor: '#1976d2' }}
        >
          View Prescriptions & Diet Charts
        </Button>

        <Card style={{ width: '100%', marginBottom: 15, borderRadius: 16 }}>
          <Card.Title title="Doctor Requests" />
          <Card.Content>
            {pendingRequests.length === 0 ? (
              <Text>No pending requests from doctors.</Text>
            ) : (
              <>
                <Text>You have pending requests from doctors:</Text>
                <Text style={{
                  fontSize: 14,
                  color: '#666',
                  fontStyle: 'italic',
                  marginBottom: 10,
                  textAlign: 'center'
                }}>
                  💡 Tip: Double-click the Approve or Reject buttons to respond to requests
                </Text>
                {pendingRequests.map((request) => (
                  <View key={request.id} style={{ marginTop: 10, padding: 10, backgroundColor: '#f0f0f0', borderRadius: 8 }}>
                    <Text style={{ fontWeight: 'bold' }}>Dr. {request.doctor.name}</Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                      <Button
                        mode="contained"
                        onPress={() => {
                          setSelectedRequest(request);
                          handleApprove();
                        }}
                        loading={loading}
                        disabled={loading}
                        style={{ flex: 1, marginRight: 5 }}
                      >
                        Approve
                      </Button>
                      <Button
                        mode="outlined"
                        onPress={() => {
                          setSelectedRequest(request);
                          handleReject();
                        }}
                        disabled={loading}
                        style={{ flex: 1, marginLeft: 5 }}
                      >
                        Reject
                      </Button>
                    </View>
                  </View>
                ))}
              </>
            )}
          </Card.Content>
        </Card>

        <Card style={{ width: '100%', marginBottom: 15, borderRadius: 16 }}>
          <Card.Title title="Prakriti Guesser" />
          <Card.Content>
            <Text>Find your Ayurvedic body type!</Text>
          </Card.Content>
          <Card.Actions>
            <Button
              mode="contained"
              onPress={() => navigation.navigate('PrakritiGuesser')}
            >
              Start
            </Button>
          </Card.Actions>
        </Card>
        <Card style={{ width: '100%', marginBottom: 15, borderRadius: 16 }}>
          <Card.Title title="Nearby Doctor Recommendation" />
          <Card.Content>
            <Text>Get a list of Ayurvedic doctors near you.</Text>
          </Card.Content>
          <Card.Actions>
            <Button mode="contained" onPress={() => navigation.navigate('NearbyDieticiansScreen')}>Show</Button>
          </Card.Actions>
        </Card>
        

        <Card style={{ width: '100%', marginBottom: 15, borderRadius: 16 }}>
          <Card.Title title="" />
          <Card.Content>
            <Text>Upload your health reports for doctor review.</Text>
          </Card.Content>
          <Card.Actions>
            <Button mode="contained" onPress={() => alert('Sample: Upload feature coming soon!')}>Upload</Button>
          </Card.Actions>
        </Card>
        <Card style={{ width: '100%', marginBottom: 15, borderRadius: 16 }}>
          <Card.Title title="Ayurvedic Remedies" />
          <Card.Content>
            <Text>Get remedies for common issues like cough and cold.</Text>
          </Card.Content>
          <Card.Actions>
            <Button mode="contained" onPress={() => navigation.navigate('AyurvedicRemedies')}>Show</Button>
          </Card.Actions>
        </Card>
      </ScrollView>
    </>
  );
}

