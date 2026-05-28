import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosInstance';
import { setAuth } from './authSlice';

export const fetchlogin = createAsyncThunk(
  'login/fetchlogin',
  async (credentials, { dispatch, rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/login', credentials);
      const { user, token } = response.data;
      
      dispatch(setAuth({ user, token }));
      return user;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Login failed');
    }
  }
);

const loginSlice = createSlice({
  name: 'login',
  initialState: {
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchlogin.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchlogin.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(fetchlogin.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default loginSlice.reducer;
