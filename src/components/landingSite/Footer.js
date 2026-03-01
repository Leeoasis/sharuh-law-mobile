import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Footer = () => {
  const navigation = useNavigation();

  const handleEmailPress = () => {
    Linking.openURL('mailto:support@legalsuise.com');
  };

  const handlePhonePress = () => {
    Linking.openURL('tel:+15551234567');
  };

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About Us</Text>
        <Text style={styles.text}>
          Legal Suise is your trusted platform for finding legal experts quickly and efficiently.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Links</Text>
        <TouchableOpacity onPress={() => navigation.navigate('About')}>
          <Text style={styles.link}>About Us</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Contact')}>
          <Text style={styles.link}>Contact Us</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Registration')}>
          <Text style={styles.link}>Register</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact Us</Text>
        <TouchableOpacity onPress={handleEmailPress}>
          <Text style={styles.link}>support@legalsuise.com</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handlePhonePress}>
          <Text style={styles.link}>(555) 123-4567</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.copyright}>
        <Text style={styles.copyrightText}>
          © {new Date().getFullYear()} Legal Suise. All rights reserved.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#111827',
    padding: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fbbf24',
    marginBottom: 12,
  },
  text: {
    color: '#9ca3af',
    fontSize: 14,
    lineHeight: 20,
  },
  link: {
    color: '#d1d5db',
    fontSize: 14,
    marginBottom: 8,
  },
  copyright: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#374151',
    alignItems: 'center',
  },
  copyrightText: {
    color: '#6b7280',
    fontSize: 12,
  },
});

export default Footer;
