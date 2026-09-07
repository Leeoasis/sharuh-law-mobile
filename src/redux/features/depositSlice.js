import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosInstance';

export const updateFnbCollectionPlan = createAsyncThunk(
  'deposit/updateFnbCollectionPlan',
  async (plan, { rejectWithValue }) => {
    try {
      return (await axiosInstance.post('/payments/fnb_collection_plan', {
        payment: { fnb_referral_plan: plan },
      })).data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  },
);

/*
export const startDepositCheckout = createAsyncThunk(
  'deposit/checkout',
  async (amountCents, { rejectWithValue }) => {
    try {
      return (await axiosInstance.post('/pay_deposit/peach/checkout', {
        payment: {
          amount_cents: amountCents,
          return_target: Platform.OS === 'web' ? 'web' : 'mobile',
        },
      })).data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  },
);
*/

const depositSlice = createSlice({
  name: 'deposit',
  initialState: { collectionPlan: null, loading: false, error: null },
  reducers: { setCollectionPlan: (state, action) => { state.collectionPlan = action.payload || null; } },
  extraReducers: (builder) => builder
    .addCase(updateFnbCollectionPlan.pending, (state) => { state.loading = true; state.error = null; })
    .addCase(updateFnbCollectionPlan.fulfilled, (state, action) => {
      state.loading = false;
      state.collectionPlan = action.payload?.fnb_referral_plan || action.payload?.collection_plan || null;
    })
    .addCase(updateFnbCollectionPlan.rejected, (state, action) => {
      state.loading = false; state.error = action.payload || action.error.message;
    }),
});
export const { setCollectionPlan } = depositSlice.actions;
export default depositSlice.reducer;
