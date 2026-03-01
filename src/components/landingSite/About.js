import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

const About = ({ navigation }) => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>About Legal Suise</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Our Story</Text>
        <Text style={styles.paragraph}>
          Legal Suise was founded with a simple mission: to provide accessible, 
          high-quality legal services to individuals and businesses. With years 
          of combined experience, our team of dedicated lawyers has helped thousands 
          of clients navigate complex legal challenges.
        </Text>

        <Text style={styles.sectionTitle}>Our Mission</Text>
        <Text style={styles.paragraph}>
          We believe that everyone deserves access to quality legal representation. 
          Our mission is to demystify the legal process and provide clear, effective 
          solutions tailored to each client's unique needs.
        </Text>

        <Text style={styles.sectionTitle}>Our Values</Text>
        <View style={styles.valueCard}>
          <Text style={styles.valueTitle}>Integrity</Text>
          <Text style={styles.valueDescription}>
            We uphold the highest ethical standards in all our professional dealings.
          </Text>
        </View>

        <View style={styles.valueCard}>
          <Text style={styles.valueTitle}>Excellence</Text>
          <Text style={styles.valueDescription}>
            We strive for excellence in every case we handle.
          </Text>
        </View>

        <View style={styles.valueCard}>
          <Text style={styles.valueTitle}>Client-Centered</Text>
          <Text style={styles.valueDescription}>
            Your needs and goals are always our top priority.
          </Text>
        </View>

        <View style={styles.valueCard}>
          <Text style={styles.valueTitle}>Innovation</Text>
          <Text style={styles.valueDescription}>
            We leverage technology to provide efficient, modern legal services.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    backgroundColor: '#1f2937',
    padding: 16,
  },
  backButton: {
    color: '#d1d5db',
    fontSize: 16,
    marginBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
  content: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 12,
    color: '#1f2937',
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    color: '#4b5563',
    marginBottom: 16,
  },
  valueCard: {
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  valueTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1f2937',
  },
  valueDescription: {
    fontSize: 14,
    color: '#6b7280',
  },
});

export default About;
