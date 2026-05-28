import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// =======================
// Toggle API here:
// =======================
const API_URL = 'http://127.0.0.1:3001';
// const API_URL = 'https://sharuh-law-backend.onrender.com';

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    Accept: 'application/json',
  },
});

// Attach JWT token automatically
axiosInstance.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
