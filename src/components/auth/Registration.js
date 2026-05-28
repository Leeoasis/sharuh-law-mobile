import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Platform, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchreg } from '../../redux/auth/registerSlice';
import Toast from 'react-native-toast-message';
import { Picker } from '@react-native-picker/picker';
import * as DocumentPicker from 'expo-document-picker';

const courts = [
  'CCMA/Bargaining Council (Arbitration)',
  'District Magistrate Court',
  'Regional Magistrate Court',
  'High Court/Labour Court',
  'Supreme Court of Appeal/Labour Appeal Court',
  'Constitutional Court',
];

const expertiseAreas = [
  'Criminal Law',
  'Family Law',
  'Corporate Law',
  'Intellectual Property',
  'Labor Law',
];

const Registration = ({ navigation }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    password_confirmation: '',
    name: '',
    role: 'client',
    phone_number: '',
    practice_address: '',
    license_number: '',
    experience_years: '',
    rate: '',
    preferred_court: '',
    areas_of_expertise: '',
    admission_enrollment_order: null,
    good_standing_letter: null,
    fidelity_fund_certificate: null,
    id_document: null,
    engagement_form: null,
    client_id_document: null,
    client_proof_of_address: null,
  });

  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.sign_up);

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const pickDocument = async (fieldName) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
      });
      if (result.assets && result.assets[0]) {
        setFormData({ ...formData, [fieldName]: result.assets[0] });
        Toast.show({ type: 'success', text1: 'Document selected' });
      }
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Document picker cancelled' });
    }
  };

  const handleSubmit = async () => {
    try {
      // Validate required fields
      if (!formData.name || !formData.email || !formData.password || !formData.password_confirmation) {
        Toast.show({
          type: 'error',
          text1: 'Please fill in all required fields',
        });
        return;
      }

      if (formData.password !== formData.password_confirmation) {
        Toast.show({
          type: 'error',
          text1: 'Passwords do not match',
        });
        return;
      }

      const data = new FormData();
      
      // Add non-file fields
      data.append('user[name]', formData.name);
      data.append('user[email]', formData.email);
      data.append('user[password]', formData.password);
      data.append('user[password_confirmation]', formData.password_confirmation);
      data.append('user[role]', formData.role);
      data.append('user[phone_number]', formData.phone_number || '');

      // Add lawyer-specific fields
      if (formData.role === 'lawyer') {
        data.append('user[license_number]', formData.license_number || '');
        data.append('user[practice_address]', formData.practice_address || '');
        data.append('user[experience_years]', formData.experience_years || '');
        data.append('user[rate]', formData.rate || '');
        data.append('user[preferred_court]', formData.preferred_court || '');
        data.append('user[areas_of_expertise]', formData.areas_of_expertise || '');

        // Add file fields for lawyer
        if (formData.admission_enrollment_order?.uri) {
          data.append('user[admission_enrollment_order]', {
            uri: formData.admission_enrollment_order.uri,
            type: formData.admission_enrollment_order.mimeType || 'application/octet-stream',
            name: formData.admission_enrollment_order.name,
          });
        }
        if (formData.good_standing_letter?.uri) {
          data.append('user[good_standing_letter]', {
            uri: formData.good_standing_letter.uri,
            type: formData.good_standing_letter.mimeType || 'application/octet-stream',
            name: formData.good_standing_letter.name,
          });
        }
        if (formData.fidelity_fund_certificate?.uri) {
          data.append('user[fidelity_fund_certificate]', {
            uri: formData.fidelity_fund_certificate.uri,
            type: formData.fidelity_fund_certificate.mimeType || 'application/octet-stream',
            name: formData.fidelity_fund_certificate.name,
          });
        }
        if (formData.id_document?.uri) {
          data.append('user[id_document]', {
            uri: formData.id_document.uri,
            type: formData.id_document.mimeType || 'application/octet-stream',
            name: formData.id_document.name,
          });
        }
      }

      // Add client-specific fields
      if (formData.role === 'client') {
        if (formData.engagement_form?.uri) {
          data.append('user[engagement_form]', {
            uri: formData.engagement_form.uri,
            type: formData.engagement_form.mimeType || 'application/octet-stream',
            name: formData.engagement_form.name,
          });
        }
        if (formData.client_id_document?.uri) {
          data.append('user[client_id_document]', {
            uri: formData.client_id_document.uri,
            type: formData.client_id_document.mimeType || 'application/octet-stream',
            name: formData.client_id_document.name,
          });
        }
        if (formData.client_proof_of_address?.uri) {
          data.append('user[client_proof_of_address]', {
            uri: formData.client_proof_of_address.uri,
            type: formData.client_proof_of_address.mimeType || 'application/octet-stream',
            name: formData.client_proof_of_address.name,
          });
        }
      }

      console.log('=== Registration Form Data ===');
      console.log('Role:', formData.role);
      console.log('Name:', formData.name);
      console.log('Email:', formData.email);
      console.log('Phone:', formData.phone_number);

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
        .catch((error) => {
          console.error('=== Registration Error ===');
          console.error('Error:', error);
          console.error('Error message:', error?.message);
          console.error('Error response:', error?.response?.data);
          
          const errorMessage = error?.response?.data?.message || 
                              error?.message || 
                              'Registration failed. Please review your details.';
          
          Toast.show({
            type: 'error',
            text1: 'Registration Error',
            text2: errorMessage,
            duration: 4000,
          });
        });
    } catch (error) {
      console.error('=== Unexpected Error ===', error);
      Toast.show({
        type: 'error',
        text1: 'Unexpected error during registration',
        text2: error.message,
      });
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Create Your Account</Text>

        {/* Common Fields */}
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

        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          value={formData.phone_number}
          onChangeText={(value) => handleChange('phone_number', value)}
          keyboardType="phone-pad"
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

        {/* Lawyer-specific fields */}
        {formData.role === 'lawyer' && (
          <>
            <Text style={styles.sectionTitle}>Lawyer Information</Text>
            <TextInput
              style={styles.input}
              placeholder="License Number"
              value={formData.license_number}
              onChangeText={(value) => handleChange('license_number', value)}
            />

            <TextInput
              style={styles.input}
              placeholder="Practice Address"
              value={formData.practice_address}
              onChangeText={(value) => handleChange('practice_address', value)}
            />

            <TextInput
              style={styles.input}
              placeholder="Years of Experience"
              value={formData.experience_years}
              onChangeText={(value) => handleChange('experience_years', value)}
              keyboardType="number-pad"
            />

            <TextInput
              style={styles.input}
              placeholder="Hourly Rate (ZAR)"
              value={formData.rate}
              onChangeText={(value) => handleChange('rate', value)}
              keyboardType="decimal-pad"
            />

            <View style={styles.pickerContainer}>
              <Text style={styles.label}>Preferred Court:</Text>
              <Picker
                selectedValue={formData.preferred_court}
                onValueChange={(value) => handleChange('preferred_court', value)}
                style={styles.picker}
              >
                <Picker.Item label="Select Preferred Court" value="" />
                {courts.map((court, index) => (
                  <Picker.Item key={index} label={court} value={court} />
                ))}
              </Picker>
            </View>

            <View style={styles.pickerContainer}>
              <Text style={styles.label}>Area of Expertise:</Text>
              <Picker
                selectedValue={formData.areas_of_expertise}
                onValueChange={(value) => handleChange('areas_of_expertise', value)}
                style={styles.picker}
              >
                <Picker.Item label="Select Area of Expertise" value="" />
                {expertiseAreas.map((area, index) => (
                  <Picker.Item key={index} label={area} value={area} />
                ))}
              </Picker>
            </View>

            <Text style={styles.sectionTitle}>Legal Documents</Text>
            <TouchableOpacity
              style={styles.documentButton}
              onPress={() => pickDocument('admission_enrollment_order')}
            >
              <Text style={styles.documentButtonText}>
                {formData.admission_enrollment_order ? '✓ Admission Order Selected' : 'Upload Admission & Enrollment Order'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.documentButton}
              onPress={() => pickDocument('good_standing_letter')}
            >
              <Text style={styles.documentButtonText}>
                {formData.good_standing_letter ? '✓ Standing Letter Selected' : 'Upload Good Standing Letter'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.documentButton}
              onPress={() => pickDocument('fidelity_fund_certificate')}
            >
              <Text style={styles.documentButtonText}>
                {formData.fidelity_fund_certificate ? '✓ Fidelity Certificate Selected' : 'Upload Fidelity Fund Certificate'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.documentButton}
              onPress={() => pickDocument('id_document')}
            >
              <Text style={styles.documentButtonText}>
                {formData.id_document ? '✓ ID Document Selected' : 'Upload Identity Document'}
              </Text>
            </TouchableOpacity>
          </>
        )}

        {/* Client-specific fields */}
        {formData.role === 'client' && (
          <>
            <Text style={styles.sectionTitle}>Client Documents</Text>
            <TouchableOpacity
              style={styles.documentButton}
              onPress={() => pickDocument('engagement_form')}
            >
              <Text style={styles.documentButtonText}>
                {formData.engagement_form ? '✓ Engagement Form Selected' : 'Upload Engagement Form'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.documentButton}
              onPress={() => pickDocument('client_id_document')}
            >
              <Text style={styles.documentButtonText}>
                {formData.client_id_document ? '✓ ID Document Selected' : 'Upload Identity Document'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.documentButton}
              onPress={() => pickDocument('client_proof_of_address')}
            >
              <Text style={styles.documentButtonText}>
                {formData.client_proof_of_address ? '✓ Proof of Address Selected' : 'Upload Proof of Address'}
              </Text>
            </TouchableOpacity>
          </>
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
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  formContainer: {
    backgroundColor: '#fff',
    paddingVertical: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#1a1a1a',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 12,
    color: '#1a1a1a',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 15,
    borderRadius: 8,
    fontSize: 14,
    backgroundColor: '#f9f9f9',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
    overflow: 'hidden',
  },
  label: {
    paddingHorizontal: 12,
    paddingTop: 12,
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  picker: {
    height: 50,
  },
  documentButton: {
    borderWidth: 1,
    borderColor: '#b8860b',
    borderStyle: 'dashed',
    paddingVertical: 15,
    marginBottom: 12,
    borderRadius: 8,
    backgroundColor: '#fffef5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  documentButtonText: {
    color: '#b8860b',
    fontWeight: '500',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#b8860b',
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 20,
    marginBottom: 15,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  link: {
    color: '#b8860b',
    textAlign: 'center',
    marginTop: 10,
    fontSize: 14,
  },
});

export default Registration;
