
import React from 'react';
import { View, Image, ImageBackground, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { Button, Text, Card, Divider } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

export default function LandingScreen({ navigation }) {
  const features = [
    {
      title: "🌿 Personalized Prakriti Assessment",
      description: "Discover your unique Ayurvedic constitution and get personalized health recommendations"
    },
    {
      title: "🏥 Expert Consultations",
      description: "Connect with certified Ayurvedic doctors and nutritionists for professional guidance"
    },
    {
      title: "💊 Natural Remedies Database",
      description: "Access thousands of time-tested Ayurvedic remedies for common health issues"
    },
    {
      title: "🍽️ Nutrition Tracking",
      description: "Monitor your daily nutrition intake with Ayurvedic dietary principles"
    }
  ];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#e8f5e8', '#c8e6c9', '#a5d6a7']}
        style={styles.gradient}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* Header Section */}
          <View style={styles.headerSection}>
            <View style={styles.logoContainer}>
              <Text style={styles.logoEmoji}>🌿</Text>
            </View>
            <Text variant="headlineLarge" style={styles.title}>
              Ayur HealthPlix
            </Text>
            <Text style={styles.subtitle}>
              Ancient Wisdom • Modern Technology • Personalized Care
            </Text>
          </View>

          {/* About Section */}
          <Card style={styles.aboutCard}>
            <Card.Content>
              <Text variant="headlineSmall" style={styles.sectionTitle}>
                About Ayurveda
              </Text>
              <Text style={styles.aboutText}>
                Ayurveda, the 5000-year-old "Science of Life", offers holistic solutions for modern health challenges. 
                Our platform bridges ancient wisdom with cutting-edge technology to provide personalized healthcare solutions.
              </Text>
            </Card.Content>
          </Card>

          {/* Features Section */}
          <View style={styles.featuresSection}>
            <Text variant="headlineSmall" style={styles.sectionTitle}>
              What We Offer
            </Text>
            {features.map((feature, index) => (
              <Card key={index} style={styles.featureCard}>
                <Card.Content>
                  <Text variant="titleMedium" style={styles.featureTitle}>
                    {feature.title}
                  </Text>
                  <Text style={styles.featureDescription}>
                    {feature.description}
                  </Text>
                </Card.Content>
              </Card>
            ))}
          </View>

          {/* Benefits Section */}
          <Card style={styles.benefitsCard}>
            <Card.Content>
              <Text variant="headlineSmall" style={styles.sectionTitle}>
                Why Choose Ayur HealthPlix?
              </Text>
              <View style={styles.benefitsList}>
                <Text style={styles.benefitItem}>✅ Personalized health assessments</Text>
                <Text style={styles.benefitItem}>✅ Evidence-based natural remedies</Text>
                <Text style={styles.benefitItem}>✅ Expert medical consultations</Text>
                <Text style={styles.benefitItem}>✅ Comprehensive lifestyle guidance</Text>
                <Text style={styles.benefitItem}>✅ Track your wellness journey</Text>
              </View>
            </Card.Content>
          </Card>

          {/* CTA Section */}
          <View style={styles.ctaSection}>
            <Text style={styles.ctaText}>
              Ready to begin your wellness journey?
            </Text>
            <Button
              mode="contained"
              onPress={() => navigation.navigate('Login')}
              style={styles.getStartedButton}
              labelStyle={styles.buttonLabel}
              contentStyle={styles.buttonContent}
            >
              Get Started
            </Button>
            <Text style={styles.footerText}>
              Join thousands who trust Ayur HealthPlix for their wellness needs
            </Text>
          </View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  headerSection: {
    alignItems: 'center',
    paddingVertical: 50,
    paddingHorizontal: 20,
  },
  logoContainer: {
    width: 100,
    height: 100,
    backgroundColor: '#ffffff',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  logoEmoji: {
    fontSize: 40,
  },
  title: {
    color: '#2e7d32',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    color: '#4caf50',
    fontSize: 16,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  aboutCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 15,
  },
  sectionTitle: {
    color: '#2e7d32',
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  aboutText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#424242',
    textAlign: 'center',
  },
  featuresSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  featureCard: {
    marginBottom: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
  },
  featureTitle: {
    color: '#2e7d32',
    marginBottom: 8,
    fontWeight: '600',
  },
  featureDescription: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
  benefitsCard: {
    marginHorizontal: 20,
    marginBottom: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 15,
  },
  benefitsList: {
    marginTop: 10,
  },
  benefitItem: {
    fontSize: 16,
    color: '#424242',
    marginBottom: 8,
    paddingLeft: 10,
  },
  ctaSection: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  ctaText: {
    fontSize: 18,
    color: '#2e7d32',
    textAlign: 'center',
    marginBottom: 25,
    fontWeight: '600',
  },
  getStartedButton: {
    backgroundColor: '#4caf50',
    borderRadius: 25,
    marginBottom: 20,
    shadowColor: '#4caf50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonContent: {
    paddingVertical: 8,
    paddingHorizontal: 30,
  },
  buttonLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  footerText: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

