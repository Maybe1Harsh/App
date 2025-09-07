
import React from 'react';
import { View, Image, ImageBackground, ScrollView } from 'react-native';
import { Button, Text } from 'react-native-paper';

export default function LandingScreen({ navigation }) {
  return (
    <ImageBackground
      source={require('./assets/images/splash-icon.png')}
      style={{ flex: 1, resizeMode: 'cover' }}
      imageStyle={{ opacity: 0.25 }}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Image
          source={require('./assets/images/icon.png')}
          style={{ width: 120, height: 120, marginBottom: 30 }}
          resizeMode="contain"
        />
        <Text variant="headlineLarge" style={{ color: '#1565c0', marginBottom: 10, textAlign: 'center' }}>
          Welcome to Ayur Healthplix
        </Text>
        <Text style={{ color: '#1976d2', marginBottom: 20, textAlign: 'center', fontSize: 16 }}>
          Your personalized Ayurvedic health companion
        </Text>
        <Text style={{ color: '#333', marginBottom: 30, textAlign: 'center', fontSize: 15, backgroundColor: 'rgba(255,255,255,0.8)', borderRadius: 10, padding: 12 }}>
          Ayurveda, the ancient science of life, offers holistic solutions for modern health challenges. At Ayur Healthplix, we blend traditional wisdom with modern technology to provide you with personalized remedies, lifestyle guidance, and wellness tips. Discover your unique prakriti, explore natural remedies for common ailments, and embark on a journey towards balance and well-being. Our platform is designed to empower you with knowledge, connect you to authentic Ayurvedic resources, and support your health goals every step of the way. Whether you are new to Ayurveda or a seasoned practitioner, Ayur Healthplix is your trusted companion for a healthier, happier life.
        </Text>
        <Button
          mode="contained"
          onPress={() => navigation.replace('Login')}
          style={{ backgroundColor: '#139832ff', paddingHorizontal: 30 }}
          labelStyle={{ fontSize: 18 }}
        >
          Login
        </Button>
      </ScrollView>
    </ImageBackground>
  );
}
