import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import axiosInstance from '../api/axiosInstance';

export async function openSecureDocument(value) {
  const path = new URL(value, axiosInstance.defaults.baseURL).pathname;
  if (!path.startsWith('/rails/active_storage/blobs/')) throw new Error('Unsupported document link');
  // Strip any supplied host: credentials only go to the configured API.
  if (Platform.OS === 'web') {
    const response = await axiosInstance.get(path, { responseType: 'blob' });
    const url = URL.createObjectURL(response.data);
    const link = document.createElement('a');
    link.href = url; link.download = decodeURIComponent(path.split('/').pop()); link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    return;
  }
  if (!(await Sharing.isAvailableAsync())) throw new Error('Document sharing is unavailable on this device');
  const token = await AsyncStorage.getItem('token');
  if (!token) throw new Error('Sign in again to view documents');
  const filename = decodeURIComponent(path.split('/').pop()).replace(/[^a-zA-Z0-9._-]/g, '_');
  const destination = `${FileSystem.cacheDirectory}legal-document-${Date.now()}-${filename}`;
  try {
    const result = await FileSystem.downloadAsync(`${axiosInstance.defaults.baseURL.replace(/\/$/, '')}${path}`, destination, { headers: { Authorization: `Bearer ${token}` } });
    if (result.status !== 200) throw new Error('You cannot access this document');
    await Sharing.shareAsync(result.uri);
  } finally {
    await FileSystem.deleteAsync(destination, { idempotent: true });
  }
}
