import React, { useState, useEffect } from 'react';
import { ScrollView, View } from 'react-native';
import { Text, Card, Button, TextInput, Portal, Modal, Provider as PaperProvider } from 'react-native-paper';
import { supabase } from './supabaseClient';
import { useTranslation } from './hooks/useTranslation';

export default function DoctorPrescriptionsScreen({ navigation, route }) {
  const { t } = useTranslation();
  const doctorEmail = route.params?.profile?.email;
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [prescriptionText, setPrescriptionText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPatients();
  }, [doctorEmail]);

  const fetchPatients = async () => {
    try {
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .eq('doctor_email', doctorEmail);
      
      if (error) throw error;
      setPatients(data || []);
    } catch (error) {
      console.error('Error fetching patients:', error);
    }
  };

  const handleWritePrescription = (patient) => {
    setSelectedPatient(patient);
    setPrescriptionText('');
    setModalVisible(true);
  };

  const handleSavePrescription = async () => {
    if (!prescriptionText.trim() || !selectedPatient) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('prescriptions')
        .insert([{
          patient_email: selectedPatient.email,
          doctor_email: doctorEmail,
          prescription_text: prescriptionText.trim(),
          patient_name: selectedPatient.name
        }]);

      if (error) throw error;
      
      setModalVisible(false);
      setPrescriptionText('');
      setSelectedPatient(null);
      alert('Prescription saved successfully!');
    } catch (error) {
      console.error('Error saving prescription:', error);
      alert('Failed to save prescription. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PaperProvider>
      <ScrollView style={{ flex: 1, backgroundColor: '#f3f6fa' }}>
        <View style={{ padding: 20 }}>
          <Text variant="headlineMedium" style={{ marginBottom: 20, color: '#2e7d32', textAlign: 'center' }}>
            Write Prescriptions
          </Text>
          
          {patients.length === 0 ? (
            <Card style={{ padding: 20, borderRadius: 16, backgroundColor: '#fff' }}>
              <Text style={{ textAlign: 'center', color: '#666' }}>
                No patients assigned yet. Add patients to write prescriptions.
              </Text>
            </Card>
          ) : (
            patients.map((patient) => (
              <Card key={patient.id} style={{ marginBottom: 15, borderRadius: 16, backgroundColor: '#fff' }}>
                <Card.Content>
                  <Text variant="titleMedium" style={{ color: '#2e7d32', marginBottom: 8 }}>
                    {patient.name}
                  </Text>
                  <Text style={{ color: '#666', marginBottom: 12 }}>
                    Email: {patient.email}
                  </Text>
                  <Text style={{ color: '#666', marginBottom: 12 }}>
                    Age: {patient.age}
                  </Text>
                </Card.Content>
                <Card.Actions>
                  <Button 
                    mode="contained" 
                    onPress={() => handleWritePrescription(patient)}
                    style={{ backgroundColor: '#4caf50' }}
                  >
                    Write Prescription
                  </Button>
                </Card.Actions>
              </Card>
            ))
          )}
        </View>

        <Portal>
          <Modal visible={modalVisible} onDismiss={() => setModalVisible(false)} 
                 contentContainerStyle={{ backgroundColor: 'white', padding: 24, margin: 24, borderRadius: 16 }}>
            <Text variant="titleLarge" style={{ marginBottom: 16, color: '#2e7d32' }}>
              Write Prescription for {selectedPatient?.name}
            </Text>
            
            <TextInput
              label="Prescription Details"
              value={prescriptionText}
              onChangeText={setPrescriptionText}
              multiline
              numberOfLines={8}
              mode="outlined"
              style={{ marginBottom: 16 }}
              placeholder="Enter prescription details, medications, dosages, instructions..."
            />
            
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Button 
                mode="outlined" 
                onPress={() => setModalVisible(false)}
                style={{ flex: 1, marginRight: 8 }}
              >
                Cancel
              </Button>
              <Button 
                mode="contained" 
                onPress={handleSavePrescription}
                loading={loading}
                disabled={loading || !prescriptionText.trim()}
                style={{ flex: 1, marginLeft: 8, backgroundColor: '#4caf50' }}
              >
                Save Prescription
              </Button>
            </View>
          </Modal>
        </Portal>
      </ScrollView>
    </PaperProvider>
  );
}
