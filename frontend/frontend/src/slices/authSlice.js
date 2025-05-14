import { createSlice } from '@reduxjs/toolkit';
import { showSuccessToast, showErrorToast } from '../utils/toastUtils';

const initialState = {
  userInfo: localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.userInfo = action.payload;
      localStorage.setItem('userInfo', JSON.stringify(action.payload));
    },
    logout: (state, action) => {
      state.userInfo = null;
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
    localStorage.removeItem('userInfo');
    dispatch(logout());
  } catch (error) {
    showErrorToast('Error during logout. Please try again.');
  }
};

export default authSlice.reducer;