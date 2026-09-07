import { logout as logoutAction } from '../auth/authSlice';
import axiosInstance from '../../api/axiosInstance';
import { resetUser } from '../features/userSlice';
import { resetCases } from '../features/caseSlice';

export const logout = () => async (dispatch) => {
  try {
    await axiosInstance.delete('/logout');
  } catch (error) {
    console.warn('Logout request failed:', error.response?.data?.message || error.response?.data?.error || error.message);
  } finally {
    dispatch(logoutAction());
    dispatch(resetUser());
    dispatch(resetCases());
  }
};

export default logout;
