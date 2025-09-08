import * as React from 'react';
import { View } from 'react-native';
import { Text, Button, RadioButton, Card } from 'react-native-paper';

export default function PrakritiGuesserScreen({ navigation }) {
  const [type, setType] = React.useState('');

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <Card style={{ width: '100%', padding: 20 }}>
        <Text variant="headlineMedium" style={{ marginBottom: 20, color: '#2e7d32' }}>
          Prakriti Guesser
        </Text>
        <Text style={{ marginBottom: 10 }}>Select your body type:</Text>
        <RadioButton.Group onValueChange={setType} value={type}>
          <RadioButton.Item label="Vata" value="Vata" />
          <RadioButton.Item label="Pitta" value="Pitta" />
          <RadioButton.Item label="Kapha" value="Kapha" />
        </RadioButton.Group>
        <Button
          mode="contained"
          style={{ marginTop: 20 }}
          onPress={() => alert(`You selected: ${type}`)}
        >
          Submit
        </Button>
      </Card>
    </View>
  );
}