import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosInstance';
import { setAuth } from './authSlice';

export const fetchlogin = createAsyncThunk(
  'login/fetchlogin',
  async (credentials, { dispatch, rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/login', { user: credentials });
      const user = response.data?.user || null;
      const token =
        response.data?.token ||
        response.headers?.authorization ||
        response.headers?.Authorization ||
        null;

      dispatch(setAuth({ user, token }));
      return user;
    } catch (err) {
      if (!err.response) {
        return rejectWithValue(
          `Could not reach the backend at ${axiosInstance.defaults.baseURL}. Make sure Rails is running on port 3001 and bound to 0.0.0.0.`
        );
      }

      return rejectWithValue(
        err.response?.data?.error ||
        err.response?.data?.message ||
        'Invalid login credentials'
      );
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
