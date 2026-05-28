import { logout as logoutAction } from '../auth/authSlice';
import axiosInstance from '../../api/axiosInstance';

export const logout = () => async (dispatch) => {
  try {
    await axiosInstance.post('/logout');
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    dispatch(logoutAction());
  }
};

export default logout;
