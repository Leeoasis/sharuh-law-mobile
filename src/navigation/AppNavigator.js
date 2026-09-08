import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useSelector } from 'react-redux';

// Landing Site Screens
import WelcomePage from '../components/landingSite/WelcomePage';
import About from '../components/landingSite/About';
import Contact from '../components/landingSite/Contact';

// Auth Screens
import Login from '../components/auth/Login';
import Registration from '../components/auth/Registration';
import PayRegistration from '../components/auth/PayRegistration';
import PendingApproval from '../components/auth/PendingApproval';

// Dashboard Screens
import AdminDashboard from '../components/dashboards/AdminDashboard';
import ClientDashboard from '../components/dashboards/ClientDashboard';
import LawyerDashboard from '../components/dashboards/LawyerDashboard';

const Stack = createStackNavigator();

const hasLawyerRegistrationPayment = (user) => {
  if (!user) return false;

  const popStatus = user.registration_fee_pop_status;
  const hasSubmittedPop = popStatus && ['pending_review', 'verified'].includes(popStatus);

  return Boolean(
    user.registration_fee_paid ||
      hasSubmittedPop ||
      user.registration_fee_pop_url ||
      user.registration_fee_pop ||
      user.registration_pop ||
      user.proof_of_payment
  );
};

export default function AppNavigator() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const lawyerHasRegistrationPayment = hasLawyerRegistrationPayment(user);

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {!isAuthenticated ? (
          <>
            <Stack.Screen name="Welcome" component={WelcomePage} />
            <Stack.Screen name="About" component={About} />
            <Stack.Screen name="Contact" component={Contact} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Registration" component={Registration} />
            <Stack.Screen name="PayRegistration" component={PayRegistration} />
            <Stack.Screen name="PendingApproval" component={PendingApproval} />
          </>
        ) : (
          <>
            {user?.role === 'admin' && (
              <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
            )}
            {user?.role === 'client' && (
              <Stack.Screen name="ClientDashboard" component={ClientDashboard} />
            )}
            {user?.role === 'lawyer' && !lawyerHasRegistrationPayment && (
              <Stack.Screen name="PayRegistration" component={PayRegistration} />
            )}
            {user?.role === 'lawyer' && lawyerHasRegistrationPayment && !user.approved && (
              <Stack.Screen name="PendingApproval" component={PendingApproval} />
            )}
            {user?.role === 'lawyer' && lawyerHasRegistrationPayment && user.approved && (
              <Stack.Screen name="LawyerDashboard" component={LawyerDashboard} />
            )}
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
