import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const Navbar = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const getLinkStyle = (routeName) => {
    return route.name === routeName ? styles.linkActive : styles.link;
  };

  const getLinkTextStyle = (routeName) => {
    return route.name === routeName ? styles.linkTextActive : styles.linkText;
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require('../../../assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <View style={styles.linksContainer}>
        <TouchableOpacity
          style={getLinkStyle('Welcome')}
          onPress={() => navigation.navigate('Welcome')}
        >
          <Text style={getLinkTextStyle('Welcome')}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={getLinkStyle('About')}
          onPress={() => navigation.navigate('About')}
        >
          <Text style={getLinkTextStyle('About')}>About</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={getLinkStyle('Contact')}
          onPress={() => navigation.navigate('Contact')}
        >
          <Text style={getLinkTextStyle('Contact')}>Contact</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#111827',
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  logoContainer: {
    flex: 1,
  },
  logo: {
    width: 80,
    height: 40,
  },
  linksContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  link: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  linkActive: {
    backgroundColor: '#fbbf24',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  linkText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  linkTextActive: {
    color: '#111827',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default Navbar;
