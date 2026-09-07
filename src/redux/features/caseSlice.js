import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosInstance';

const reject = (error, rejectWithValue) =>
  rejectWithValue(error.response?.data?.error || error.response?.data?.message || error.message);

export const createCase = createAsyncThunk('case/create', async ({ userId, caseData }, { rejectWithValue }) => {
  try { return (await axiosInstance.post(`/users/${userId}/cases`, { case: caseData })).data; }
  catch (error) { return reject(error, rejectWithValue); }
});
export const fetchCases = createAsyncThunk('case/fetch', async (userId, { rejectWithValue }) => {
  try { return (await axiosInstance.get(`/users/${userId}/cases`)).data; }
  catch (error) { return reject(error, rejectWithValue); }
});
export const updateCase = createAsyncThunk('case/update', async ({ userId, caseId, caseData }, { rejectWithValue }) => {
  try { return (await axiosInstance.put(`/users/${userId}/cases/${caseId}`, { case: caseData })).data; }
  catch (error) { return reject(error, rejectWithValue); }
});
export const deleteCase = createAsyncThunk('case/delete', async ({ userId, caseId }, { rejectWithValue }) => {
  try { await axiosInstance.delete(`/users/${userId}/cases/${caseId}`); return caseId; }
  catch (error) { return reject(error, rejectWithValue); }
});
export const fetchAvailableCases = createAsyncThunk('case/available', async (lawyerId, { rejectWithValue }) => {
  try { return (await axiosInstance.get(`/api/lawyer/${lawyerId}/available_cases`)).data; }
  catch (error) { return reject(error, rejectWithValue); }
});
export const acceptCase = createAsyncThunk('case/accept', async (payload, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post(`/cases/${payload.caseId}/accept`, {
      lawyer_id: payload.lawyerId,
      platform_fee_method: payload.platform_fee_method,
    });
    return response.data.case;
  } catch (error) { return reject(error, rejectWithValue); }
});
export const fetchAdminCases = createAsyncThunk('case/admin', async (adminId, { rejectWithValue }) => {
  try { return (await axiosInstance.get('/admin-cases', { params: { user_id: adminId } })).data; }
  catch (error) { return reject(error, rejectWithValue); }
});
export const unassignCase = createAsyncThunk('case/unassign', async ({ caseId, adminId }, { rejectWithValue }) => {
  try { return (await axiosInstance.put(`/cases/${caseId}/unassign`, null, { params: { user_id: adminId } })).data; }
  catch (error) { return reject(error, rejectWithValue); }
});

const initialState = { cases: [], availableCases: [], loading: false, error: null };
const caseSlice = createSlice({
  name: 'case', initialState,
  reducers: { resetCases: () => initialState },
  extraReducers: (builder) => builder
    .addCase(fetchCases.fulfilled, (state, action) => { state.cases = action.payload; })
    .addCase(fetchAdminCases.fulfilled, (state, action) => { state.cases = action.payload; })
    .addCase(fetchAvailableCases.fulfilled, (state, action) => { state.availableCases = action.payload; })
    .addCase(createCase.fulfilled, (state, action) => { state.cases.push(action.payload); })
    .addCase(updateCase.fulfilled, (state, action) => {
      const index = state.cases.findIndex((item) => item.id === action.payload.id);
      if (index >= 0) state.cases[index] = action.payload;
    })
    .addCase(deleteCase.fulfilled, (state, action) => {
      state.cases = state.cases.filter((item) => item.id !== action.payload);
    })
    .addCase(acceptCase.fulfilled, (state, action) => {
      state.availableCases = state.availableCases.filter((item) => item.id !== action.payload.id);
      state.cases.push(action.payload);
    })
    .addCase(unassignCase.fulfilled, (state, action) => {
      const index = state.cases.findIndex((item) => item.id === action.payload.id);
      if (index >= 0) state.cases[index] = action.payload;
    })
    .addMatcher(
      (action) => action.type.startsWith('case/') && action.type.endsWith('/pending'),
      (state) => { state.loading = true; state.error = null; },
    )
    .addMatcher(
      (action) => action.type.startsWith('case/') && action.type.endsWith('/rejected'),
      (state, action) => { state.loading = false; state.error = action.payload || action.error.message; },
    )
    .addMatcher(
      (action) => action.type.startsWith('case/') && action.type.endsWith('/fulfilled'),
      (state) => { state.loading = false; },
    ),
});
export const { resetCases } = caseSlice.actions;
export default caseSlice.reducer;
