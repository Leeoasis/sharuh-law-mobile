import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Linking,
  Modal,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Calendar } from 'react-native-calendars';
import { useDispatch, useSelector } from 'react-redux';
import Toast from 'react-native-toast-message';
import axiosInstance from '../../api/axiosInstance';
import { logout } from '../../redux/actions/logout';
import {
  approveLawyer,
  fetchClients,
  fetchLawyers,
  fetchNotifications,
  fetchProfile,
  receiveNotification,
  updateProfile,
} from '../../redux/features/userSlice';
import {
  acceptCase,
  createCase,
  deleteCase,
  fetchAdminCases,
  fetchAvailableCases,
  fetchCases,
  unassignCase,
  updateCase,
} from '../../redux/features/caseSlice';
import { updateFnbCollectionPlan } from '../../redux/features/depositSlice';
import { subscribeToNotifications } from '../../services/notifications';

const COURTS = [
  'CCMA/Bargaining Council (Arbitration)',
  'District Magistrate Court',
  'Regional Magistrate Court',
  'High Court/Labour Court',
  'Supreme Court of Appeal/Labour Appeal Court',
  'Constitutional Court',
];
const CASE_TYPES = ['Criminal Law', 'Family Law', 'Corporate Law', 'Intellectual Property', 'Labor'];
const EMPTY_CASE = {
  title: '',
  description: '',
  court: '',
  budget: '',
  case_type: '',
  public_user_terms_accepted: false,
};
const REFERRAL_PLANS = [
  { key: 'basic', label: 'Basic Platform - up to 10 enquiries', amount: 1500 },
  { key: 'classic', label: 'Classic Platform - up to 20 enquiries', amount: 2500 },
  { key: 'golden', label: 'Golden Platform - up to 50 enquiries', amount: 3500 },
];
const EVENT_TYPES = ['Consultation', 'Court date', 'Filing deadline', 'Follow-up', 'Payment follow-up'];

const tabsByRole = {
  client: ['Home', 'Cases', 'Calendar', 'Messages', 'Notifications', 'Profile'],
  lawyer: ['Home', 'My Cases', 'Available', 'Clients', 'Billing', 'Calendar', 'Messages', 'Notifications', 'Profile'],
  admin: ['Home', 'Applications', 'Case Oversight', 'Notifications', 'Profile'],
};

const showError = (error) => Toast.show({ type: 'error', text1: String(error || 'Something went wrong') });
const showSuccess = (text1) => Toast.show({ type: 'success', text1 });

function Field({ label, value, onChangeText, multiline, keyboardType, secureTextEntry }) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, multiline && styles.textArea]}
        value={String(value ?? '')}
        onChangeText={onChangeText}
        multiline={multiline}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        placeholderTextColor="#9ca3af"
      />
    </View>
  );
}

function Button({ title, onPress, tone = 'primary', disabled }) {
  return (
    <TouchableOpacity
      style={[styles.button, styles[`${tone}Button`], disabled && styles.disabled]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={[styles.buttonText, tone === 'secondary' && styles.secondaryButtonText]}>{title}</Text>
    </TouchableOpacity>
  );
}

function Empty({ children }) {
  return <Text style={styles.empty}>{children}</Text>;
}

function StatCard({ label, value, tone = 'neutral' }) {
  return (
    <View style={[styles.statCard, styles[`${tone}Stat`]]}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function DashboardOverview({ role, profile, cases, availableCases, lawyers, notifications }) {
  const claimedCases = cases.filter((item) => item.status === 'claimed' || item.status === 'accepted');
  const openCases = cases.filter((item) => item.status === 'open');
  const pendingLawyers = lawyers.filter((item) => item.approved == null || item.approved === false);
  const approvalReady = pendingLawyers.filter((item) => {
    const popStatus = item.registration_fee_pop_status || (item.registration_fee_paid ? 'verified' : 'pending_review');
    const mandateReady = Boolean(item.fnb_mandate_complete || item.fnb_debit_mandate_accepted);
    return popStatus === 'verified' && mandateReady;
  });

  if (role === 'client') {
    return (
      <View style={styles.overview}>
        <StatCard label="My cases" value={cases.length} tone="amber" />
        <StatCard label="Open" value={openCases.length} />
        <StatCard label="Updates" value={notifications.length} />
      </View>
    );
  }

  if (role === 'lawyer') {
    return (
      <View style={styles.overview}>
        <StatCard label="Accepted" value={claimedCases.length} tone="green" />
        <StatCard label="Available" value={availableCases.length} tone="amber" />
        <StatCard label="Billing" value={profile.fnb_referral_plan || profile.collection_plan || 'basic'} />
      </View>
    );
  }

  return (
    <View style={styles.overview}>
      <StatCard label="Applications" value={pendingLawyers.length} tone="amber" />
      <StatCard label="Cases" value={cases.length} />
      <StatCard label="Ready to approve" value={approvalReady.length} tone="green" />
    </View>
  );
}

function QuickAction({ title, detail, onPress }) {
  return (
    <TouchableOpacity style={styles.quickAction} onPress={onPress}>
      <Text style={styles.quickTitle}>{title}</Text>
      <Text style={styles.quickDetail}>{detail}</Text>
    </TouchableOpacity>
  );
}

function DashboardHome({ role, profile, cases, availableCases, lawyers, notifications, setTab }) {
  const name = profile.name || 'there';
  const nextCase = cases[0];
  const pendingApplications = lawyers.filter((item) => item.approved == null || item.approved === false);

  return (
    <View>
      <Text style={styles.homeGreeting}>Hello, {name}</Text>
      <Text style={styles.homeSubtext}>Your key work is grouped below. Use the bottom bar to move between sections.</Text>
      <DashboardOverview role={role} profile={profile} cases={cases} availableCases={availableCases} lawyers={lawyers} notifications={notifications} />

      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.quickGrid}>
        {role === 'client' && <>
          <QuickAction title="Create or Update Case" detail={`${cases.length} case${cases.length === 1 ? '' : 's'} on file`} onPress={() => setTab('Cases')} />
          <QuickAction title="Schedule" detail="Court dates and consultations" onPress={() => setTab('Calendar')} />
          <QuickAction title="Messages" detail={nextCase?.lawyer?.name ? `Contact ${nextCase.lawyer.name}` : 'Appears when a lawyer accepts'} onPress={() => setTab('Messages')} />
        </>}
        {role === 'lawyer' && <>
          <QuickAction title="Available Cases" detail={`${availableCases.length} matching referral${availableCases.length === 1 ? '' : 's'}`} onPress={() => setTab('Available')} />
          <QuickAction title="My Cases" detail={`${cases.length} accepted case${cases.length === 1 ? '' : 's'}`} onPress={() => setTab('My Cases')} />
          <QuickAction title="Billing" detail={profile.fnb_referral_plan || profile.collection_plan || 'FNB collection'} onPress={() => setTab('Billing')} />
          <QuickAction title="Messages" detail="Client contact cards" onPress={() => setTab('Messages')} />
        </>}
        {role === 'admin' && <>
          <QuickAction title="Applications" detail={`${pendingApplications.length} pending review`} onPress={() => setTab('Applications')} />
          <QuickAction title="Case Oversight" detail={`${cases.length} case${cases.length === 1 ? '' : 's'} in view`} onPress={() => setTab('Case Oversight')} />
          <QuickAction title="Notifications" detail={`${notifications.length} update${notifications.length === 1 ? '' : 's'}`} onPress={() => setTab('Notifications')} />
        </>}
      </View>
    </View>
  );
}

function CaseCard({ item, actions }) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeading}>
        <Text style={styles.cardTitle}>{item.title || `Case #${item.id}`}</Text>
        <Text style={styles.status}>{item.status || 'open'}</Text>
      </View>
      {!!item.description && <Text style={styles.body}>{item.description}</Text>}
      {!!item.case_type && <Text style={styles.meta}>Type: {item.case_type}</Text>}
      {!!item.court && <Text style={styles.meta}>Court: {item.court}</Text>}
      {item.budget != null && <Text style={styles.meta}>Budget: R{item.budget}</Text>}
      {!!item.lawyer?.name && <Text style={styles.success}>Lawyer: {item.lawyer.name}</Text>}
      {!!actions && <View style={styles.actionRow}>{actions}</View>}
    </View>
  );
}

function ProfilePanel({ profile, role, onSave, saving }) {
  const [form, setForm] = useState({});
  useEffect(() => {
    setForm({
      name: profile.name || '', email: profile.email || '', password: '',
      preferred_language: profile.preferred_language || '', budget: profile.budget || '',
      license_number: profile.license_number || '', areas_of_expertise: profile.areas_of_expertise || profile.specializations || '',
      experience_years: profile.experience_years || '', rate: profile.rate || '',
      preferred_court: profile.preferred_court || '', phone_number: profile.phone_number || '',
    });
  }, [profile]);
  const set = (key) => (value) => setForm((current) => ({ ...current, [key]: value }));
  return (
    <View>
      <Text style={styles.sectionTitle}>Profile</Text>
      <Field label="Name" value={form.name} onChangeText={set('name')} />
      <Field label="Email" value={form.email} onChangeText={set('email')} keyboardType="email-address" />
      <Field label="Phone" value={form.phone_number} onChangeText={set('phone_number')} keyboardType="phone-pad" />
      <Field label="New password (optional)" value={form.password} onChangeText={set('password')} secureTextEntry />
      {role === 'client' && <>
        <Field label="Preferred language" value={form.preferred_language} onChangeText={set('preferred_language')} />
        <Field label="Budget" value={form.budget} onChangeText={set('budget')} keyboardType="numeric" />
      </>}
      {role === 'lawyer' && <>
        <Field label="License number" value={form.license_number} onChangeText={set('license_number')} />
        <Field label="Areas of expertise" value={form.areas_of_expertise} onChangeText={set('areas_of_expertise')} />
        <Field label="Experience (years)" value={form.experience_years} onChangeText={set('experience_years')} keyboardType="numeric" />
        <Field label="Rate" value={form.rate} onChangeText={set('rate')} keyboardType="numeric" />
      </>}
      <Button title={saving ? 'Saving…' : 'Save profile'} disabled={saving} onPress={() => onSave(form)} />
    </View>
  );
}

function ClientCases({ profile, cases, dispatch, loading }) {
  const [form, setForm] = useState(EMPTY_CASE);
  const [editingId, setEditingId] = useState(null);
  const set = (key) => (value) => setForm((current) => ({ ...current, [key]: value }));
  const submit = async () => {
    if (!form.title || !form.description) return showError('Add a title and description');
    if (!editingId && !form.public_user_terms_accepted) return showError('Accept the public-user terms before submitting');
    try {
      if (editingId) {
        await dispatch(updateCase({ userId: profile.id, caseId: editingId, caseData: form })).unwrap();
        showSuccess('Case updated');
      } else {
        await dispatch(createCase({ userId: profile.id, caseData: form })).unwrap();
        showSuccess('Case created');
      }
      setForm(EMPTY_CASE); setEditingId(null);
    } catch (error) { showError(error); }
  };
  const edit = (item) => {
    setEditingId(item.id);
    setForm(Object.fromEntries(Object.keys(EMPTY_CASE).map((key) => [key, String(item[key] ?? '')])));
  };
  const remove = (item) => Alert.alert('Delete case?', item.title, [
    { text: 'Cancel', style: 'cancel' },
    { text: 'Delete', style: 'destructive', onPress: async () => {
      try { await dispatch(deleteCase({ userId: profile.id, caseId: item.id })).unwrap(); showSuccess('Case deleted'); }
      catch (error) { showError(error); }
    } },
  ]);
  return <View>
    <Text style={styles.sectionTitle}>{editingId ? 'Edit Case' : 'Describe Your Case'}</Text>
    <Field label="Title" value={form.title} onChangeText={set('title')} />
    <Field label="Description" value={form.description} onChangeText={set('description')} multiline />
    {!editingId && <TouchableOpacity style={styles.checkboxRow} onPress={() => set('public_user_terms_accepted')(!form.public_user_terms_accepted)}>
      <View style={[styles.checkbox, form.public_user_terms_accepted && styles.checkboxChecked]}>
        {form.public_user_terms_accepted ? <Text style={styles.checkboxTick}>OK</Text> : null}
      </View>
      <Text style={styles.checkboxText}>I accept the current LEGAL SUISE public-user engagement terms.</Text>
    </TouchableOpacity>}
    <Text style={styles.label}>Preferred court</Text>
    <View style={styles.picker}><Picker selectedValue={form.court} onValueChange={set('court')}>
      <Picker.Item label="Select court" value="" />{COURTS.map((item) => <Picker.Item key={item} label={item} value={item} />)}
    </Picker></View>
    <Field label="Budget" value={form.budget} onChangeText={set('budget')} keyboardType="numeric" />
    <Text style={styles.label}>Case type</Text>
    <View style={styles.picker}><Picker selectedValue={form.case_type} onValueChange={set('case_type')}>
      <Picker.Item label="Select type" value="" />{CASE_TYPES.map((item) => <Picker.Item key={item} label={item} value={item} />)}
    </Picker></View>
    <View style={styles.actionRow}><Button title={loading ? 'Saving…' : editingId ? 'Update Case' : 'Create Case'} onPress={submit} disabled={loading} />
      {editingId && <Button title="Cancel" tone="secondary" onPress={() => { setEditingId(null); setForm(EMPTY_CASE); }} />}</View>
    <Text style={styles.sectionTitle}>My Cases</Text>
    {!cases.length ? <Empty>No cases yet.</Empty> : cases.map((item) => <CaseCard key={item.id} item={item} actions={<>
      <Button title="Edit" tone="secondary" onPress={() => edit(item)} /><Button title="Delete" tone="danger" onPress={() => remove(item)} />
    </>} />)}
  </View>;
}

function CalendarPanel({ role, userId, cases }) {
  const [selected, setSelected] = useState(new Date().toISOString().slice(0, 10));
  const [events, setEvents] = useState([]);
  const [eventForm, setEventForm] = useState({ title: '', type: EVENT_TYPES[0], caseId: '', notes: '' });
  const storageKey = `dashboardCalendar:${role}:${userId || 'guest'}`;
  const eventsForSelected = events.filter((event) => event.date === selected);
  const upcomingEvents = [...events]
    .filter((event) => event.date >= new Date().toISOString().slice(0, 10))
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 6);
  const markedDates = events.reduce((marked, event) => ({
    ...marked,
    [event.date]: { ...(marked[event.date] || {}), marked: true, dotColor: '#059669' },
  }), {
    [selected]: { selected: true, selectedColor: '#f59e0b', marked: eventsForSelected.length > 0, dotColor: '#059669' },
  });

  useEffect(() => {
    let active = true;
    AsyncStorage.getItem(storageKey).then((value) => {
      if (active && value) setEvents(JSON.parse(value));
    }).catch(() => {});
    return () => { active = false; };
  }, [storageKey]);

  useEffect(() => {
    AsyncStorage.setItem(storageKey, JSON.stringify(events)).catch(() => {});
  }, [events, storageKey]);

  const setEventField = (key) => (value) => setEventForm((current) => ({ ...current, [key]: value }));
  const addEvent = () => {
    if (!eventForm.title.trim()) return showError('Add an event title');
    const relatedCase = cases.find((item) => String(item.id) === String(eventForm.caseId));
    setEvents((old) => [...old, {
      id: `${Date.now()}`,
      date: selected,
      title: eventForm.title.trim(),
      type: eventForm.type,
      caseId: eventForm.caseId,
      caseTitle: relatedCase?.title || '',
      notes: eventForm.notes.trim(),
    }]);
    setEventForm({ title: '', type: EVENT_TYPES[0], caseId: '', notes: '' });
    showSuccess('Schedule item added');
  };
  const removeEvent = (eventId) => setEvents((old) => old.filter((event) => event.id !== eventId));

  return <View><Text style={styles.sectionTitle}>Calendar</Text>
    <Text style={styles.helper}>Track consultations, court dates, filing deadlines, and follow-ups.</Text>
    <Calendar onDayPress={(day) => setSelected(day.dateString)} markedDates={markedDates} />
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Add item for {selected}</Text>
      <Field label="Title" value={eventForm.title} onChangeText={setEventField('title')} />
      <Text style={styles.label}>Type</Text>
      <View style={styles.picker}><Picker selectedValue={eventForm.type} onValueChange={setEventField('type')}>
        {EVENT_TYPES.map((item) => <Picker.Item key={item} label={item} value={item} />)}
      </Picker></View>
      <Text style={styles.label}>Related case</Text>
      <View style={styles.picker}><Picker selectedValue={eventForm.caseId} onValueChange={setEventField('caseId')}>
        <Picker.Item label="No case link" value="" />
        {cases.map((item) => <Picker.Item key={item.id} label={item.title || `Case #${item.id}`} value={String(item.id)} />)}
      </Picker></View>
      <Field label="Notes" value={eventForm.notes} onChangeText={setEventField('notes')} multiline />
      <Button title="Add Schedule Item" onPress={addEvent} />
    </View>
    <Text style={styles.sectionTitle}>Selected Date</Text>
    {!eventsForSelected.length ? <Empty>No items for this date.</Empty> : eventsForSelected.map((event) => <View key={event.id} style={styles.card}>
      <Text style={styles.cardTitle}>{event.title}</Text>
      <Text style={styles.meta}>{event.type} - {event.date}</Text>
      {!!event.caseTitle && <Text style={styles.meta}>Case: {event.caseTitle}</Text>}
      {!!event.notes && <Text style={styles.body}>{event.notes}</Text>}
      <Button title="Remove" tone="danger" onPress={() => removeEvent(event.id)} />
    </View>)}
    <Text style={styles.sectionTitle}>Upcoming</Text>
    {!upcomingEvents.length ? <Empty>No upcoming schedule items.</Empty> : upcomingEvents.map((event) => <View key={`upcoming-${event.id}`} style={styles.compactCard}>
      <Text style={styles.cardTitle}>{event.title}</Text>
      <Text style={styles.meta}>{event.date} - {event.type}</Text>
    </View>)}
  </View>;
}

function NotificationPanel({ notifications }) {
  return <View><Text style={styles.sectionTitle}>Notifications</Text>{!notifications?.length ? <Empty>No notifications yet.</Empty> : notifications.map((item, index) =>
    <View key={item.id || index} style={styles.card}><Text style={styles.body}>{item.message || item.title || String(item)}</Text></View>)}</View>;
}

function MessagesPanel({ role, cases, clients }) {
  const clientContacts = cases
    .filter((item) => item.lawyer?.email)
    .map((item) => ({
      id: `lawyer-${item.id}`,
      name: item.lawyer.name,
      email: item.lawyer.email,
      detail: item.title ? `Case: ${item.title}` : 'Assigned lawyer',
      action: 'Email Lawyer',
    }));
  const claimedClientIds = cases
    .filter((item) => item.status === 'claimed' || item.status === 'accepted')
    .map((item) => item.client_id);
  const lawyerContacts = clients
    .filter((client) => claimedClientIds.includes(client.id))
    .map((client) => ({
      id: `client-${client.id}`,
      name: client.name,
      email: client.email,
      detail: client.preferred_language ? `Preferred language: ${client.preferred_language}` : 'Accepted case client',
      action: 'Email Client',
    }));
  const contacts = role === 'lawyer' ? lawyerContacts : clientContacts;

  return <View>
    <Text style={styles.sectionTitle}>Messages</Text>
    <Text style={styles.helper}>Use messages for direct practitioner-client communication. Notifications are system updates.</Text>
    {!contacts.length ? <Empty>{role === 'lawyer' ? 'Accept a case to unlock client contacts.' : 'Your lawyer contact will appear after a practitioner accepts your case.'}</Empty> : contacts.map((contact) => (
      <View key={contact.id} style={styles.card}>
        <Text style={styles.cardTitle}>{contact.name || 'Contact'}</Text>
        <Text style={styles.meta}>{contact.email}</Text>
        <Text style={styles.meta}>{contact.detail}</Text>
        {!!contact.email && <View style={styles.actionRow}><Button title={contact.action} onPress={() => Linking.openURL(`mailto:${contact.email}`)} /></View>}
      </View>
    ))}
  </View>;
}

const money = (amount) => `R ${Number(amount || 0).toFixed(2)}`;
const prettyStatus = (value) => String(value || 'pending').replace(/_/g, ' ');

function BillingPanel({ profile, collectionPlan, setCollectionPlan, dispatch, load }) {
  const [summary, setSummary] = useState(null);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [savingMandate, setSavingMandate] = useState(false);
  const [retrying, setRetrying] = useState(false);

  const activePlan = REFERRAL_PLANS.find((plan) => plan.key === collectionPlan) || REFERRAL_PLANS[0];
  const billing = summary || profile.billing_summary || {};
  const invoices = billing.invoices || profile.invoices || profile.billing_invoices || [];
  const popStatus = billing.registration_fee_pop_status || profile.registration_fee_pop_status || (profile.registration_fee_paid ? 'verified' : 'pending_review');
  const mandateAccepted = Boolean(billing.fnb_debit_mandate_accepted ?? profile.fnb_debit_mandate_accepted);
  const collectionStatus = billing.collection_status || profile.collection_status || 'pending';
  const isFailed = collectionStatus === 'failed' || collectionStatus === 'retry_required';

  const fetchSummary = useCallback(async () => {
    try {
      setLoadingSummary(true);
      const response = await axiosInstance.get('/payments/fnb_collection_summary');
      setSummary(response.data);
    } catch (error) {
      setSummary(null);
    } finally {
      setLoadingSummary(false);
    }
  }, []);

  useEffect(() => { fetchSummary(); }, [fetchSummary]);

  const acceptMandate = async () => {
    try {
      setSavingMandate(true);
      await axiosInstance.post('/payments/fnb_debit_mandate', {
        mandate: {
          accepted: true,
          fnb_referral_plan: collectionPlan,
          accepted_at: new Date().toISOString(),
        },
      });
      showSuccess('FNB mandate accepted');
      await fetchSummary();
      await load();
    } catch (error) {
      showError(error.response?.data?.error || error.message);
    } finally {
      setSavingMandate(false);
    }
  };

  const retryCollection = async () => {
    try {
      setRetrying(true);
      await axiosInstance.post('/payments/fnb_collection_retry');
      showSuccess('Collection retry requested');
      await fetchSummary();
    } catch (error) {
      showError(error.response?.data?.error || error.message);
    } finally {
      setRetrying(false);
    }
  };

  return <View>
    <Text style={styles.sectionTitle}>Practitioner subscription</Text>
    <View style={styles.card}>
      <Text style={styles.balance}>R {activePlan.amount}</Text>
      <Text style={styles.meta}>{activePlan.label}</Text>
      <Text style={styles.meta}>Billing period: {billing.current_period_label || profile.billing_period_label || 'Calendar month'}</Text>
      <Text style={styles.meta}>Current referrals: {billing.current_referral_count ?? profile.current_referral_count ?? 0}</Text>
      <Text style={styles.meta}>Next collection: {billing.next_collection_date || profile.next_collection_date || 'To be scheduled'}</Text>
      <Text style={styles.meta}>Collection status: {prettyStatus(collectionStatus)}</Text>
      <Text style={styles.meta}>Registration POP: {prettyStatus(popStatus)}</Text>
      <Text style={styles.meta}>Debit mandate: {mandateAccepted ? 'Accepted' : 'Required'}</Text>
      {!!billing.failed_collection_reason && <Text style={styles.warning}>Failure reason: {billing.failed_collection_reason}</Text>}
      {!!billing.plan_change_effective_on && <Text style={styles.meta}>Plan changes apply on {billing.plan_change_effective_on}.</Text>}
    </View>

    {REFERRAL_PLANS.map((plan) => <TouchableOpacity key={plan.key} style={[styles.planOption, collectionPlan === plan.key && styles.activePlan]} onPress={() => setCollectionPlan(plan.key)}><Text style={styles.planTitle}>{plan.label}</Text><Text style={styles.planAmount}>R{plan.amount}</Text></TouchableOpacity>)}
    <Button title="Save Collection Plan" onPress={async () => {
      try { await dispatch(updateFnbCollectionPlan(collectionPlan)).unwrap(); showSuccess('Collection plan saved'); await fetchSummary(); await load(); }
      catch (error) { showError(error); }
    }} />

    <View style={styles.card}>
      <Text style={styles.cardTitle}>Debit mandate</Text>
      <Text style={styles.body}>I authorise LEGAL SUISE and its payment providers to collect lawful fees under the selected platform tier.</Text>
      <Button title={mandateAccepted ? 'Mandate Accepted' : 'Accept Debit Mandate'} disabled={savingMandate || mandateAccepted} onPress={acceptMandate} />
    </View>

    {isFailed && <View style={styles.card}>
      <Text style={styles.cardTitle}>Collection retry</Text>
      <Text style={styles.body}>Resolve the account issue with FNB, then request a retry for the failed month-end collection.</Text>
      <Button title={retrying ? 'Requesting...' : 'Request Retry'} disabled={retrying} onPress={retryCollection} />
    </View>}

    <Text style={styles.sectionTitle}>Invoices and Statements</Text>
    {loadingSummary ? <ActivityIndicator color="#f59e0b" /> : !invoices.length ? <Empty>No invoices or statements yet.</Empty> : invoices.map((invoice, index) => <View key={invoice.id || invoice.number || index} style={styles.card}>
      <Text style={styles.cardTitle}>{invoice.number || invoice.title || `Statement #${index + 1}`}</Text>
      <Text style={styles.meta}>Period: {invoice.period || invoice.period_label || 'Not specified'}</Text>
      <Text style={styles.meta}>Amount: {money(invoice.amount || invoice.amount_due || invoice.total)}</Text>
      <Text style={styles.meta}>Status: {prettyStatus(invoice.status)}</Text>
      {!!invoice.url && <TouchableOpacity onPress={() => Linking.openURL(invoice.url)}><Text style={styles.link}>Open statement</Text></TouchableOpacity>}
    </View>)}
  </View>;
}

export default function DashboardScreen({ role }) {
  const dispatch = useDispatch();
  const authUser = useSelector((state) => state.auth.user);
  const { profile, lawyers, clients, notifications, loading: userLoading, error: userError } = useSelector((state) => state.user);
  const { cases, availableCases, loading: caseLoading, error: caseError } = useSelector((state) => state.cases);
  const [tab, setTab] = useState(tabsByRole[role][0]);
  const [refreshing, setRefreshing] = useState(false);
  const [feeCase, setFeeCase] = useState(null);
  const [collectionPlan, setCollectionPlan] = useState('basic');
  const userId = profile.id || authUser?.id;
  const displayName = profile.name || authUser?.name || 'Dashboard';

  const load = useCallback(async () => {
    if (!authUser?.id) return;
    const requests = [dispatch(fetchProfile({ role, id: authUser.id }))];
    if (role === 'client') requests.push(dispatch(fetchCases(authUser.id)), dispatch(fetchNotifications(authUser.id)));
    if (role === 'lawyer') requests.push(dispatch(fetchCases(authUser.id)), dispatch(fetchClients({ lawyer_id: authUser.id })), dispatch(fetchNotifications(authUser.id)));
    if (role === 'admin') requests.push(dispatch(fetchLawyers()), dispatch(fetchAdminCases(authUser.id)), dispatch(fetchNotifications(authUser.id)));
    await Promise.all(requests);
  }, [authUser?.id, dispatch, role]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => {
    if (role !== 'lawyer' || !profile.id) return;
    dispatch(fetchAvailableCases(profile.id));
  }, [dispatch, profile.id, role]);
  useEffect(() => {
    if (role !== 'lawyer') return;
    setCollectionPlan(profile.fnb_referral_plan || profile.collection_plan || 'basic');
  }, [profile.collection_plan, profile.fnb_referral_plan, role]);
  useEffect(() => {
    if (!userId) return undefined;
    const timer = setInterval(() => dispatch(fetchNotifications(userId)), 30000);
    return () => clearInterval(timer);
  }, [dispatch, userId]);
  useEffect(() => {
    if (!userId) return undefined;
    return subscribeToNotifications(userId, (notification) => {
      dispatch(receiveNotification(notification));
      if (notification?.message) {
        Toast.show({ type: 'info', text1: notification.message });
      }
    });
  }, [dispatch, userId]);

  const refresh = async () => { setRefreshing(true); await load(); setRefreshing(false); };
  const saveProfile = async (form) => {
    try { await dispatch(updateProfile({ id: userId, profileData: { user: form } })).unwrap(); showSuccess('Profile updated'); }
    catch (error) { showError(error); }
  };
  const confirmAccept = async (method) => {
    try {
      await dispatch(acceptCase({ caseId: feeCase.id, lawyerId: userId, platform_fee_method: method })).unwrap();
      setFeeCase(null); await load(); showSuccess('Case accepted');
    } catch (error) { showError(error); }
  };
  /*
  const peachPayment = async (path) => {
    try { const response = await axiosInstance.post(path, { payment: { return_target: 'mobile' } }); await Linking.openURL(response.data.redirect_url); }
    catch (error) { showError(error.response?.data?.error || error.message); }
  };
  */

  const content = useMemo(() => {
    if (tab === 'Home') return <DashboardHome role={role} profile={profile} cases={cases} availableCases={availableCases} lawyers={lawyers} notifications={notifications} setTab={setTab} />;
    if (tab === 'Cases') return <ClientCases profile={profile} cases={cases} dispatch={dispatch} loading={caseLoading} />;
    if (tab === 'My Cases') return <View><Text style={styles.sectionTitle}>Case Management</Text>{!cases.length ? <Empty>No accepted cases yet.</Empty> : cases.filter((item) => item.status === 'claimed').map((item) => <CaseCard key={item.id} item={item} actions={item.platform_fee_status === 'pending' ? <Text style={styles.meta}>Fee will be included in FNB month-end collection.</Text> : null} />)}</View>;
    if (tab === 'Available') return <View><Text style={styles.sectionTitle}>Available Cases</Text>{!availableCases.length ? <Empty>No matching open cases.</Empty> : availableCases.map((item) => <CaseCard key={item.id} item={item} actions={<Button title="Accept Case" onPress={() => setFeeCase(item)} />} />)}</View>;
    if (tab === 'Clients') {
      const ids = cases.filter((item) => item.status === 'claimed').map((item) => item.client_id);
      const visible = clients.filter((item) => ids.includes(item.id));
      return <View><Text style={styles.sectionTitle}>Client Management</Text>{!visible.length ? <Empty>Accept a case to view clients.</Empty> : visible.map((item) => <View key={item.id} style={styles.card}><Text style={styles.cardTitle}>{item.name}</Text><Text style={styles.meta}>{item.email}</Text><Text style={styles.meta}>Preferred language: {item.preferred_language || '—'}</Text><Text style={styles.meta}>Budget: R{item.budget || 0}</Text></View>)}</View>;
    }
    if (tab === 'Billing') {
      return <BillingPanel profile={profile} collectionPlan={collectionPlan} setCollectionPlan={setCollectionPlan} dispatch={dispatch} load={load} />;
    }
    if (tab === 'Applications') {
      const pending = lawyers.filter((item) => item.approved == null || item.approved === false);
      const decide = (lawyer, approved) => Alert.alert(`${approved ? 'Approve' : 'Reject'} lawyer?`, lawyer.name, [{ text: 'Cancel' }, { text: 'Confirm', onPress: async () => {
        try {
          const user = { ...lawyer, approved }; delete user.id;
          await dispatch(updateProfile({ id: lawyer.id, profileData: { user } })).unwrap();
          if (approved) await dispatch(approveLawyer(lawyer.id)).unwrap();
          await dispatch(fetchLawyers()); showSuccess(`Application ${approved ? 'approved' : 'rejected'}`);
        } catch (error) { showError(error); }
      } }]);
      const openDoc = (value) => { if (!value) return; const path = value.replace(/^https?:\/\/[^/]+/, ''); Linking.openURL(`${axiosInstance.defaults.baseURL}${path.startsWith('/') ? path : `/${path}`}`); };
      const verifyPop = async (lawyer, status) => {
        try {
          await axiosInstance.post(`/api/users/${lawyer.id}/registration_pop`, { payment: { status } });
          await dispatch(fetchLawyers());
          showSuccess(`POP ${status === 'verified' ? 'verified' : 'rejected'}`);
        } catch (error) {
          showError(error.response?.data?.error || error.message);
        }
      };
      return <View><Text style={styles.sectionTitle}>Pending Lawyer Applications</Text>{!pending.length ? <Empty>No pending applications.</Empty> : pending.map((item) => {
        const plan = REFERRAL_PLANS.find((entry) => entry.key === (item.fnb_referral_plan || item.collection_plan));
        const popStatus = item.registration_fee_pop_status || (item.registration_fee_paid ? 'verified' : 'pending_review');
        const mandateReady = Boolean(item.fnb_mandate_complete || item.fnb_debit_mandate_accepted);
        const canApprove = popStatus === 'verified' && mandateReady;

        return <View key={item.id} style={styles.card}>
          <Text style={styles.cardTitle}>{item.name}</Text>
          <Text style={styles.meta}>{item.email}</Text>
          <Text style={styles.meta}>License: {item.license_number || 'N/A'}</Text>
          <Text style={styles.meta}>Experience: {item.experience_years || 0} years</Text>
          <Text style={styles.meta}>Expertise: {item.areas_of_expertise || 'N/A'}</Text>
          <Text style={styles.meta}>FNB plan: {plan ? `${plan.label} - R${plan.amount}` : 'Not selected'}</Text>
          <Text style={styles.meta}>POP status: {prettyStatus(popStatus)}</Text>
          <Text style={styles.meta}>FNB mandate: {mandateReady ? 'Submitted' : 'Incomplete'}</Text>
          <Text style={styles.meta}>Mandate account: {item.fnb_mandate_account_holder || 'Not provided'} {item.fnb_mandate_account_number ? `(${item.fnb_mandate_account_number})` : ''}</Text>
          {[
            ['Registration fee POP', item.registration_fee_pop || item.registration_pop || item.proof_of_payment],
            ['Admission order', item.admission_enrollment_order],
            ['Good standing letter', item.good_standing_letter],
            ['Fidelity certificate', item.fidelity_fund_certificate],
            ['ID document', item.id_document],
          ].map(([label, value]) => <TouchableOpacity key={label} disabled={!value} onPress={() => openDoc(value)}><Text style={value ? styles.link : styles.muted}>{value ? `Open ${label}` : `${label} not uploaded`}</Text></TouchableOpacity>)}
          <View style={styles.actionRow}><Button title="Verify POP" tone="success" disabled={popStatus === 'verified'} onPress={() => verifyPop(item, 'verified')} /><Button title="Reject POP" tone="secondary" onPress={() => verifyPop(item, 'rejected')} /></View>
          <View style={styles.actionRow}><Button title="Approve" tone="success" disabled={!canApprove} onPress={() => decide(item, true)} /><Button title="Reject" tone="danger" onPress={() => decide(item, false)} /></View>
        </View>;
      })}</View>;
    }
    if (tab === 'Case Oversight') return <View><Text style={styles.sectionTitle}>Case Oversight</Text>{!cases.length ? <Empty>No cases available.</Empty> : cases.map((item) => <CaseCard key={item.id} item={item} actions={item.lawyer ? <Button title="Unassign Lawyer" tone="danger" onPress={async () => { try { await dispatch(unassignCase({ caseId: item.id, adminId: userId })).unwrap(); showSuccess('Lawyer unassigned'); } catch (error) { showError(error); } }} /> : <Text style={styles.warning}>Awaiting lawyer acceptance</Text>} />)}</View>;
    if (tab === 'Calendar') return <CalendarPanel role={role} userId={userId} cases={cases} />;
    if (tab === 'Messages') return <MessagesPanel role={role} cases={cases} clients={clients} />;
    if (tab === 'Notifications') return <NotificationPanel notifications={notifications} />;
    if (tab === 'Profile') return <ProfilePanel profile={profile} role={role} onSave={saveProfile} saving={userLoading} />;
    return null;
  }, [availableCases, caseLoading, cases, clients, collectionPlan, dispatch, lawyers, load, notifications, profile, role, tab, userId, userLoading]);

  return <View style={styles.screen}>
    <View style={styles.header}>
      <View style={styles.headerCopy}>
        <Text style={styles.eyebrow}>{role.toUpperCase()} DASHBOARD</Text>
        <Text style={styles.title}>Legal Suise</Text>
        <Text style={styles.subtitle}>{displayName} - {tab}</Text>
      </View>
      <Button title="Logout" tone="danger" onPress={() => dispatch(logout())} />
    </View>
    {(userError || caseError) && <Text style={styles.error}>{userError || caseError}</Text>}
    <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor="#f59e0b" />}>{(userLoading && !profile.id) ? <ActivityIndicator size="large" color="#f59e0b" /> : content}</ScrollView>
    <View style={styles.bottomNavShell}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.bottomNav}>
        {tabsByRole[role].map((item) => <TouchableOpacity key={item} style={[styles.navItem, tab === item && styles.activeNavItem]} onPress={() => setTab(item)}><Text style={[styles.navText, tab === item && styles.activeNavText]}>{item}</Text></TouchableOpacity>)}
      </ScrollView>
    </View>
    <Modal transparent visible={!!feeCase} animationType="fade" onRequestClose={() => setFeeCase(null)}><View style={styles.modalBackdrop}><View style={styles.modal}><Text style={styles.cardTitle}>Accept referral</Text><Text style={styles.body}>Accept "{feeCase?.title}" under your selected FNB month-end collection plan.</Text><Button title="Accept Referral" onPress={() => confirmAccept('fnb_collection')} /><Button title="Cancel" tone="danger" onPress={() => setFeeCase(null)} /></View></View></Modal>
  </View>;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f3f4f6' },
  header: { backgroundColor: '#111827', paddingTop: 48, paddingHorizontal: 18, paddingBottom: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  headerCopy: { flex: 1 },
  eyebrow: { color: '#f59e0b', fontSize: 11, fontWeight: '800', letterSpacing: 1.4 },
  title: { color: 'white', fontSize: 22, fontWeight: '800', marginTop: 2 },
  subtitle: { color: '#d1d5db', marginTop: 4, fontWeight: '700' },
  overview: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  statCard: { flex: 1, backgroundColor: '#111827', borderRadius: 10, padding: 10, borderWidth: 1, borderColor: '#374151', minHeight: 72 },
  amberStat: { borderColor: '#f59e0b' },
  greenStat: { borderColor: '#059669' },
  neutralStat: { borderColor: '#374151' },
  statValue: { color: 'white', fontSize: 19, fontWeight: '900' },
  statLabel: { color: '#9ca3af', fontSize: 11, fontWeight: '700', marginTop: 5 },
  homeGreeting: { color: '#111827', fontSize: 26, fontWeight: '900', marginBottom: 6 },
  homeSubtext: { color: '#6b7280', fontSize: 14, lineHeight: 20, marginBottom: 16 },
  quickGrid: { gap: 10, marginBottom: 8 },
  quickAction: { backgroundColor: 'white', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, padding: 16 },
  quickTitle: { color: '#111827', fontSize: 16, fontWeight: '900' },
  quickDetail: { color: '#6b7280', marginTop: 5 },
  bottomNavShell: { backgroundColor: 'white', borderTopWidth: 1, borderTopColor: '#e5e7eb', paddingVertical: 8 },
  bottomNav: { paddingHorizontal: 10, gap: 8 },
  navItem: { minHeight: 42, paddingHorizontal: 14, borderRadius: 999, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f3f4f6', borderWidth: 1, borderColor: '#e5e7eb' },
  activeNavItem: { backgroundColor: '#111827', borderColor: '#111827' },
  navText: { color: '#4b5563', fontSize: 12, fontWeight: '800' },
  activeNavText: { color: '#fbbf24' },
  content: { flex: 1 }, contentContainer: { padding: 16, paddingBottom: 28 },
  sectionTitle: { fontSize: 24, color: '#111827', fontWeight: '800', marginBottom: 16, marginTop: 4 },
  card: { backgroundColor: 'white', borderRadius: 14, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#e5e7eb' },
  compactCard: { backgroundColor: 'white', borderRadius: 10, padding: 12, marginBottom: 8, borderWidth: 1, borderColor: '#e5e7eb' },
  cardHeading: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 },
  cardTitle: { color: '#111827', fontSize: 18, fontWeight: '800', flexShrink: 1 },
  status: { color: '#92400e', backgroundColor: '#fef3c7', borderRadius: 20, paddingHorizontal: 9, paddingVertical: 4, fontSize: 11, fontWeight: '800', textTransform: 'uppercase' },
  body: { color: '#374151', fontSize: 15, lineHeight: 22, marginTop: 8 }, meta: { color: '#6b7280', marginTop: 6 },
  helper: { color: '#6b7280', fontSize: 14, lineHeight: 20, marginTop: -8, marginBottom: 12 },
  success: { color: '#047857', fontWeight: '700', marginTop: 8 }, warning: { color: '#b45309', fontWeight: '700' }, error: { color: '#b91c1c', backgroundColor: '#fee2e2', padding: 10 }, muted: { color: '#9ca3af', marginTop: 8 }, link: { color: '#2563eb', textDecorationLine: 'underline', marginTop: 9 },
  field: { marginBottom: 14 }, label: { color: '#374151', fontSize: 13, fontWeight: '700', marginBottom: 6 },
  input: { backgroundColor: 'white', color: '#111827', borderWidth: 1, borderColor: '#d1d5db', borderRadius: 10, paddingHorizontal: 13, paddingVertical: 12, fontSize: 15 }, textArea: { minHeight: 100, textAlignVertical: 'top' },
  picker: { backgroundColor: 'white', borderWidth: 1, borderColor: '#d1d5db', borderRadius: 10, marginBottom: 14, overflow: 'hidden' },
  button: { borderRadius: 9, paddingVertical: 10, paddingHorizontal: 14, alignItems: 'center', justifyContent: 'center', marginVertical: 4, minWidth: 88 },
  primaryButton: { backgroundColor: '#f59e0b' }, secondaryButton: { backgroundColor: '#e5e7eb' }, dangerButton: { backgroundColor: '#dc2626' }, successButton: { backgroundColor: '#059669' }, disabled: { opacity: 0.5 },
  buttonText: { color: 'white', fontWeight: '800', fontSize: 13 }, secondaryButtonText: { color: '#1f2937' },
  actionRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap', marginTop: 10 }, empty: { color: '#6b7280', textAlign: 'center', paddingVertical: 30 }, balance: { fontSize: 32, fontWeight: '900', color: '#111827' },
  planOption: { backgroundColor: 'white', borderWidth: 1, borderColor: '#d1d5db', borderRadius: 8, padding: 14, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  activePlan: { borderColor: '#059669', backgroundColor: '#ecfdf5' },
  planTitle: { color: '#111827', fontWeight: '800' },
  planAmount: { color: '#047857', fontWeight: '900' },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.65)', justifyContent: 'center', padding: 22 }, modal: { backgroundColor: 'white', borderRadius: 16, padding: 20, gap: 8 },
});
