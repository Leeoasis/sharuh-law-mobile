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

export default function AppNavigator() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

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
            {user?.role === 'lawyer' && (
              <Stack.Screen name="LawyerDashboard" component={LawyerDashboard} />
            )}
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
