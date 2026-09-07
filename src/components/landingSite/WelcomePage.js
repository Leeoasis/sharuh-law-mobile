import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, ImageBackground } from 'react-native';
import Navbar from './Navbar';
import AppTopBar from '../common/AppTopBar';

const WelcomePage = ({ navigation }) => {
  const services = [
    {
      image: require('../../../assets/criminallaw.jpeg'),
      title: 'Criminal Law',
      context: 'Facing criminal charges can be overwhelming. Whether it\'s minor offenses or serious accusations, your future is at stake.',
      bullets: [
        'Court representation for all criminal charges',
        'Bail applications and appeals',
        'Negotiation for reduced sentences',
        'Protection of constitutional rights',
      ],
    },
    {
      image: require('../../../assets/familylaw.jpeg'),
      title: 'Family Law',
      context: 'Family disputes are deeply personal and require compassionate yet firm legal support.',
      bullets: [
        'Divorce and separation settlements',
        'Child custody and visitation rights',
        'Adoption and guardianship',
        'Inheritance and estate disputes',
      ],
    },
    {
      image: require('../../../assets/corporatelaw.jpeg'),
      title: 'Corporate Law',
      context: 'Businesses face daily legal challenges, from contracts to compliance. We ensure your growth is protected.',
      bullets: [
        'Business formation and registration',
        'Contract drafting and review',
        'Intellectual property protection',
        'Mergers, acquisitions, and compliance',
      ],
    },
    {
      image: require('../../../assets/labor.jpeg'),
      title: 'Labor Law',
      context: 'Workplace conflicts can impact livelihoods and morale. Protect your rights as an employee or employer.',
      bullets: [
        'Unfair dismissal claims',
        'Workplace harassment and discrimination',
        'Employment contract disputes',
        'Union and collective bargaining matters',
      ],
    },
    {
      image: require('../../../assets/immigration.jpeg'),
      title: 'Immigration',
      context: 'Immigration procedures are complex and stressful. Our experts guide you through every step.',
      bullets: [
        'Visa and residency applications',
        'Citizenship and naturalization',
        'Asylum and refugee cases',
        'Appeals for rejected applications',
      ],
    },
    {
      image: require('../../../assets/realestate.jpeg'),
      title: 'Real Estate',
      context: 'Property deals involve high-value risks. Legal expertise ensures smooth transactions.',
      bullets: [
        'Property transfers and deeds',
        'Lease and rental agreements',
        'Dispute resolution for property conflicts',
        'Land development and zoning compliance',
      ],
    },
  ];

  return (
    <View style={styles.screen}>
      <AppTopBar />
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>

      {/* Hero Section */}
      <ImageBackground
        source={require('../../../assets/analysis.jpeg')}
        style={styles.hero}
        resizeMode="cover"
      >
        <View style={styles.heroOverlay}>
          <Text style={styles.heroTitle}>Legal Suise</Text>
          <Text style={styles.heroSubtitle}>
            Where law meets innovation. Legal Suise is the ultimate digital bridge between clients and trusted lawyers.
          </Text>
          <View style={styles.heroButtons}>
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
              <Text style={styles.secondaryButtonText}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>

      {/* Why Choose Us */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Why Clients Choose Legal Suise</Text>
        <Text style={styles.sectionSubtitle}>
          Finding the right lawyer shouldn't feel overwhelming. At Legal Suise, we make legal help accessible, transparent, and built around your needs.
        </Text>

        <View style={styles.featureList}>
          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Text style={styles.featureIconText}>⚖️</Text>
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureText}>
                <Text style={styles.featureBold}>Top Lawyers,</Text> vetted and ready to handle even the most complex cases.
              </Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Text style={styles.featureIconText}>💰</Text>
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureText}>
                <Text style={styles.featureBold}>Clear Pricing,</Text> no hidden fees or billing surprises.
              </Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Text style={styles.featureIconText}>🔒</Text>
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureText}>
                <Text style={styles.featureBold}>Privacy Guaranteed,</Text> with secure and confidential handling of your case.
              </Text>
            </View>
          </View>
        </View>

        <Image
          source={require('../../../assets/ourstory.png')}
          style={styles.sectionImage}
          resizeMode="cover"
        />
      </View>

      {/* How It Works */}
      <View style={[styles.section, styles.sectionAlt]}>
        <Text style={styles.sectionTitle}>How It Works</Text>
        <Text style={styles.sectionSubtitle}>
          Connecting clients and lawyers in 3 powerful steps.
        </Text>

        <View style={styles.stepsContainer}>
          <View style={styles.stepCard}>
            <View style={styles.stepIcon}>
              <Text style={styles.stepIconText}>📄</Text>
            </View>
            <Text style={styles.stepTitle}>1. Post Your Case</Text>
            <Text style={styles.stepText}>Describe your legal issue with confidence.</Text>
          </View>

          <View style={styles.stepCard}>
            <View style={styles.stepIcon}>
              <Text style={styles.stepIconText}>💬</Text>
            </View>
            <Text style={styles.stepTitle}>2. Get Matched</Text>
            <Text style={styles.stepText}>AI-driven matching with top lawyers.</Text>
          </View>

          <View style={styles.stepCard}>
            <View style={styles.stepIcon}>
              <Text style={styles.stepIconText}>🤝</Text>
            </View>
            <Text style={styles.stepTitle}>3. Resolve</Text>
            <Text style={styles.stepText}>Collaborate securely to reach success.</Text>
          </View>
        </View>
      </View>

      {/* Services */}
      {services.map((service, index) => (
        <View
          key={index}
          style={[styles.serviceSection, index % 2 === 0 ? styles.sectionAlt : null]}
        >
          <Image
            source={service.image}
            style={styles.serviceImage}
            resizeMode="cover"
          />
          <View style={styles.serviceContent}>
            <Text style={styles.serviceTitle}>{service.title}</Text>
            <Text style={styles.serviceContext}>{service.context}</Text>
            {service.bullets.map((bullet, idx) => (
              <Text key={idx} style={styles.serviceBullet}>• {bullet}</Text>
            ))}
            <TouchableOpacity
              style={styles.serviceButton}
              onPress={() => navigation.navigate('Registration')}
            >
              <Text style={styles.serviceButtonText}>Get Started</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}

      {/* Testimonials */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Client Success Stories</Text>
        
        <View style={styles.testimonialCard}>
          <Text style={styles.testimonialText}>
            "Legal Suise helped me resolve a major business dispute in weeks instead of months."
          </Text>
          <Text style={styles.testimonialAuthor}>– Sarah M.</Text>
        </View>

        <View style={styles.testimonialCard}>
          <Text style={styles.testimonialText}>
            "A futuristic platform. I felt safe, supported, and empowered."
          </Text>
          <Text style={styles.testimonialAuthor}>– Daniel K.</Text>
        </View>
      </View>

      {/* CTA Banner */}
      <ImageBackground
        source={require('../../../assets/cta-background.jpeg')}
        style={styles.ctaBanner}
        resizeMode="cover"
      >
        <View style={styles.ctaOverlay}>
          <Text style={styles.ctaTitle}>Ready to Experience Legal Suise?</Text>
          <Text style={styles.ctaSubtitle}>
            Take the first step into the future of law today. Sign up and connect with trusted legal professionals.
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
    paddingBottom: 88,
  },
  hero: {
    height: 500,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroOverlay: {
    backgroundColor: 'rgba(30, 58, 138, 0.75)',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  heroTitle: {
    fontSize: 48,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 16,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 18,
    color: '#e5e7eb',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 26,
    paddingHorizontal: 20,
  },
  heroButtons: {
    flexDirection: 'row',
    gap: 16,
  },
  primaryButton: {
    backgroundColor: '#fbbf24',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 24,
  },
  primaryButtonText: {
    color: '#111827',
    fontWeight: 'bold',
    fontSize: 16,
  },
  secondaryButton: {
    backgroundColor: '#1e40af',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 24,
  },
  secondaryButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  section: {
    padding: 24,
    backgroundColor: 'white',
  },
  sectionAlt: {
    backgroundColor: '#f9fafb',
  },
  sectionTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: 12,
    textAlign: 'center',
  },
  sectionSubtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  sectionImage: {
    width: '100%',
    height: 250,
    borderRadius: 12,
    marginTop: 20,
  },
  featureList: {
    marginTop: 20,
  },
  featureItem: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#dbeafe',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  featureIconText: {
    fontSize: 24,
  },
  featureContent: {
    flex: 1,
  },
  featureText: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
  },
  featureBold: {
    fontWeight: 'bold',
  },
  stepsContainer: {
    marginTop: 20,
  },
  stepCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    alignItems: 'center',
  },
  stepIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#dbeafe',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  stepIconText: {
    fontSize: 32,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: 8,
  },
  stepText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  serviceSection: {
    padding: 24,
  },
  serviceImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
  },
  serviceContent: {
    marginTop: 8,
  },
  serviceTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: 8,
  },
  serviceContext: {
    fontSize: 15,
    color: '#6b7280',
    marginBottom: 12,
    lineHeight: 22,
  },
  serviceBullet: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 6,
    lineHeight: 20,
  },
  serviceButton: {
    backgroundColor: '#fbbf24',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginTop: 12,
  },
  serviceButtonText: {
    color: '#111827',
    fontWeight: 'bold',
    fontSize: 14,
  },
  testimonialCard: {
    backgroundColor: '#f9fafb',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  testimonialText: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#374151',
    marginBottom: 12,
    lineHeight: 24,
  },
  testimonialAuthor: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#d97706',
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
  ctaSubtitle: {
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

export default WelcomePage;
