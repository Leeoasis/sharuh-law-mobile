import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import axiosInstance from '../../api/axiosInstance';
import Toast from 'react-native-toast-message';
import * as DocumentPicker from 'expo-document-picker';
import AppTopBar from '../common/AppTopBar';
import { toSafeUploadAsset, validateUploadAsset } from '../../utils/uploadSecurity';

const REGISTRATION_FEE = 250;
const REFERRAL_PLANS = [
  { key: '1-10', label: '1-10 referrals', amount: 500 },
  { key: '11-20', label: '11-20 referrals', amount: 1000 },
];

const PayRegistration = () => {
  const [selectedPlan, setSelectedPlan] = useState(REFERRAL_PLANS[0].key);
  const [pop, setPop] = useState(null);
  const [loading, setLoading] = useState(false);

  const pickPop = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'],
      });
      if (result.assets?.[0]) {
        const error = validateUploadAsset(result.assets[0]);
        if (error) {
          Toast.show({ type: 'error', text1: error });
          return;
        }
        setPop(toSafeUploadAsset(result.assets[0]));
        Toast.show({ type: 'success', text1: 'POP selected' });
      }
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Document picker cancelled' });
    }
  };

  const toUploadFile = async (value) => {
    if (!value?.uri) return null;

    if (Platform.OS === 'web') {
      const response = await fetch(value.uri);
      const blob = await response.blob();
      return new File([blob], value.name || 'registration-pop.pdf', {
        type: value.mimeType || value.type || 'application/pdf',
      });
    }

    return {
      uri: value.uri,
      type: value.mimeType || value.type || 'application/pdf',
      name: value.name || 'registration-pop.pdf',
    };
  };

  const submitPaymentSetup = async () => {
    if (!pop) {
      Toast.show({ type: 'error', text1: 'Upload the registration fee POP first' });
      return;
    }

    try {
      setLoading(true);
      const uploadFile = await toUploadFile(pop);
      const data = new FormData();
      data.append('payment[registration_fee_pop]', uploadFile);
      data.append('payment[fnb_referral_plan]', selectedPlan);
      data.append('payment[registration_fee_amount]', String(REGISTRATION_FEE));
      await axiosInstance.post('/pay_registration_fee/eft_pop', data);
      Toast.show({ type: 'success', text1: 'POP submitted for review' });
    } catch (error) {
      Toast.show({ type: 'error', text1: error.response?.data?.error || 'Failed to submit POP' });
    } finally {
      setLoading(false);
    }
  };

  /*
  const handlePeachPayment = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.post('/pay_registration_fee/peach/checkout', {
        payment: {
          extra_deposit_cents: Number(extraDeposit || 0) * 100,
          return_target: Platform.OS === 'web' ? 'web' : 'mobile',
        },
      });
      await Linking.openURL(response.data.redirect_url);
    } catch (error) {
      Toast.show({ type: 'error', text1: error.response?.data?.error || 'Failed to start payment' });
    } finally {
      setLoading(false);
    }
  };
  */

  const activePlan = REFERRAL_PLANS.find((plan) => plan.key === selectedPlan);

  return (
    <View style={styles.screen}>
      <AppTopBar showBack />
      <View style={styles.container}>
        <Text style={styles.title}>Lawyer Payment Setup</Text>
        <Text style={styles.message}>
          Pay the registration fee by EFT, upload your POP, and choose the FNB collection package
          for month-end referral billing.
        </Text>

        <View style={styles.summary}>
          <View style={styles.row}><Text>Registration fee</Text><Text>R{REGISTRATION_FEE}</Text></View>
          <Text style={styles.hint}>FNB will collect your selected flat referral fee from your account at month end.</Text>
          {REFERRAL_PLANS.map((plan) => (
            <TouchableOpacity
              key={plan.key}
              style={[styles.planOption, selectedPlan === plan.key && styles.activePlan]}
              onPress={() => setSelectedPlan(plan.key)}
            >
              <Text style={styles.planTitle}>{plan.label}</Text>
              <Text style={styles.planAmount}>R{plan.amount}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={styles.uploadButton} onPress={pickPop}>
            <Text style={styles.uploadButtonText}>{pop ? pop.name : 'Upload registration fee POP'}</Text>
          </TouchableOpacity>
          <View style={[styles.row, styles.total]}>
            <Text style={styles.totalText}>Selected package</Text>
            <Text style={styles.totalText}>R{activePlan.amount}</Text>
          </View>
        </View>

        <TouchableOpacity style={[styles.button, loading && styles.disabled]} onPress={submitPaymentSetup} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? 'Submitting...' : 'Submit POP and Plan'}</Text>
        </TouchableOpacity>
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
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#111827',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    color: '#6b7280',
  },
  summary: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  hint: {
    color: '#6b7280',
    fontSize: 13,
    lineHeight: 19,
    marginVertical: 6,
  },
  planOption: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  activePlan: {
    borderColor: '#059669',
    backgroundColor: '#ecfdf5',
  },
  planTitle: {
    color: '#111827',
    fontWeight: '700',
  },
  planAmount: {
    color: '#047857',
    fontWeight: '900',
  },
  uploadButton: {
    borderWidth: 1,
    borderColor: '#059669',
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: 12,
    marginVertical: 12,
    alignItems: 'center',
  },
  uploadButtonText: {
    color: '#047857',
    fontWeight: '800',
  },
  total: {
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 14,
  },
  totalText: {
    fontWeight: '800',
    fontSize: 17,
  },
  button: {
    backgroundColor: '#059669',
    padding: 12,
    borderRadius: 4,
    paddingHorizontal: 32,
  },
  disabled: {
    opacity: 0.55,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default PayRegistration;
