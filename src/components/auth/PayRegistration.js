import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import { payRegistrationFee } from '../../redux/auth/authSlice';
import Toast from 'react-native-toast-message';

const PayRegistration = ({ navigation }) => {
  const dispatch = useDispatch();

  const handlePayment = () => {
    dispatch(payRegistrationFee())
      .unwrap()
      .then(() => {
        Toast.show({
          type: 'success',
          text1: 'Payment successful!',
        });
        navigation.navigate('PendingApproval');
      })
      .catch((error) => {
        Toast.show({
          type: 'error',
          text1: error || 'Payment failed',
        });
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Complete Registration</Text>
      <Text style={styles.message}>
        To complete your registration, please pay the registration fee.
      </Text>

      <TouchableOpacity style={styles.button} onPress={handlePayment}>
        <Text style={styles.buttonText}>Pay Now</Text>
      </TouchableOpacity>
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
    marginBottom: 24,
    color: '#6b7280',
  },
  button: {
    backgroundColor: '#2563eb',
    padding: 12,
    borderRadius: 4,
    paddingHorizontal: 32,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default PayRegistration;
