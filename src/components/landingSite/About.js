import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ImageBackground, Image } from 'react-native';
import Navbar from './Navbar';
import AppTopBar from '../common/AppTopBar';

const About = ({ navigation }) => {
  const values = [
    {
      icon: '🛡️',
      title: 'Integrity',
      description: 'We uphold the highest ethical standards in all our professional dealings.',
    },
    {
      icon: '⚖️',
      title: 'Excellence',
      description: 'We strive for excellence in every case we handle.',
    },
    {
      icon: '🤝',
      title: 'Client-Centered',
      description: 'Your needs and goals are always our top priority.',
    },
    {
      icon: '💡',
      title: 'Innovation',
      description: 'We leverage technology to provide efficient, modern legal services.',
    },
  ];

  const services = [
    {
      image: require('../../../assets/familylaw.jpeg'),
      problem: 'Going through a divorce or custody battle?',
      context: 'Family disputes are often deeply emotional and complex, requiring legal guidance that balances fairness and compassion.',
      solution: 'Our family lawyers support you with clarity and empathy:',
      bullets: [
        'Divorce and separation settlements',
        'Child custody and visitation rights',
        'Adoption and guardianship',
        'Inheritance and estate disputes',
      ],
    },
    {
      image: require('../../../assets/criminallaw.jpeg'),
      problem: 'Facing criminal charges?',
      context: 'A criminal accusation can put your freedom, reputation, and livelihood on the line.',
      solution: 'Our defense attorneys fight tirelessly to ensure justice:',
      bullets: [
        'Representation in court hearings and trials',
        'Bail applications and appeals',
        'Negotiation of reduced sentences',
        'Protection of constitutional rights',
      ],
    },
    {
      image: require('../../../assets/corporatelaw.jpeg'),
      problem: 'Building or running a business?',
      context: 'Businesses face daily legal challenges, from contracts to compliance.',
      solution: 'We ensure your growth is protected:',
      bullets: [
        'Business formation and registration',
        'Contract drafting and review',
        'Intellectual property protection',
        'Mergers and acquisitions',
      ],
    },
  ];

  return (
    <View style={styles.screen}>
      <AppTopBar />
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>

      {/* Hero Section */}
      <ImageBackground
        source={require('../../../assets/aboutB.jpeg')}
        style={styles.hero}
        resizeMode="cover"
      >
        <View style={styles.heroOverlay}>
          <Text style={styles.heroTitle}>About Legal Suise</Text>
          <Text style={styles.heroSubtitle}>
            Connecting clients with justice through innovation and trust
          </Text>
        </View>
      </ImageBackground>

      {/* Our Story */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Our Story</Text>
        <Text style={styles.paragraph}>
          Legal Suise was founded with a simple mission: to provide accessible, 
          high-quality legal services to individuals and businesses. With years 
          of combined experience, our team of dedicated lawyers has helped thousands 
          of clients navigate complex legal challenges.
        </Text>
        
        <Image
          source={require('../../../assets/ourstory.png')}
          style={styles.sectionImage}
          resizeMode="cover"
        />
      </View>

      {/* Our Mission */}
      <View style={[styles.section, styles.sectionAlt]}>
        <Text style={styles.sectionTitle}>Our Mission</Text>
        <Text style={styles.paragraph}>
          We believe that everyone deserves access to quality legal representation. 
          Our mission is to demystify the legal process and provide clear, effective 
          solutions tailored to each client's unique needs.
        </Text>
        <Text style={styles.paragraph}>
          At Legal Suise, we're building a platform where:
        </Text>
        <Text style={styles.bulletPoint}>• Clients can find trusted lawyers quickly</Text>
        <Text style={styles.bulletPoint}>• Lawyers can expand their practice efficiently</Text>
        <Text style={styles.bulletPoint}>• Legal services are transparent and accessible</Text>
        <Text style={styles.bulletPoint}>• Technology enhances the legal experience</Text>
      </View>

      {/* Our Values */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Our Core Values</Text>
        <Text style={styles.paragraph}>
          These principles guide everything we do:
        </Text>
        
        {values.map((value, index) => (
          <View key={index} style={styles.valueCard}>
            <View style={styles.valueIcon}>
              <Text style={styles.valueIconText}>{value.icon}</Text>
            </View>
            <View style={styles.valueContent}>
              <Text style={styles.valueTitle}>{value.title}</Text>
              <Text style={styles.valueDescription}>{value.description}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* What We Do */}
      <View style={[styles.section, styles.sectionAlt]}>
        <Text style={styles.sectionTitle}>What We Do</Text>
        <Text style={styles.paragraph}>
          We connect clients with expert lawyers across various practice areas:
        </Text>

        {services.map((service, index) => (
          <View key={index} style={styles.serviceCard}>
            <Image
              source={service.image}
              style={styles.serviceImage}
              resizeMode="cover"
            />
            <Text style={styles.serviceProblem}>{service.problem}</Text>
            <Text style={styles.serviceContext}>{service.context}</Text>
            <Text style={styles.serviceSolution}>{service.solution}</Text>
            {service.bullets.map((bullet, idx) => (
              <Text key={idx} style={styles.serviceBullet}>• {bullet}</Text>
            ))}
          </View>
        ))}
      </View>

      {/* Why Choose Us */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Why Legal Suise?</Text>
        
        <View style={styles.whyCard}>
          <Text style={styles.whyTitle}>🎯 Verified Professionals</Text>
          <Text style={styles.whyText}>
            Every lawyer on our platform is thoroughly vetted and verified.
          </Text>
        </View>

        <View style={styles.whyCard}>
          <Text style={styles.whyTitle}>⚡ Fast Matching</Text>
          <Text style={styles.whyText}>
            Our AI-powered system connects you with the right lawyer quickly.
          </Text>
        </View>

        <View style={styles.whyCard}>
          <Text style={styles.whyTitle}>💎 Transparent Pricing</Text>
          <Text style={styles.whyText}>
            No hidden fees. Know exactly what you're paying for.
          </Text>
        </View>

        <View style={styles.whyCard}>
          <Text style={styles.whyTitle}>🔒 Secure Platform</Text>
          <Text style={styles.whyText}>
            Your data and communications are encrypted and protected.
          </Text>
        </View>
      </View>

      {/* CTA */}
      <ImageBackground
        source={require('../../../assets/cta-background.jpeg')}
        style={styles.ctaBanner}
        resizeMode="cover"
      >
        <View style={styles.ctaOverlay}>
          <Text style={styles.ctaTitle}>Ready to Get Started?</Text>
          <Text style={styles.ctaText}>
            Join thousands of satisfied clients who found the perfect lawyer on Legal Suise.
          </Text>
          <TouchableOpacity
            style={styles.ctaButton}
            onPress={() => navigation.navigate('Registration')}
          >
            <Text style={styles.ctaButtonText}>Join Now</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>

      </ScrollView>
      <Navbar />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: 'white',
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  contentContainer: {
    paddingBottom: 72,
  },
  hero: {
    height: 250,
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
    marginBottom: 12,
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
    marginBottom: 16,
  },
  paragraph: {
    fontSize: 16,
    color: '#4b5563',
    lineHeight: 24,
    marginBottom: 16,
  },
  sectionImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginTop: 16,
  },
  bulletPoint: {
    fontSize: 15,
    color: '#374151',
    marginBottom: 8,
    lineHeight: 22,
  },
  valueCard: {
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
  valueIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#dbeafe',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  valueIconText: {
    fontSize: 24,
  },
  valueContent: {
    flex: 1,
  },
  valueTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  valueDescription: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  serviceCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  serviceImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 12,
  },
  serviceProblem: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#dc2626',
    marginBottom: 8,
  },
  serviceContext: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 12,
    lineHeight: 20,
  },
  serviceSolution: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1e40af',
    marginBottom: 8,
  },
  serviceBullet: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 4,
    lineHeight: 20,
  },
  whyCard: {
    backgroundColor: '#f9fafb',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  whyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  whyText: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  ctaBanner: {
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ctaOverlay: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  ctaTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: 16,
    textAlign: 'center',
  },
  ctaText: {
    fontSize: 16,
    color: '#374151',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  ctaButton: {
    backgroundColor: '#fbbf24',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 24,
  },
  ctaButtonText: {
    color: '#111827',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default About;
