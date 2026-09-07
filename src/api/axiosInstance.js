import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

const unique = (values) => values.filter(Boolean).filter((value, index, list) => list.indexOf(value) === index);
const expoHost = Constants.expoConfig?.hostUri || Constants.manifest2?.extra?.expoClient?.hostUri;
const expoHostname = expoHost?.split(':')?.[0];
const expoLanUrl = expoHostname && !['localhost', '127.0.0.1', '10.0.2.2'].includes(expoHostname)
  ? `http://${expoHostname}:3001`
  : null;

const platformApiUrl = Platform.select({
  web: process.env.EXPO_PUBLIC_API_URL_WEB,
  android: process.env.EXPO_PUBLIC_API_URL_ANDROID,
  ios: process.env.EXPO_PUBLIC_API_URL_IOS,
});
const developmentHost = Platform.select({
  web: 'http://127.0.0.1:3001',
  android: 'http://10.0.2.2:3001',
  ios: 'http://127.0.0.1:3001',
  default: 'http://127.0.0.1:3001',
});
const apiCandidates = unique([
  process.env.EXPO_PUBLIC_API_URL,
  Platform.OS === 'web' ? platformApiUrl : expoLanUrl,
  platformApiUrl,
  developmentHost,
]);
const API_URL = apiCandidates[0];

if (__DEV__) {
  console.log('API_URL:', API_URL);
  console.log('API fallback candidates:', apiCandidates);
}

const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 20000,
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

    if (__DEV__) {
      console.log(
        'API request:',
        config.method?.toUpperCase(),
        config.baseURL || axiosInstance.defaults.baseURL,
        config.url,
      );
    }

    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;
    if (!config || error.response || !apiCandidates.length) {
      return Promise.reject(error);
    }

    const currentIndex = config._apiCandidateIndex ?? apiCandidates.indexOf(config.baseURL || axiosInstance.defaults.baseURL);
    const nextIndex = currentIndex + 1;
    const nextBaseURL = apiCandidates[nextIndex];

    if (!nextBaseURL) {
      return Promise.reject(error);
    }

    if (__DEV__) {
      console.log('API retry with fallback:', nextBaseURL);
    }

    config._apiCandidateIndex = nextIndex;
    config.baseURL = nextBaseURL;
    axiosInstance.defaults.baseURL = nextBaseURL;
    return axiosInstance(config);
  }
);

export default axiosInstance;
