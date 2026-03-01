import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';

const WelcomePage = ({ navigation }) => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>Legal Suise</Text>
        <Text style={styles.heroSubtitle}>Your Trusted Legal Partner</Text>
        <View style={styles.buttonGroup}>
          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={() => navigation.navigate('Registration')}
          >
            <Text style={styles.primaryButtonText}>Get Started</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.secondaryButton}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.secondaryButtonText}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Our Services</Text>
        
        <View style={styles.serviceCard}>
          <Text style={styles.serviceTitle}>Criminal Law</Text>
          <Text style={styles.serviceDescription}>
            Court representation for all criminal charges, bail applications, and appeals.
          </Text>
        </View>

        <View style={styles.serviceCard}>
          <Text style={styles.serviceTitle}>Family Law</Text>
          <Text style={styles.serviceDescription}>
            Divorce settlements, child custody, adoption, and estate disputes.
          </Text>
        </View>

        <View style={styles.serviceCard}>
          <Text style={styles.serviceTitle}>Corporate Law</Text>
          <Text style={styles.serviceDescription}>
            Business formation, contracts, compliance, and commercial disputes.
          </Text>
        </View>

        <View style={styles.serviceCard}>
          <Text style={styles.serviceTitle}>Labor Law</Text>
          <Text style={styles.serviceDescription}>
            Employment disputes, contract negotiation, and wrongful termination.
          </Text>
        </View>

        <View style={styles.serviceCard}>
          <Text style={styles.serviceTitle}>Immigration Law</Text>
          <Text style={styles.serviceDescription}>
            Visa applications, work permits, and citizenship assistance.
          </Text>
        </View>

        <View style={styles.serviceCard}>
          <Text style={styles.serviceTitle}>Real Estate Law</Text>
          <Text style={styles.serviceDescription}>
            Property transactions, title disputes, and landlord-tenant matters.
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Why Choose Us</Text>
        <View style={styles.featureCard}>
          <Text style={styles.featureTitle}>Expert Legal Team</Text>
          <Text style={styles.featureDescription}>
            Our team of experienced lawyers provides top-notch legal services.
          </Text>
        </View>
        <View style={styles.featureCard}>
          <Text style={styles.featureTitle}>Client-Focused Approach</Text>
          <Text style={styles.featureDescription}>
            We prioritize your needs and work tirelessly for the best outcomes.
          </Text>
        </View>
        <View style={styles.featureCard}>
          <Text style={styles.featureTitle}>Affordable Services</Text>
          <Text style={styles.featureDescription}>
            Quality legal representation doesn't have to break the bank.
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity onPress={() => navigation.navigate('About')}>
          <Text style={styles.footerLink}>About Us</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Contact')}>
          <Text style={styles.footerLink}>Contact</Text>
        </TouchableOpacity>
        <Text style={styles.copyright}>© 2024 Legal Suise. All rights reserved.</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  hero: {
    backgroundColor: '#1f2937',
    padding: 40,
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 18,
    color: '#d1d5db',
    marginBottom: 24,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 12,
  },
  primaryButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginHorizontal: 6,
  },
  primaryButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  secondaryButton: {
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginHorizontal: 6,
  },
  secondaryButtonText: {
    color: '#1f2937',
    fontWeight: 'bold',
    fontSize: 16,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#1f2937',
  },
  serviceCard: {
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  serviceTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1f2937',
  },
  serviceDescription: {
    fontSize: 14,
    color: '#6b7280',
  },
  featureCard: {
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1f2937',
  },
  featureDescription: {
    fontSize: 14,
    color: '#6b7280',
  },
  footer: {
    backgroundColor: '#1f2937',
    padding: 24,
    alignItems: 'center',
  },
  footerLink: {
    color: '#d1d5db',
    fontSize: 16,
    marginBottom: 8,
  },
  copyright: {
    color: '#9ca3af',
    fontSize: 14,
    marginTop: 12,
  },
});

export default WelcomePage;
