import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authReducer from './auth/authSlice';
import loginReducer from './auth/loginSlice';
import registerReducer from './auth/registerSlice';
import userReducer from './features/userSlice';
import caseReducer from './features/caseSlice';
import depositReducer from './features/depositSlice';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth'],
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    login: loginReducer,
    sign_up: registerReducer,
    user: userReducer,
    cases: caseReducer,
    deposit: depositReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);
