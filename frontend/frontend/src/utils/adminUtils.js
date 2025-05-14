import { toast } from 'react-toastify';
import { clearCartItems } from '../slices/cartSlice';
import { logout } from '../slices/authSlice';
// Change this import:
import store from '../store';

/**
 * Clears shopping data when an admin user tries to access customer features
 */
export const clearShoppingDataForAdmin = () => {
  // Clear cart items
  store.dispatch(clearCartItems());
  
  // Clear any other shopping-related data if needed
  // For example, you might want to clear wishlist data as well
};

/**
 * Checks if the user is an admin and shows a notification if they are
 * @param {Object} userInfo - The user information object
 * @param {Function} navigate - The navigate function from useNavigate
 * @param {String} action - The action the admin was trying to perform
 * @returns {Boolean} - True if the user is an admin, false otherwise
 */
export const checkAdminAndNotify = (userInfo, navigate, action = 'access this page') => {
  if (userInfo?.isAdmin) {
    toast.error(`Admin users cannot ${action}`);
    navigate('/admin/dashboard');
    return true;
  }
  return false;
};

/**
 * Creates a custom product view component for admin users
 * This will be used to replace the regular product view with one that doesn't have cart/wishlist
 */