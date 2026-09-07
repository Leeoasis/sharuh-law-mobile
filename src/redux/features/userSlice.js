import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosInstance from '../../api/axiosInstance';

const message = (error) =>
  error.response?.data?.error || error.response?.data?.message || error.message;

export const fetchLawyers = createAsyncThunk('user/fetchLawyers', async (criteria = {}) => {
  const response = await axiosInstance.get('/api/lawyers', { params: criteria });
  return response.data;
});

export const fetchClients = createAsyncThunk('user/fetchClients', async ({ lawyer_id } = {}) => {
  const url = lawyer_id ? `/api/lawyer/${lawyer_id}/clients` : '/api/clients';
  const response = await axiosInstance.get(url);
  return response.data;
});

export const fetchProfile = createAsyncThunk('user/fetchProfile', async ({ role, id }) => {
  const response = await axiosInstance.get(`/api/user/profile/${role}/${id}`);
  return response.data;
});

export const updateProfile = createAsyncThunk(
  'user/updateProfile',
  async ({ id, profileData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/api/user/${id}`, profileData);
      await AsyncStorage.setItem('data', JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      return rejectWithValue(message(error));
    }
  },
);

export const fetchNotifications = createAsyncThunk('user/fetchNotifications', async (userId) => {
  const response = await axiosInstance.get(`/api/notifications/${userId}`);
  return response.data;
});

export const approveLawyer = createAsyncThunk(
  'user/approveLawyer',
  async (lawyerId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/api/users/${lawyerId}/approve`);
      return response.data;
    } catch (error) {
      return rejectWithValue(message(error));
    }
  },
);

const initialState = {
  lawyers: [],
  clients: [],
  profile: {},
  notifications: [],
  loading: false,
  error: null,
  successMessage: '',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearSuccessMessage: (state) => { state.successMessage = ''; },
    receiveNotification: (state, action) => {
      state.notifications = [action.payload, ...state.notifications];
    },
    resetUser: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLawyers.fulfilled, (state, action) => { state.lawyers = action.payload; })
      .addCase(fetchClients.fulfilled, (state, action) => { state.clients = action.payload; })
      .addCase(fetchProfile.fulfilled, (state, action) => { state.profile = action.payload; })
      .addCase(fetchNotifications.fulfilled, (state, action) => { state.notifications = action.payload; })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
        state.successMessage = 'Profile updated successfully';
      })
      .addCase(approveLawyer.fulfilled, (state, action) => {
        const approvedId = action.payload.user_id;
        state.lawyers = state.lawyers.map((lawyer) =>
          lawyer.id === approvedId ? { ...lawyer, approved: true } : lawyer,
        );
        state.successMessage = action.payload.message || 'Lawyer approved';
      })
      .addMatcher(
        (action) => action.type.startsWith('user/') && action.type.endsWith('/pending'),
        (state) => { state.loading = true; state.error = null; },
      )
      .addMatcher(
        (action) => action.type.startsWith('user/') && action.type.endsWith('/rejected'),
        (state, action) => { state.loading = false; state.error = action.payload || action.error.message; },
      )
      .addMatcher(
        (action) => action.type.startsWith('user/') && action.type.endsWith('/fulfilled'),
        (state) => { state.loading = false; },
      );
  },
});

export const { clearSuccessMessage, receiveNotification, resetUser } = userSlice.actions;
export default userSlice.reducer;
