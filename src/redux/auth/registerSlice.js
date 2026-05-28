import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosInstance';

export const fetchreg = createAsyncThunk(
  'sign_up/fetchreg',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/register', formData);
      return response.data.user;
    } catch (err) {
      console.error('Registration API Error:', err.response?.data || err.message);
      return rejectWithValue(err.response?.data || { message: err.message });
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
