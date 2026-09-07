import { createConsumer } from '@rails/actioncable';
import { Platform } from 'react-native';
import axiosInstance from '../api/axiosInstance';

export function subscribeToNotifications(userId, onReceived) {
  if (Platform.OS !== 'web') {
    return () => {};
  }

  const cableUrl = `${axiosInstance.defaults.baseURL.replace(/^http/, 'ws')}/cable`;
  const consumer = createConsumer(cableUrl);
  const subscription = consumer.subscriptions.create(
    { channel: 'NotificationsChannel', user_id: userId },
    { received: onReceived },
  );

  return () => {
    subscription.unsubscribe();
    consumer.disconnect();
  };
}
