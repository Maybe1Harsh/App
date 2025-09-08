import * as React from 'react';
import { ScrollView } from 'react-native';
import { Text, DataTable, Button } from 'react-native-paper';

export default function NearbyDieticiansScreen({ navigation }) {
  // Sample data for Ayurvedic dieticians
  const dieticians = [
    { name: 'Dr. Sharma', rating: 4.8, address: '123 Herbal St, Delhi', phone: '9876543210' },
    { name: 'Dr. Patel', rating: 4.6, address: '456 Ayurveda Rd, Mumbai', phone: '9123456780' },
    { name: 'Dr. Rao', rating: 4.7, address: '789 Wellness Ave, Bangalore', phone: '9988776655' },
  ];
  return (
    <ScrollView contentContainerStyle={{ padding: 20, backgroundColor: '#fff', flexGrow: 1 }}>
      <Text variant="titleLarge" style={{ marginBottom: 10 }}>Ayurvedic Dieticians Nearby</Text>
      <DataTable>
        <DataTable.Header>
          <DataTable.Title>Name</DataTable.Title>
          <DataTable.Title>Rating</DataTable.Title>
          <DataTable.Title>Address</DataTable.Title>
          <DataTable.Title>Phone</DataTable.Title>
        </DataTable.Header>
        {dieticians.map((doc, idx) => (
          <DataTable.Row key={idx}>
            <DataTable.Cell>{doc.name}</DataTable.Cell>
            <DataTable.Cell>{doc.rating}</DataTable.Cell>
            <DataTable.Cell>{doc.address}</DataTable.Cell>
            <DataTable.Cell>{doc.phone}</DataTable.Cell>
          </DataTable.Row>
        ))}
      </DataTable>
      <Button style={{ marginTop: 20 }} mode="contained" onPress={() => navigation.goBack()}>Back</Button>
    </ScrollView>
  );
}
