/**
 * @format
 */

import React, { useEffect } from 'react';
import { Linking } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import { store, persistor } from './src/redux/store';
import AppNavigator from './src/navigation/AppNavigator';
import Loading from './src/components/common/Loading';
import axiosInstance from './src/api/axiosInstance';
import { setAuth } from './src/redux/auth/authSlice';
import { fetchProfile } from './src/redux/features/userSlice';
import { fetchCases } from './src/redux/features/caseSlice';

const handledPaymentUrls = new Set();

function AppContent({ rootStyle }) {
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);

  useEffect(() => {
    const handlePaymentReturn = async ({ url }) => {
      if (!url?.startsWith('legal-suise://payment/') || handledPaymentUrls.has(url)) return;
      handledPaymentUrls.add(url);

      if (user?.id && token) {
        for (let attempt = 0; attempt < 5; attempt += 1) {
          try {
            const response = await axiosInstance.get(`/api/user/profile/${user.role}/${user.id}`);
            const refreshedUser = response.data;
            dispatch(setAuth({ user: refreshedUser, token }));
            dispatch(fetchProfile({ role: user.role, id: user.id }));
            if (user.role === 'lawyer') dispatch(fetchCases(user.id));
            Toast.show({ type: 'success', text1: 'Payment status updated' });
            return;
          } catch (error) {
            if (attempt === 4) {
              Toast.show({ type: 'error', text1: 'Unable to refresh payment status' });
              return;
            }
            await new Promise((resolve) => setTimeout(resolve, 1200));
          }
        }
      }
    };

    const subscription =
      typeof Linking.addEventListener === 'function'
        ? Linking.addEventListener('url', handlePaymentReturn)
        : null;

    Linking.getInitialURL().then((url) => handlePaymentReturn({ url }));
    return () => subscription?.remove?.();
  }, [dispatch, token, user?.id, user?.role]);

  return (
    <SafeAreaProvider style={rootStyle}>
      <AppNavigator />
      <StatusBar style="auto" />
      <Toast />
    </SafeAreaProvider>
  );
}

export default function App() {
  const rootStyle = { flex: 1, minHeight: '100vh', overflow: 'auto' };

  return (
    <GestureHandlerRootView style={rootStyle}>
      <Provider store={store}>
        <PersistGate loading={<Loading />} persistor={persistor}>
          <AppContent rootStyle={rootStyle} />
        </PersistGate>
      </Provider>
    </GestureHandlerRootView>
  );
}
