import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import AppTopBar from '../common/AppTopBar';

const PendingApproval = () => {
  const user = useSelector((state) => state.auth.user);
  const popStatus = user?.registration_fee_pop_status || (user?.registration_fee_paid ? 'verified' : 'pending_review');
  const mandateStatus = user?.fnb_mandate_complete || user?.fnb_debit_mandate_accepted ? 'submitted' : 'incomplete';

  return (
    <View style={styles.screen}>
      <AppTopBar showBack />
      <View style={styles.container}>
        <Text style={styles.title}>Pending Approval</Text>
        <Text style={styles.message}>
          Your lawyer registration is pending admin review.
        </Text>
        <View style={styles.statusPanel}>
          <Text style={styles.statusText}>Registration POP: {popStatus.replace(/_/g, ' ')}</Text>
          <Text style={styles.statusText}>FNB mandate: {mandateStatus}</Text>
        </View>
        <Text style={styles.message}>
          Admin will approve once your legal documents, registration POP, and FNB mandate have been reviewed.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
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
  statusPanel: {
    backgroundColor: 'white',
    borderColor: '#e5e7eb',
    borderWidth: 1,
    borderRadius: 8,
    padding: 14,
    marginBottom: 14,
    width: '100%',
    maxWidth: 360,
  },
  statusText: {
    color: '#374151',
    fontWeight: '700',
    marginBottom: 6,
    textTransform: 'capitalize',
  },
});

export default PendingApproval;
