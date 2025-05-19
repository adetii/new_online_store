import { createSlice } from '@reduxjs/toolkit';
import { showSuccessToast, showErrorToast } from '../utils/toastUtils';

const initialState = {
  token: localStorage.getItem('token') || null,
  userInfo: localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { token, ...user } = action.payload;
      state.token = token;
      state.userInfo = user;
      localStorage.setItem('token', token);
      localStorage.setItem('userInfo', JSON.stringify(user));
    },
    logout: (state, action) => {
      state.token = null;
      state.userInfo = null;
      localStorage.removeItem('token');
      localStorage.removeItem('userInfo');
      localStorage.removeItem('cart');
      showSuccessToast('Logged out successfully');
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;

// Create a thunk action to handle logout with cart reset
export const logoutAndResetCart = () => (dispatch) => {
  try {
    dispatch(logout());
  } catch (error) {
    showErrorToast('Error during logout. Please try again.');
  }
};

export default authSlice.reducer;
