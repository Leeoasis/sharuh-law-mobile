import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const AppTopBar = ({ title = 'Legal Suise', subtitle = 'Connect', showBack = false }) => {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const isLogin = route.name === 'Login';
  const isRegistration = route.name === 'Registration';

  const goHome = () => navigation.navigate('Welcome');
  const goLogin = () => navigation.navigate('Login');
  const goRegister = () => navigation.navigate('Registration');

  return (
    <View style={[styles.container, { paddingTop: insets.top + 10 }]}>
      <View style={styles.left}>
        {showBack ? (
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => (navigation.canGoBack() ? navigation.goBack() : goHome())}
            accessibilityLabel="Go back"
          >
            <Ionicons name="chevron-back" size={20} color="#f9fafb" />
          </TouchableOpacity>
        ) : null}

        <TouchableOpacity style={styles.brand} onPress={goHome} activeOpacity={0.85}>
          <Image source={require('../../../assets/logo.png')} style={styles.logo} resizeMode="contain" />
          <View>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>{subtitle}</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.actions}>
        {!isLogin ? (
          <TouchableOpacity style={styles.iconButton} onPress={goLogin} accessibilityLabel="Login">
            <Ionicons name="log-in-outline" size={18} color="#f9fafb" />
          </TouchableOpacity>
        ) : null}

        {!isRegistration ? (
          <TouchableOpacity style={styles.cta} onPress={goRegister}>
            <Text style={styles.ctaText}>Join</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#111827',
    borderBottomWidth: 1,
    borderBottomColor: '#2f3a4b',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
    gap: 8,
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flexShrink: 1,
  },
  logo: {
    width: 44,
    height: 28,
  },
  title: {
    color: '#f9fafb',
    fontSize: 17,
    fontWeight: '800',
  },
  subtitle: {
    color: '#fbbf24',
    fontSize: 11,
    fontWeight: '700',
    marginTop: -2,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#374151',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cta: {
    backgroundColor: '#fbbf24',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  ctaText: {
    color: '#111827',
    fontSize: 13,
    fontWeight: '800',
  },
});

export default AppTopBar;
