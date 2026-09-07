import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Platform, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchreg } from '../../redux/auth/registerSlice';
import Toast from 'react-native-toast-message';
import { Picker } from '@react-native-picker/picker';
import * as DocumentPicker from 'expo-document-picker';
import AppTopBar from '../common/AppTopBar';
import { toSafeUploadAsset, validateUploadAsset } from '../../utils/uploadSecurity';

const courtGroups = [
  {
    category: 'Superior Courts',
    options: [
      'Constitutional Court',
      'Supreme Court of Appeal',
      'High Court: Eastern Cape Division - Bhisho',
      'High Court: Eastern Cape Division - Makhanda',
      'High Court: Eastern Cape Local Division - Gqeberha',
      'High Court: Eastern Cape Local Division - Mthatha',
      'High Court: Free State Division - Bloemfontein',
      'High Court: Gauteng Division - Pretoria',
      'High Court: Gauteng Local Division - Johannesburg',
      'High Court: KwaZulu-Natal Division - Pietermaritzburg',
      'High Court: KwaZulu-Natal Local Division - Durban',
      'High Court: Limpopo Division - Polokwane',
      'High Court: Limpopo Local Division - Thohoyandou',
      'High Court: Mpumalanga Division - Mbombela',
      'High Court: Mpumalanga Local Division - Middelburg',
      'High Court: Northern Cape Division - Kimberley',
      'High Court: North West Division - Mahikeng',
      'High Court: Western Cape Division - Cape Town',
    ],
  },
  {
    category: 'Specialist Courts',
    options: [
      'Labour Court',
      'Labour Appeal Court',
      'Land Court / Land Claims Court',
      'Electoral Court',
      'Competition Appeal Court',
      'Tax Court',
      'Equality Court',
      'Small Claims Court',
      'Children\'s Court',
      'Maintenance Court',
      'Sexual Offences Court',
      'Commercial Crimes Court',
    ],
  },
  {
    category: 'Magistrates Courts',
    options: [
      'District Magistrate Court - Eastern Cape',
      'District Magistrate Court - Free State',
      'District Magistrate Court - Gauteng',
      'District Magistrate Court - KwaZulu-Natal',
      'District Magistrate Court - Limpopo',
      'District Magistrate Court - Mpumalanga',
      'District Magistrate Court - Northern Cape',
      'District Magistrate Court - North West',
      'District Magistrate Court - Western Cape',
      'Regional Magistrate Court - Eastern Cape',
      'Regional Magistrate Court - Free State',
      'Regional Magistrate Court - Gauteng',
      'Regional Magistrate Court - KwaZulu-Natal',
      'Regional Magistrate Court - Limpopo',
      'Regional Magistrate Court - Mpumalanga',
      'Regional Magistrate Court - Northern Cape',
      'Regional Magistrate Court - North West',
      'Regional Magistrate Court - Western Cape',
    ],
  },
  {
    category: 'Forums and Tribunals',
    options: [
      'CCMA',
      'Bargaining Council',
      'Companies Tribunal',
      'Consumer Tribunal',
      'Rental Housing Tribunal',
      'Appeal Board / Administrative Tribunal',
    ],
  },
];

const expertiseGroups = [
  { category: 'Litigation and Dispute Resolution', options: ['Civil Litigation', 'Criminal Law', 'Commercial Litigation', 'Constitutional Law', 'Administrative Law', 'Appeals and Reviews', 'Alternative Dispute Resolution', 'Arbitration', 'Mediation', 'Debt Collection'] },
  { category: 'People and Family', options: ['Family Law', 'Divorce Law', 'Child Law', 'Maintenance Law', 'Domestic Violence', 'Deceased Estates', 'Wills and Trusts', 'Immigration Law', 'Personal Injury Law', 'Medical Negligence'] },
  { category: 'Business and Commercial', options: ['Corporate Law', 'Commercial Law', 'Contract Law', 'Company Secretarial', 'Mergers and Acquisitions', 'Insolvency and Business Rescue', 'Banking and Finance Law', 'Insurance Law', 'Tax Law', 'Competition Law', 'Consumer Protection'] },
  { category: 'Property and Work', options: ['Property Law', 'Conveyancing', 'Real Estate Law', 'Land Reform', 'Sectional Title Law', 'Construction Law', 'Labour Law', 'Employment Law', 'Pension Law'] },
  { category: 'Regulated and Specialist', options: ['Intellectual Property', 'Information Technology Law', 'Data Protection and POPIA', 'Media and Entertainment Law', 'Environmental Law', 'Mining Law', 'Energy Law', 'Transport Law', 'Maritime Law', 'Aviation Law', 'Public Procurement', 'Municipal Law', 'Education Law', 'Healthcare Law', 'Sports Law'] },
];

const filterGroups = (groups, search) => {
  const query = search.trim().toLowerCase();
  if (!query) return groups;

  return groups
    .map((group) => ({
      ...group,
      options: group.options.filter((option) => `${group.category} ${option}`.toLowerCase().includes(query)),
    }))
    .filter((group) => group.options.length > 0);
};

const practitionerTiers = [
  { label: 'Basic Platform - R1,500/month - up to 10 enquiries', value: 'basic' },
  { label: 'Classic Platform - R2,500/month - up to 20 enquiries', value: 'classic' },
  { label: 'Golden Platform - R3,500/month - up to 50 enquiries', value: 'golden' },
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
    preferred_court: [],
    areas_of_expertise: [],
    admission_enrollment_order: null,
    good_standing_letter: null,
    fidelity_fund_certificate: null,
    id_document: null,
    registration_fee_pop: null,
    fnb_referral_plan: 'basic',
    fnb_mandate_account_holder: '',
    fnb_mandate_account_number: '',
    fnb_mandate_account_type: 'cheque',
    fnb_mandate_branch_code: '250655',
    fnb_mandate_bank_name: 'FNB',
    fnb_debit_mandate_accepted: false,
    engagement_form: null,
    client_id_document: null,
    client_proof_of_address: null,
    agreement_acceptances: {
      practitioner_sla: false,
      fee_schedule: false,
      privacy_notice: false,
      payment_mandate: false,
    },
  });

  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.sign_up);
  const [courtSearch, setCourtSearch] = useState('');
  const [expertiseSearch, setExpertiseSearch] = useState('');
  const [openSelector, setOpenSelector] = useState(null);
  const filteredCourtGroups = filterGroups(courtGroups, courtSearch);
  const filteredExpertiseGroups = filterGroups(expertiseGroups, expertiseSearch);

  const handleChange = (name, value) => {
    const nextValue = ['fnb_mandate_account_number', 'fnb_mandate_branch_code'].includes(name)
      ? String(value).replace(/\D/g, '')
      : value;
    setFormData({ ...formData, [name]: nextValue });
  };

  const pickDocument = async (fieldName) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'],
      });
      if (result.assets && result.assets[0]) {
        const error = validateUploadAsset(result.assets[0]);
        if (error) {
          Toast.show({ type: 'error', text1: error });
          return;
        }
        setFormData({ ...formData, [fieldName]: toSafeUploadAsset(result.assets[0]) });
        Toast.show({ type: 'success', text1: 'Document selected' });
      }
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Document picker cancelled' });
    }
  };

  const toggleSelection = (field, value) => {
    setFormData((current) => {
      const selected = current[field];
      const next = selected.includes(value)
        ? selected.filter((item) => item !== value)
        : [...selected, value];

      return { ...current, [field]: next };
    });
  };

  const toUploadFile = async (value) => {
    if (!value || !value.uri) return null;

    if (Platform.OS === 'web') {
      try {
        const response = await fetch(value.uri);
        const blob = await response.blob();
        return new File([blob], value.name || 'document.pdf', {
          type: value.mimeType || value.type || 'application/pdf',
        });
      } catch (error) {
        console.warn('Unable to convert file to web File object:', error);
      }
    }

    return {
      uri: value.uri,
      type: value.mimeType || value.type || 'application/pdf',
      name: value.name || 'document.pdf',
    };
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

      if (formData.role === 'lawyer' && !formData.registration_fee_pop) {
        Toast.show({
          type: 'error',
          text1: 'Upload POP for the EFT registration fee',
        });
        return;
      }

      if (formData.role === 'lawyer') {
        if (formData.preferred_court.length === 0) {
          Toast.show({
            type: 'error',
            text1: 'Select at least one court',
          });
          return;
        }

        if (formData.areas_of_expertise.length === 0) {
          Toast.show({
            type: 'error',
            text1: 'Select at least one expertise area',
          });
          return;
        }

        const missingMandate =
          !formData.fnb_mandate_account_holder ||
          !formData.fnb_mandate_account_number ||
          !formData.fnb_mandate_account_type ||
          !formData.fnb_mandate_branch_code;

        if (missingMandate) {
          Toast.show({
            type: 'error',
            text1: 'Complete the FNB mandate details',
          });
          return;
        }

        if (!formData.fnb_debit_mandate_accepted) {
          Toast.show({
            type: 'error',
            text1: 'Accept the FNB debit mandate',
          });
          return;
        }

        if (Object.values(formData.agreement_acceptances).some((accepted) => !accepted)) {
          Toast.show({
            type: 'error',
            text1: 'Accept all current LEGAL SUISE agreement terms',
          });
          return;
        }
      }

      const data = new FormData();

      for (const [key, value] of Object.entries(formData)) {
        if (value === null || value === undefined) continue;

        if (value && typeof value === 'object' && 'uri' in value) {
          const uploadFile = await toUploadFile(value);
          if (uploadFile) {
            data.append(`user[${key}]`, uploadFile);
          }
          continue;
        }

        if (key === 'agreement_acceptances') {
          Object.entries(value).forEach(([agreement, accepted]) => {
            data.append(`user[agreement_acceptances][${agreement}]`, String(accepted));
          });
          continue;
        }

        data.append(`user[${key}]`, Array.isArray(value) ? value.join(', ') : value);
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
            navigation.navigate('PendingApproval');
          } else {
            navigation.navigate('Login');
          }
        })
        .catch((error) => {
          console.error('=== Registration Error ===');
          console.error('Error:', error);
          console.error('Error message:', error?.message);
          console.error('Error response:', error?.response?.data);
          
          const errorMessage =
            error?.response?.data?.message ||
            error?.message ||
            error?.error ||
            (Array.isArray(error?.errors) ? error.errors.join(', ') : null) ||
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
    <View style={styles.screen}>
      <AppTopBar showBack />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.formContainer}>
          <Text style={styles.eyebrow}>New account</Text>
          <Text style={styles.title}>Create Your Account</Text>

        {/* Common Fields */}
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
          placeholder="Full Name"
          value={formData.name}
          onChangeText={(value) => handleChange('name', value)}
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
            <View style={styles.infoPanel}>
              <Text style={styles.infoTitle}>FNB collection billing</Text>
              <Text style={styles.infoText}>
                Select the referral package you want FNB to collect as a flat fee from your account at month end.
              </Text>
            </View>
            <View style={styles.pickerContainer}>
              <Text style={styles.label}>Referral package:</Text>
              <Picker
                selectedValue={formData.fnb_referral_plan}
                onValueChange={(value) => handleChange('fnb_referral_plan', value)}
                style={styles.picker}
              >
                {practitionerTiers.map((plan) => (
                  <Picker.Item key={plan.value} label={plan.label} value={plan.value} />
                ))}
              </Picker>
            </View>
            <Text style={styles.sectionTitle}>FNB Debit Mandate</Text>
            <Text style={styles.infoText}>
              Complete this mandate as part of registration. Admin will review it once with your POP and legal documents.
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Account Holder Name"
              value={formData.fnb_mandate_account_holder}
              onChangeText={(value) => handleChange('fnb_mandate_account_holder', value)}
            />
            <TextInput
              style={styles.input}
              placeholder="FNB Account Number"
              value={formData.fnb_mandate_account_number}
              onChangeText={(value) => handleChange('fnb_mandate_account_number', value)}
              keyboardType="number-pad"
              maxLength={12}
            />
            <View style={styles.pickerContainer}>
              <Text style={styles.label}>Account Type:</Text>
              <Picker
                selectedValue={formData.fnb_mandate_account_type}
                onValueChange={(value) => handleChange('fnb_mandate_account_type', value)}
                style={styles.picker}
              >
                <Picker.Item label="Cheque / Current" value="cheque" />
                <Picker.Item label="Savings" value="savings" />
                <Picker.Item label="Business" value="business" />
              </Picker>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Branch Code"
              value={formData.fnb_mandate_branch_code}
              onChangeText={(value) => handleChange('fnb_mandate_branch_code', value)}
              keyboardType="number-pad"
              maxLength={6}
            />
            <TouchableOpacity
              style={styles.checkboxRow}
              onPress={() => handleChange('fnb_debit_mandate_accepted', !formData.fnb_debit_mandate_accepted)}
            >
              <View style={[styles.checkbox, formData.fnb_debit_mandate_accepted && styles.checkboxChecked]}>
                {formData.fnb_debit_mandate_accepted ? <Text style={styles.checkboxTick}>OK</Text> : null}
              </View>
              <Text style={styles.checkboxText}>
                I authorise LEGAL SUISE to collect lawful fees under the selected platform tier and payment mandate.
              </Text>
            </TouchableOpacity>

            <View style={styles.infoPanel}>
              <Text style={styles.infoTitle}>Practitioner agreement acceptance</Text>
              {Object.keys(formData.agreement_acceptances).map((agreement) => (
                <TouchableOpacity
                  key={agreement}
                  style={styles.checkboxRow}
                  onPress={() => setFormData({
                    ...formData,
                    agreement_acceptances: {
                      ...formData.agreement_acceptances,
                      [agreement]: !formData.agreement_acceptances[agreement],
                    },
                  })}
                >
                  <View style={[styles.checkbox, formData.agreement_acceptances[agreement] && styles.checkboxChecked]}>
                    {formData.agreement_acceptances[agreement] ? <Text style={styles.checkboxTick}>OK</Text> : null}
                  </View>
                  <Text style={styles.checkboxText}>I accept the current LEGAL SUISE {agreement.replaceAll('_', ' ')}.</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TextInput
              style={styles.input}
              placeholder="License Number"
              value={formData.license_number}
              onChangeText={(value) => handleChange('license_number', value)}
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

            <Text style={styles.sectionTitle}>Courts You Appear In</Text>
            <TouchableOpacity
              style={styles.dropdownButton}
              onPress={() => setOpenSelector(openSelector === 'courts' ? null : 'courts')}
            >
              <Text style={formData.preferred_court.length ? styles.dropdownValue : styles.dropdownPlaceholder}>
                {formData.preferred_court.length ? `${formData.preferred_court.length} selected` : 'Select courts'}
              </Text>
              <View style={[styles.dropdownActionBox, openSelector === 'courts' && styles.dropdownActionOpen]}>
                <Text style={styles.dropdownAction}>⌄</Text>
              </View>
            </TouchableOpacity>
            {formData.preferred_court.length > 0 && (
              <Text style={styles.selectedSummary}>{formData.preferred_court.slice(0, 3).join(', ')}{formData.preferred_court.length > 3 ? ` +${formData.preferred_court.length - 3} more` : ''}</Text>
            )}
            {openSelector === 'courts' && (
              <View style={styles.selectionPanel}>
                <TextInput
                  style={styles.input}
                  placeholder="Filter courts by name or category"
                  value={courtSearch}
                  onChangeText={setCourtSearch}
                />
                {filteredCourtGroups.map((group) => (
                  <View key={group.category} style={styles.selectionGroup}>
                    <Text style={styles.groupTitle}>{group.category}</Text>
                    {group.options.map((court) => {
                      const selected = formData.preferred_court.includes(court);
                      return (
                        <TouchableOpacity
                          key={court}
                          style={[styles.optionRow, selected && styles.optionRowSelected]}
                          onPress={() => toggleSelection('preferred_court', court)}
                        >
                          <Text style={[styles.optionText, selected && styles.optionTextSelected]}>{court}</Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                ))}
              </View>
            )}

            <Text style={styles.sectionTitle}>Areas of Expertise</Text>
            <TouchableOpacity
              style={styles.dropdownButton}
              onPress={() => setOpenSelector(openSelector === 'expertise' ? null : 'expertise')}
            >
              <Text style={formData.areas_of_expertise.length ? styles.dropdownValue : styles.dropdownPlaceholder}>
                {formData.areas_of_expertise.length ? `${formData.areas_of_expertise.length} selected` : 'Select expertise areas'}
              </Text>
              <View style={[styles.dropdownActionBox, openSelector === 'expertise' && styles.dropdownActionOpen]}>
                <Text style={styles.dropdownAction}>⌄</Text>
              </View>
            </TouchableOpacity>
            {formData.areas_of_expertise.length > 0 && (
              <Text style={styles.selectedSummary}>{formData.areas_of_expertise.slice(0, 3).join(', ')}{formData.areas_of_expertise.length > 3 ? ` +${formData.areas_of_expertise.length - 3} more` : ''}</Text>
            )}
            {openSelector === 'expertise' && (
              <View style={styles.selectionPanel}>
                <TextInput
                  style={styles.input}
                  placeholder="Filter expertise areas"
                  value={expertiseSearch}
                  onChangeText={setExpertiseSearch}
                />
                {filteredExpertiseGroups.map((group) => (
                  <View key={group.category} style={styles.selectionGroup}>
                    <Text style={styles.groupTitle}>{group.category}</Text>
                    {group.options.map((area) => {
                      const selected = formData.areas_of_expertise.includes(area);
                      return (
                        <TouchableOpacity
                          key={area}
                          style={[styles.optionRow, selected && styles.optionRowSelected]}
                          onPress={() => toggleSelection('areas_of_expertise', area)}
                        >
                          <Text style={[styles.optionText, selected && styles.optionTextSelected]}>{area}</Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                ))}
              </View>
            )}

            <Text style={styles.sectionTitle}>Legal Documents</Text>
            <TouchableOpacity
              style={styles.documentButton}
              onPress={() => pickDocument('registration_fee_pop')}
            >
              <Text style={styles.documentButtonText}>
                {formData.registration_fee_pop ? 'POP for registration fee selected' : 'Upload POP for EFT registration fee'}
              </Text>
            </TouchableOpacity>
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
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flexGrow: 1,
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
    marginBottom: 24,
    color: '#1a1a1a',
  },
  eyebrow: {
    color: '#b8860b',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 6,
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
  infoPanel: {
    backgroundColor: '#f0fdf4',
    borderColor: '#bbf7d0',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
  },
  infoTitle: {
    color: '#166534',
    fontWeight: '800',
    marginBottom: 4,
  },
  infoText: {
    color: '#166534',
    fontSize: 13,
    lineHeight: 19,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 15,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#b8860b',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: '#b8860b',
  },
  checkboxTick: {
    color: '#fff',
    fontWeight: '800',
  },
  checkboxText: {
    flex: 1,
    color: '#374151',
    fontSize: 13,
    lineHeight: 19,
  },
  dropdownButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 13,
    marginBottom: 8,
    backgroundColor: '#f9f9f9',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dropdownValue: {
    color: '#111827',
    fontWeight: '700',
    flex: 1,
  },
  dropdownPlaceholder: {
    color: '#6b7280',
    flex: 1,
  },
  dropdownActionBox: {
    width: 32,
    height: 32,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  dropdownActionOpen: {
    transform: [{ rotate: '180deg' }],
  },
  dropdownAction: {
    color: '#7c5a02',
    fontWeight: '900',
    fontSize: 24,
    lineHeight: 24,
  },
  selectedSummary: {
    color: '#4b5563',
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 10,
  },
  selectionPanel: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  selectionGroup: {
    marginBottom: 12,
  },
  groupTitle: {
    color: '#374151',
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 8,
  },
  optionRow: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingVertical: 9,
    paddingHorizontal: 10,
    marginBottom: 7,
    backgroundColor: '#f9fafb',
  },
  optionRowSelected: {
    borderColor: '#b8860b',
    backgroundColor: '#fff7d6',
  },
  optionText: {
    color: '#374151',
    fontSize: 13,
  },
  optionTextSelected: {
    color: '#7c5a02',
    fontWeight: '800',
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
