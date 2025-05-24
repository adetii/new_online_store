import { createSlice } from '@reduxjs/toolkit'; 
import { showSuccessToast, showErrorToast } from '../utils/toastUtils'; 

// Generate a unique session ID for each tab/window
const generateSessionId = () => {
  return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
};

// Get or create session ID for this tab
const getSessionId = () => {
  let sessionId = sessionStorage.getItem('sessionId');
  if (!sessionId) {
    sessionId = generateSessionId();
    sessionStorage.setItem('sessionId', sessionId);
  }
  return sessionId;
};

const sessionId = getSessionId();
const userInfoKey = `userInfo_${sessionId}`;
const tokenKey = `token_${sessionId}`;

const initialState = { 
  token: localStorage.getItem(tokenKey) || null, 
  userInfo: localStorage.getItem(userInfoKey) 
    ? JSON.parse(localStorage.getItem(userInfoKey)) 
    : null,
  sessionId: sessionId,
}; 

const authSlice = createSlice({ 
  name: 'auth', 
  initialState, 
  reducers: { 
    setCredentials: (state, action) => { 
      const { token, ...user } = action.payload; 
      state.token = token; 
      state.userInfo = user; 
      localStorage.setItem(tokenKey, token); 
      localStorage.setItem(userInfoKey, JSON.stringify(user)); 
    }, 
    logout: (state, action) => { 
      state.token = null; 
      state.userInfo = null; 
      localStorage.removeItem(tokenKey); 
      localStorage.removeItem(userInfoKey); 
      localStorage.removeItem(`cart_${sessionId}`); 
      
      // Clear session ID from sessionStorage
      sessionStorage.removeItem('sessionId');
      
      showSuccessToast('Logged out successfully'); 
    }, 
  }, 
}); 

export const { setCredentials, logout } = authSlice.actions; 

// Create a thunk action to handle logout with cart reset 
export const logoutAndResetCart = () => (dispatch, getState) => { 
  try { 
    const state = getState();
    const currentSessionId = state.auth.sessionId;
    
    // Remove session-specific data
    localStorage.removeItem(`userInfo_${currentSessionId}`);
    localStorage.removeItem(`token_${currentSessionId}`);
    localStorage.removeItem(`cart_${currentSessionId}`);
    
    dispatch(logout()); 
  } catch (error) { 
    showErrorToast('Error during logout. Please try again.'); 
  } 
}; 

export default authSlice.reducer;
