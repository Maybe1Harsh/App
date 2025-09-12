import * as React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, Text, Provider as PaperProvider, RadioButton, Card } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { supabase } from './supabaseClient';
import LandingScreen from './Landingpage';
import DashboardScreen from './Dashboard';
import AyurvedicRemediesScreen from './AyurvedicRemedies';
import DoctorDashboardScreen from './DoctorDashboard';
import PatientPrescriptionsScreen from './PatientPrescriptions';
import PrakritiGuesserScreen from './PrakritiGuesser';
import CalorieCounter from './CalorieCounter';
import NearbyDieticiansScreen from './NearbyDieticiansScreen';
import AddPatientScreen from './AddPatient';

const Stack = createNativeStackNavigator();

function LoginScreen({ navigation }) {
  const [role, setRole] = React.useState('patient');
  const [loading, setLoading] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [name, setName] = React.useState('');
  const [age, setAge] = React.useState('');
  const [address, setAddress] = React.useState('');
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
    if (!name || !age || !email || !password || !address) {
      setMessage('Please fill all fields including address.');
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
            address: address,
            Role: role
          }
        ]);
      if (insertError) {
        setMessage('Error saving profile: ' + insertError.message);
      }
    }
  };

  return (
    <View style={loginStyles.container}>
      <LinearGradient
        colors={['#e8f5e8', '#c8e6c9', '#a5d6a7']}
        style={loginStyles.gradient}
      >
        <ScrollView contentContainerStyle={loginStyles.scrollContainer}>
          <View style={loginStyles.headerSection}>
            <View style={loginStyles.logoContainer}>
              <Text style={loginStyles.logoEmoji}>🌿</Text>
            </View>
            <Text variant="headlineLarge" style={loginStyles.title}>
              Ayur HealthPlix
            </Text>
            <Text variant="titleMedium" style={loginStyles.subtitle}>
              {isRegister ? 'Create Your Account' : 'Welcome Back'}
            </Text>
          </View>

          <Card style={loginStyles.formCard}>
            <Card.Content style={loginStyles.cardContent}>
              {isRegister && (
                <>
                  <TextInput
                    label="Full Name"
                    value={name}
                    onChangeText={setName}
                    mode="outlined"
                    style={loginStyles.input}
                    left={<TextInput.Icon icon="account" />}
                  />
                  <TextInput
                    label="Age"
                    value={age}
                    onChangeText={setAge}
                    mode="outlined"
                    keyboardType="numeric"
                    style={loginStyles.input}
                    left={<TextInput.Icon icon="calendar" />}
                  />
                  <TextInput
                    label="Address"
                    value={address}
                    onChangeText={setAddress}
                    mode="outlined"
                    multiline
                    numberOfLines={3}
                    style={loginStyles.input}
                    left={<TextInput.Icon icon="map-marker" />}
                    placeholder="Enter your complete address"
                  />
                  <View style={loginStyles.roleSection}>
                    <Text style={loginStyles.roleLabel}>Register as:</Text>
                    <RadioButton.Group onValueChange={setRole} value={role}>
                      <View style={loginStyles.radioContainer}>
                        <RadioButton.Item 
                          label="Patient" 
                          value="patient" 
                          labelStyle={loginStyles.radioLabel}
                        />
                        <RadioButton.Item 
                          label="Doctor/Dietician" 
                          value="doctor" 
                          labelStyle={loginStyles.radioLabel}
                        />
                      </View>
                    </RadioButton.Group>
                  </View>
                </>
              )}
              
              <TextInput
                label="Email Address"
                value={email}
                onChangeText={setEmail}
                mode="outlined"
                keyboardType="email-address"
                autoCapitalize="none"
                style={loginStyles.input}
                left={<TextInput.Icon icon="email" />}
              />
              
              <TextInput
                label="Password"
                value={password}
                onChangeText={setPassword}
                mode="outlined"
                secureTextEntry
                style={loginStyles.input}
                left={<TextInput.Icon icon="lock" />}
              />
              
              <Button
                mode="contained"
                loading={loading}
                disabled={loading}
                onPress={isRegister ? handleRegister : handleLogin}
                style={loginStyles.submitButton}
                labelStyle={loginStyles.submitButtonLabel}
                contentStyle={loginStyles.submitButtonContent}
              >
                {isRegister ? 'Create Account' : 'Sign In'}
              </Button>
              
              <Text
                style={loginStyles.switchText}
                onPress={() => {
                  setIsRegister(!isRegister);
                  setMessage('');
                  setName('');
                  setAge('');
                  setAddress('');
                  setEmail('');
                  setPassword('');
                }}
              >
                {isRegister ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
              </Text>
              
              {message ? (
                <Text style={loginStyles.messageText}>{message}</Text>
              ) : null}
            </Card.Content>
          </Card>
        </ScrollView>
      </LinearGradient>
    </View>
  );
}

const loginStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingVertical: 20,
  },
  headerSection: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  logoContainer: {
    width: 80,
    height: 80,
    backgroundColor: '#ffffff',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  logoEmoji: {
    fontSize: 35,
  },
  title: {
    color: '#2e7d32',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    color: '#4caf50',
    textAlign: 'center',
    fontWeight: '500',
  },
  formCard: {
    marginHorizontal: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 10,
  },
  cardContent: {
    padding: 25,
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#ffffff',
  },
  roleSection: {
    marginBottom: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 12,
  },
  roleLabel: {
    fontSize: 16,
    color: '#2e7d32',
    fontWeight: '600',
    marginBottom: 8,
  },
  radioContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  radioLabel: {
    fontSize: 14,
    color: '#424242',
  },
  submitButton: {
    backgroundColor: '#4caf50',
    borderRadius: 25,
    marginTop: 10,
    marginBottom: 20,
    shadowColor: '#4caf50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  submitButtonContent: {
    paddingVertical: 8,
  },
  submitButtonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  switchText: {
    color: '#4caf50',
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
  messageText: {
    marginTop: 15,
    textAlign: 'center',
    color: '#d32f2f',
    fontSize: 14,
    backgroundColor: '#ffebee',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ffcdd2',
  },
});

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Landing">
          <Stack.Screen name="Landing" component={LandingScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="DoctorDashboard" component={DoctorDashboardScreen} />
          <Stack.Screen name="AddPatient" component={AddPatientScreen} />
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
