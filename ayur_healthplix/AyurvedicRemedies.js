import * as React from 'react';
import { ScrollView } from 'react-native';
import { Text, Button, Card, Portal, Modal } from 'react-native-paper';

const remedies = {
  "Cough & Cold": "Ginger tea, Tulsi leaves, Honey, Steam inhalation.",
  "Fever": "Drink plenty of fluids, rest, use Tulsi and Giloy decoction.",
  "Headache": "Peppermint oil, Ginger tea, Hydration, Gentle massage.",
  "Blood Pressure": "Garlic, Ashwagandha, Meditation, Reduce salt intake.",
  "Sugar (Diabetes)": "Bitter gourd juice, Fenugreek seeds, Cinnamon, Regular exercise.",
  "Immunity Boosting": "Amla, Turmeric milk, Chyawanprash, Yoga, Adequate sleep."
};

export default function AyurvedicRemediesScreen() {
  const [remedyVisible, setRemedyVisible] = React.useState(false);
  const [selectedDisease, setSelectedDisease] = React.useState('');
  const [remedyText, setRemedyText] = React.useState('');

  const showRemedy = (disease) => {
    setSelectedDisease(disease);
    setRemedyText(remedies[disease]);
    setRemedyVisible(true);
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#f3f6fa' }}>
      <Text variant="headlineMedium" style={{ marginBottom: 20, color: '#2e7d32' }}>
        Ayurvedic Remedies
      </Text>
      {Object.keys(remedies).map((disease) => (
        <Card key={disease} style={{ width: '100%', marginBottom: 15, borderRadius: 16 }}>
          <Card.Title title={disease} />
          <Card.Content>
            <Text>Tap below to see remedies for {disease}.</Text>
          </Card.Content>
          <Card.Actions>
            <Button mode="contained" onPress={() => showRemedy(disease)}>Show Remedy</Button>
          </Card.Actions>
        </Card>
      ))}
      <Portal>
        <Modal visible={remedyVisible} onDismiss={() => setRemedyVisible(false)} contentContainerStyle={{ backgroundColor: 'white', padding: 20, margin: 20, borderRadius: 16 }}>
          <Text variant="titleMedium" style={{ marginBottom: 10 }}>{selectedDisease} Remedies</Text>
          <Text style={{ marginBottom: 10 }}>{remedyText}</Text>
          <Button mode="outlined" onPress={() => setRemedyVisible(false)} style={{ marginTop: 10 }}>Close</Button>
        </Modal>
      </Portal>
    </ScrollView>
  );
}