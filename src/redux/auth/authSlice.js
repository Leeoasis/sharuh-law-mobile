import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosInstance from '../../api/axiosInstance';

// ============================================
// 🔹 Thunk: Pay Registration Fee
// ============================================
export const payRegistrationFee = createAsyncThunk(
  'auth/payRegistrationFee',
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const response = await axiosInstance.post(
        '/pay_registration_fee',
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data.user;
    } catch (err) {
      const errorMsg =
        err.response?.data?.error || err.response?.data?.message || 'Payment failed';
      return rejectWithValue(errorMsg);
    }
  }
);

// ============================================
// 🔹 Initial State
// ============================================
const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  successMessage: null,
};

// ============================================
// 🔹 Slice Definition
// ============================================
const authSlice = createSlice(
{
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      AsyncStorage.setItem('token', token);
      AsyncStorage.setItem('data', JSON.stringify(user));
    },

    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      AsyncStorage.removeItem('token');
      AsyncStorage.removeItem('data');
    },

    rehydrate: (state, action) => {
      const { token, user } = action.payload;
      if (token && user) {
        state.token = token;
        state.user = user;
        state.isAuthenticated = true;
      } else {
        state.token = null;
        state.user = null;
        state.isAuthenticated = false;
      }
    },

    clearMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(payRegistrationFee.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(payRegistrationFee.fulfilled, (state, action) => {
        state.loading = false;
        state.user = { ...state.user, ...action.payload };
        state.successMessage = 'Registration fee paid successfully.';
        AsyncStorage.setItem('data', JSON.stringify(state.user));
      })
      .addCase(payRegistrationFee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setAuth, logout, rehydrate, clearMessages } = authSlice.actions;
export default authSlice.reducer;
