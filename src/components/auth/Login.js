import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useDispatch } from 'react-redux';
import { fetchlogin } from '../../redux/auth/loginSlice';
import Toast from 'react-native-toast-message';
import AppTopBar from '../common/AppTopBar';

const Login = ({ navigation }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const dispatch = useDispatch();

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    dispatch(fetchlogin(formData)).then((res) => {
      if (res.type !== 'login/fetchlogin/fulfilled') {
        Toast.show({
          type: 'error',
          text1: 'Login failed',
          text2: String(res.payload || 'Invalid login credentials'),
        });
        return;
      }

      const user = res.payload;

      if (!user || !user.role) {
        Toast.show({
          type: 'error',
          text1: 'Login failed: user data missing',
        });
        return;
      }

      Toast.show({
        type: 'success',
        text1: 'Login successful',
      });

      // Role-based routing
      if (user.role === 'admin') {
        navigation.navigate('AdminDashboard');
        return;
      }

      if (user.role === 'client') {
        navigation.navigate('ClientDashboard');
        return;
      }

      if (user.role === 'lawyer') {
        const hasRegistrationPayment =
          user.registration_fee_paid ||
          user.registration_fee_pop_submitted ||
          user.registration_fee_pop ||
          user.registration_pop ||
          user.proof_of_payment;

        if (!hasRegistrationPayment) {
          navigation.navigate('PayRegistration');
          return;
        }

        if (!user.approved) {
          navigation.navigate('PendingApproval');
          return;
        }

        navigation.navigate('LawyerDashboard');
      }
    });
  };

  return (
    <View style={styles.screen}>
      <AppTopBar showBack />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.formContainer}>
          <Text style={styles.eyebrow}>Welcome back</Text>
          <Text style={styles.title}>Login</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={formData.email}
          onChangeText={(value) => handleChange('email', value)}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          value={formData.password}
          onChangeText={(value) => handleChange('password', value)}
          secureTextEntry
        />

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Registration')}>
          <Text style={styles.link}>Don't have an account? Register</Text>
        </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    padding: 16,
  },
  formContainer: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 8,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#111827',
  },
  eyebrow: {
    color: '#b8860b',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  input: {
    width: '100%',
    padding: 12,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 4,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#2563eb',
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  link: {
    color: '#2563eb',
    textAlign: 'center',
  },
});

export default Login;
