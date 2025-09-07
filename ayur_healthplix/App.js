import * as React from 'react';
import { View } from 'react-native';
import { TextInput, Button, Text, Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { supabase } from './supabaseClient';
import DashboardScreen from './Dashboard';
import AyurvedicRemediesScreen from './AyurvedicRemedies';

const Stack = createNativeStackNavigator();

function LoginScreen({ navigation }) {
  const [loading, setLoading] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [name, setName] = React.useState('');
  const [age, setAge] = React.useState('');
  const [message, setMessage] = React.useState('');
  const [isRegister, setIsRegister] = React.useState(false);

  const handleLogin = async () => {
  if (!email || !password) {
    setMessage('Please enter both email and password.');
    return;
  }
  setLoading(true);
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  setLoading(false);
  if (error) setMessage(error.message);
  else {
    setMessage('Login successful!');
    navigation.replace('Dashboard');
  }
};

const handleRegister = async () => {
  if (!name || !age || !email || !password) {
    setMessage('Please fill all fields.');
    return;
  }
  setLoading(true);
  const { error } = await supabase.auth.signUp({ email, password });
  setLoading(false);
  setMessage(error ? error.message : 'Registration successful! Check your email.');
  // You can add code here to save name and age to Supabase if you have a profile table
};

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#e3f2fd' }}>
      <Text variant="headlineMedium" style={{ marginBottom: 20, textAlign: 'center', color: '#1565c0' }}>
        {isRegister ? 'Register' : 'Login'}
      </Text>
      {isRegister && (
        <>
          <TextInput
            label="Name"
            value={name}
            onChangeText={setName}
            mode="outlined"
            style={{ marginBottom: 10, backgroundColor: '#fff' }}
          />
          <TextInput
            label="Age"
            value={age}
            onChangeText={setAge}
            mode="outlined"
            keyboardType="numeric"
            style={{ marginBottom: 10, backgroundColor: '#fff' }}
          />
        </>
      )}
      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        mode="outlined"
        style={{ marginBottom: 10, backgroundColor: '#fff' }}
      />
      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        mode="outlined"
        secureTextEntry
        style={{ marginBottom: 10, backgroundColor: '#fff' }}
      />
      <Button
       mode="contained"
       loading={loading}
       disabled={loading}
       onPress={isRegister ? handleRegister : handleLogin}
       style={{ marginBottom: 10, backgroundColor: '#1976d2' }}
      >
       {isRegister ? 'Register' : 'Login'}
      </Button>
      <Text
        style={{ marginTop: 10, color: '#1976d2', textAlign: 'center' }}
        onPress={() => {
          setIsRegister(!isRegister);
          setMessage('');
        }}
      >
        {isRegister ? 'Already have an account? Login' : "Don't have an account? Register"}
      </Text>
      {message ? <Text style={{ marginTop: 20, textAlign: 'center', color: '#d32f2f' }}>{message}</Text> : null}
    </View>
  );
}

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Dashboard" component={DashboardScreen} />
          <Stack.Screen name="AyurvedicRemedies" component={AyurvedicRemediesScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
} 