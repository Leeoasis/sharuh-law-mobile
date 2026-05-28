import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Navbar = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();

  const tabs = [
    { label: 'Home', routeName: 'Welcome', icon: 'home-outline', activeIcon: 'home' },
    { label: 'About', routeName: 'About', icon: 'information-circle-outline', activeIcon: 'information-circle' },
    { label: 'Contact', routeName: 'Contact', icon: 'call-outline', activeIcon: 'call' },
  ];

  return (
    <View style={[styles.container, { bottom: Math.max(insets.bottom, 10) }]}>
      {tabs.map((tab) => {
        const isActive = route.name === tab.routeName;
        return (
          <TouchableOpacity
            key={tab.routeName}
            style={[styles.tab, isActive ? styles.tabActive : null]}
            onPress={() => navigation.navigate(tab.routeName)}
            activeOpacity={0.8}
            hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
          >
            <Ionicons
              name={isActive ? tab.activeIcon : tab.icon}
              size={20}
              color={isActive ? '#fbbf24' : '#9ca3af'}
            />
            <Text style={isActive ? styles.tabTextActive : styles.tabText}>{tab.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(17, 24, 39, 0.98)',
    borderTopWidth: 1,
    borderTopColor: '#374151',
    paddingVertical: 6,
    paddingHorizontal: 0,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 8,
    zIndex: 100,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  tabActive: {
    borderTopWidth: 3,
    borderTopColor: '#fbbf24',
  },
  tabText: {
    color: '#9ca3af',
    fontSize: 10,
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#fbbf24',
    fontSize: 10,
    fontWeight: '700',
  },
});

export default Navbar;
