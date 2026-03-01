import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Platform } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchreg } from '../../redux/auth/registerSlice';
import Toast from 'react-native-toast-message';
import { Picker } from '@react-native-picker/picker';

const Registration = ({ navigation }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    password_confirmation: '',
    name: '',
    role: 'client',
    phone_number: '',
    practice_address: '',
  });

  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.sign_up);

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    const data = new FormData();
    for (const key in formData) {
      if (formData[key]) {
        data.append(`user[${key}]`, formData[key]);
      }
    }

    dispatch(fetchreg(data))
      .unwrap()
      .then((user) => {
        Toast.show({
          type: 'success',
          text1: 'Registration successful!',
        });

        if (user.role === 'lawyer') {
          navigation.navigate('PayRegistration');
        } else {
          navigation.navigate('Login');
        }
      })
      .catch(() => {
        Toast.show({
          type: 'error',
          text1: 'Registration failed. Please review your details.',
        });
      });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Create Your Account</Text>

        <TextInput
          style={styles.input}
          placeholder="Full Name"
          value={formData.name}
          onChangeText={(value) => handleChange('name', value)}
        />

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
          placeholder="Phone Number"
          value={formData.phone_number}
          onChangeText={(value) => handleChange('phone_number', value)}
          keyboardType="phone-pad"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          value={formData.password}
          onChangeText={(value) => handleChange('password', value)}
          secureTextEntry
        />

        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          value={formData.password_confirmation}
          onChangeText={(value) => handleChange('password_confirmation', value)}
          secureTextEntry
        />

        <View style={styles.pickerContainer}>
          <Text style={styles.label}>Register as:</Text>
          <Picker
            selectedValue={formData.role}
            onValueChange={(value) => handleChange('role', value)}
            style={styles.picker}
          >
            <Picker.Item label="Client" value="client" />
            <Picker.Item label="Lawyer" value="lawyer" />
          </Picker>
        </View>

        {formData.role === 'lawyer' && (
          <TextInput
            style={styles.input}
            placeholder="Practice Address"
            value={formData.practice_address}
            onChangeText={(value) => handleChange('practice_address', value)}
          />
        )}

        <TouchableOpacity 
          style={[styles.button, isLoading && styles.buttonDisabled]} 
          onPress={handleSubmit}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? 'Registering...' : 'Register'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.link}>Already have an account? Login</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
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
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    padding: 12,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 4,
    marginBottom: 16,
  },
  pickerContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    color: '#374151',
  },
  picker: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 4,
  },
  button: {
    backgroundColor: '#2563eb',
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonDisabled: {
    backgroundColor: '#9ca3af',
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

export default Registration;
