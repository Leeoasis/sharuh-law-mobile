import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ImageBackground } from 'react-native';
import Toast from 'react-native-toast-message';
import Navbar from './Navbar';
import Footer from './Footer';

const Contact = ({ navigation }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.email || !formData.message) {
      Toast.show({
        type: 'error',
        text1: 'Missing Fields',
        text2: 'Please fill in all required fields',
      });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Toast.show({
        type: 'error',
        text1: 'Invalid Email',
        text2: 'Please enter a valid email address',
      });
      return;
    }

    Toast.show({
      type: 'success',
      text1: 'Message Sent!',
      text2: 'We will get back to you soon.',
    });
    
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  return (
    <ScrollView style={styles.container}>
      <Navbar />

      {/* Hero Section */}
      <ImageBackground
        source={require('../../../assets/cta-background.jpeg')}
        style={styles.hero}
        resizeMode="cover"
      >
        <View style={styles.heroOverlay}>
          <Text style={styles.heroTitle}>Get In Touch</Text>
          <Text style={styles.heroSubtitle}>
            We're here to help with your legal needs
          </Text>
        </View>
      </ImageBackground>

      {/* Contact Form */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Send Us a Message</Text>
        <Text style={styles.description}>
          Have a question or need legal assistance? Fill out the form below and 
          we'll get back to you as soon as possible.
        </Text>

        <View style={styles.form}>
          <Text style={styles.label}>Full Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="Your full name"
            placeholderTextColor="#9ca3af"
            value={formData.name}
            onChangeText={(value) => handleChange('name', value)}
          />

          <Text style={styles.label}>Email Address *</Text>
          <TextInput
            style={styles.input}
            placeholder="your.email@example.com"
            placeholderTextColor="#9ca3af"
            value={formData.email}
            onChangeText={(value) => handleChange('email', value)}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.input}
            placeholder="+1 (555) 123-4567"
            placeholderTextColor="#9ca3af"
            value={formData.phone}
            onChangeText={(value) => handleChange('phone', value)}
            keyboardType="phone-pad"
          />

          <Text style={styles.label}>Subject</Text>
          <TextInput
            style={styles.input}
            placeholder="Brief subject of your inquiry"
            placeholderTextColor="#9ca3af"
            value={formData.subject}
            onChangeText={(value) => handleChange('subject', value)}
          />

          <Text style={styles.label}>Message *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Describe your legal matter or question..."
            placeholderTextColor="#9ca3af"
            value={formData.message}
            onChangeText={(value) => handleChange('message', value)}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
          />

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Send Message</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Contact Information */}
      <View style={[styles.section, styles.sectionAlt]}>
        <Text style={styles.sectionTitle}>Contact Information</Text>
        <Text style={styles.description}>
          You can also reach us through the following channels:
        </Text>

        <View style={styles.infoCard}>
          <View style={styles.infoIcon}>
            <Text style={styles.infoIconText}>📧</Text>
          </View>
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoValue}>support@legalsuise.com</Text>
          </View>
        </View>

        <View style={styles.infoCard}>
          <View style={styles.infoIcon}>
            <Text style={styles.infoIconText}>📞</Text>
          </View>
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Phone</Text>
            <Text style={styles.infoValue}>+1 (555) 123-4567</Text>
          </View>
        </View>

        <View style={styles.infoCard}>
          <View style={styles.infoIcon}>
            <Text style={styles.infoIconText}>📍</Text>
          </View>
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Address</Text>
            <Text style={styles.infoValue}>123 Legal Street{"\n"}Law City, LC 12345</Text>
          </View>
        </View>

        <View style={styles.infoCard}>
          <View style={styles.infoIcon}>
            <Text style={styles.infoIconText}>🕐</Text>
          </View>
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Business Hours</Text>
            <Text style={styles.infoValue}>Monday - Friday: 9:00 AM - 6:00 PM{"\n"}Saturday: 10:00 AM - 4:00 PM{"\n"}Sunday: Closed</Text>
          </View>
        </View>
      </View>

      {/* Why Choose Us */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Why Contact Legal Suise?</Text>
        
        <View style={styles.benefitCard}>
          <Text style={styles.benefitTitle}>⚡ Fast Response</Text>
          <Text style={styles.benefitText}>
            We typically respond to inquiries within 24 hours.
          </Text>
        </View>

        <View style={styles.benefitCard}>
          <Text style={styles.benefitTitle}>🎯 Expert Guidance</Text>
          <Text style={styles.benefitText}>
            Our team will match you with the right legal expert.
          </Text>
        </View>

        <View style={styles.benefitCard}>
          <Text style={styles.benefitTitle}>🔒 Confidential</Text>
          <Text style={styles.benefitText}>
            All communications are secure and confidential.
          </Text>
        </View>

        <View style={styles.benefitCard}>
          <Text style={styles.benefitTitle}>💯 No Obligation</Text>
          <Text style={styles.benefitText}>
            Initial consultations are free with no commitment required.
          </Text>
        </View>
      </View>

      <Footer />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  hero: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroOverlay: {
    backgroundColor: 'rgba(30, 58, 138, 0.8)',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  heroTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#e5e7eb',
    textAlign: 'center',
  },
  section: {
    padding: 24,
    backgroundColor: 'white',
  },
  sectionAlt: {
    backgroundColor: '#f9fafb',
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 24,
    lineHeight: 24,
  },
  form: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#1f2937',
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    marginBottom: 16,
    color: '#111827',
  },
  textArea: {
    height: 140,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#1e40af',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  infoIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#dbeafe',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  infoIconText: {
    fontSize: 24,
  },
  infoContent: {
    flex: 1,
    justifyContent: 'center',
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#6b7280',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 15,
    color: '#1f2937',
    lineHeight: 22,
  },
  benefitCard: {
    backgroundColor: '#f9fafb',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  benefitTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  benefitText: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
});

export default Contact;

