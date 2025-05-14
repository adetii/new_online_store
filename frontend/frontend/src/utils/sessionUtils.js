import { logout } from '../slices/authSlice';
import store from '../store';

let sessionTimeoutId;
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes in milliseconds

// Function to reset the session timer
export const resetSessionTimer = () => {
  if (sessionTimeoutId) {
    clearTimeout(sessionTimeoutId);
  }
  
  sessionTimeoutId = setTimeout(() => {
    // Log the user out when session expires
    store.dispatch(logout());
    // Show alert or notification that session has expired
    alert('Your session has expired. Please log in again.');
  }, SESSION_TIMEOUT);
};

// Function to clear the session timer (used when logging out manually)
export const clearSessionTimer = () => {
  if (sessionTimeoutId) {
    clearTimeout(sessionTimeoutId);
  }
};

// Function to initialize session tracking
export const initSessionTracking = () => {
  // Reset timer on user activity
  const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
  
  events.forEach(event => {
    document.addEventListener(event, resetSessionTimer, false);
  });
  
  // End session when browser is closed
  window.addEventListener('beforeunload', () => {
    clearSessionTimer();
    // Clear user data from localStorage to ensure they're logged out on browser close
    localStorage.removeItem('userInfo');
  });
  
  // Initial setup of the timer
  resetSessionTimer();
};