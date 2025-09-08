import * as React from 'react';
import { View } from 'react-native';
import { TextInput, Button, Text, Provider as PaperProvider, RadioButton } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { supabase } from './supabaseClient';
import DashboardScreen from './Dashboard';
import AyurvedicRemediesScreen from './AyurvedicRemedies';
import DoctorDashboardScreen from './DoctorDashboard';
import PatientPrescriptionsScreen from './PatientPrescriptions';
import PrakritiGuesserScreen from './PrakritiGuesser';
import CalorieCounter from './CalorieCounter';
import NearbyDieticiansScreen from './NearbyDieticiansScreen';

const Stack = createNativeStackNavigator();

function LoginScreen({ navigation }) {
  const [role, setRole] = React.useState('patient');
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
    if (error) {
      setMessage(error.message);
      return;
    }
    // Fetch profile from Supabase
    const { data: profileData, error: profileError } = await supabase
      .from('Profiles')
      .select('*')
      .eq('email', email)
      .single();

    if (profileError || !profileData) {
      setMessage('Profile not found.');
      return;
    }

    setMessage('Login successful!');
    if (profileData.Role === 'doctor') {
      navigation.replace('DoctorDashboard', { profile: profileData });
    } else {
      navigation.replace('Dashboard', { profile: profileData });
    }
  };

  const handleRegister = async () => {
    if (!name || !age || !email || !password) {
      setMessage('Please fill all fields.');
      return;
    }
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    setMessage(error ? error.message : 'Registration successful! Check your email.');

    // Insert profile only if registration succeeded
    if (!error) {
      const { error: insertError } = await supabase
        .from('Profiles')
        .insert([
          {
            name: name,
            age: parseInt(age),
            email: email,
            Role: role
          }
        ]);
      if (insertError) {
        setMessage('Error saving profile: ' + insertError.message);
      }
    }
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
          <Text style={{ marginBottom: 5 }}>Register as:</Text>
          <RadioButton.Group onValueChange={setRole} value={role}>
            <RadioButton.Item label="Patient" value="patient" />
            <RadioButton.Item label="Doctor/Dietician" value="doctor" />
          </RadioButton.Group>
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
          <Stack.Screen name="DoctorDashboard" component={DoctorDashboardScreen} />
          <Stack.Screen name="Dashboard" component={DashboardScreen} />
          <Stack.Screen name="AyurvedicRemedies" component={AyurvedicRemediesScreen} />
          <Stack.Screen name="PatientPrescriptions" component={PatientPrescriptionsScreen} />
          <Stack.Screen name="PrakritiGuesser" component={PrakritiGuesserScreen} />
          <Stack.Screen name="CalorieCounter" component={CalorieCounter} />
          <Stack.Screen name="NearbyDieticiansScreen" component={NearbyDieticiansScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}

