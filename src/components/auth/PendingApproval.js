import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const PendingApproval = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pending Approval</Text>
      <Text style={styles.message}>
        Your lawyer registration is pending approval from an administrator.
      </Text>
      <Text style={styles.message}>
        You will be notified once your account is approved.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 8,
    color: '#6b7280',
  },
});

export default PendingApproval;
