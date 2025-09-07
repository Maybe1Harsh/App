import * as React from 'react';
import { ScrollView } from 'react-native';
import { Text, Button, Card } from 'react-native-paper';

export default function DashboardScreen({ navigation }) {
  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#f3f6fa' }}>
      <Text variant="headlineMedium" style={{ marginBottom: 20, color: '#2e7d32' }}>
        Welcome, Patient!
      </Text>
      <Card style={{ width: '100%', marginBottom: 15, borderRadius: 16 }}>
        <Card.Title title="Prakriti Guesser" />
        <Card.Content>
          <Text>Find your Ayurvedic body type!</Text>
        </Card.Content>
        <Card.Actions>
          <Button mode="contained" onPress={() => alert('Prakriti Guesser coming soon!')}>Start</Button>
        </Card.Actions>
      </Card>
      <Card style={{ width: '100%', marginBottom: 15, borderRadius: 16 }}>
        <Card.Title title="Nearby Doctor Recommendation" />
        <Card.Content>
          <Text>Get a list of Ayurvedic doctors near you.</Text>
        </Card.Content>
        <Card.Actions>
          <Button mode="contained" onPress={() => alert('Sample: Dr. Sharma, Dr. Patel (coming soon)')}>Show</Button>
        </Card.Actions>
      </Card>
      <Card style={{ width: '100%', marginBottom: 15, borderRadius: 16 }}>
        <Card.Title title="Upload Reports" />
        <Card.Content>
          <Text>Upload your health reports for doctor review.</Text>
        </Card.Content>
        <Card.Actions>
          <Button mode="contained" onPress={() => alert('Sample: Upload feature coming soon!')}>Upload</Button>
        </Card.Actions>
      </Card>
      <Card style={{ width: '100%', marginBottom: 15, borderRadius: 16 }}>
        <Card.Title title="View Prescriptions" />
        <Card.Content>
          <Text>See your latest prescriptions from your doctor.</Text>
        </Card.Content>
        <Card.Actions>
          <Button mode="contained" onPress={() => alert('Sample: Prescription feature coming soon!')}>View</Button>
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
  );
}