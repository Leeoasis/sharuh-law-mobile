import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosInstance';
import { setAuth } from './authSlice';

export const fetchreg = createAsyncThunk(
  'sign_up/fetchreg',
  async (formData, { dispatch, rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/signup', formData, {
        timeout: 180000,
      });
      const { user, token } = response.data;
      if (user && token) dispatch(setAuth({ user, token }));
      return user;
    } catch (err) {
      const responseData = err.response?.data;
      const message =
        responseData?.message ||
        responseData?.error ||
        (Array.isArray(responseData?.errors) ? responseData.errors.join(', ') : null) ||
        err.message;

      console.error('Registration API Error:', responseData || err.message);
      return rejectWithValue(responseData || { message });
    }
  }
);

const registerSlice = createSlice({
  name: 'sign_up',
  initialState: {
    isLoading: false,
    serverErrors: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchreg.pending, (state) => {
        state.isLoading = true;
        state.serverErrors = null;
      })
      .addCase(fetchreg.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(fetchreg.rejected, (state, action) => {
        state.isLoading = false;
        state.serverErrors = action.payload;
      });
  },
});

export default registerSlice.reducer;
