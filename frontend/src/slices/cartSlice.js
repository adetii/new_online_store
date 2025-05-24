import { createSlice } from '@reduxjs/toolkit';

// Session management utilities
const getSessionId = () => {
  let sessionId = sessionStorage.getItem('sessionId');
  if (!sessionId) {
    sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    sessionStorage.setItem('sessionId', sessionId);
  }
  return sessionId;
};

const sessionId = getSessionId();

// Generate session-specific storage keys
const cartKey = `cartItems_${sessionId}`;
const shippingKey = `shippingAddress_${sessionId}`;
const paymentKey = `paymentMethod_${sessionId}`;

// Safe localStorage operations with error handling
const safeGetFromStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.warn(`Error reading from localStorage for key: ${key}`, error);
    return defaultValue;
  }
};

const safeSetToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`Error writing to localStorage for key: ${key}`, error);
  }
};

const safeRemoveFromStorage = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.warn(`Error removing from localStorage for key: ${key}`, error);
  }
};

const initialState = { 
  currentSessionId: sessionId,
  cartItems: safeGetFromStorage(cartKey, []), 
  shippingAddress: safeGetFromStorage(shippingKey, {}), 
  paymentMethod: safeGetFromStorage(paymentKey, ''), 
  totalItems: 0,
  totalPrice: 0,
}; 

// Calculate totals helper
const calculateTotals = (cartItems) => {
  const totalItems = cartItems.reduce((acc, item) => acc + (item.qty || 1), 0);
  const totalPrice = cartItems.reduce((acc, item) => 
    acc + ((item.price || 0) * (item.qty || 1)), 0
  );
  return { totalItems, totalPrice };
};

// Update initial state with calculated totals
const totals = calculateTotals(initialState.cartItems);
initialState.totalItems = totals.totalItems;
initialState.totalPrice = totals.totalPrice;

const cartSlice = createSlice({ 
  name: 'cart', 
  initialState, 
  reducers: { 
    // Switch to a different session/account
    switchSession: (state, action) => {
      const newSessionId = action.payload;
      
      // Update session ID in storage
      sessionStorage.setItem('sessionId', newSessionId);
      
      // Update keys for the new session
      const newCartKey = `cartItems_${newSessionId}`;
      const newShippingKey = `shippingAddress_${newSessionId}`;
      const newPaymentKey = `paymentMethod_${newSessionId}`;
      
      // Update state with new session data
      state.currentSessionId = newSessionId;
      state.cartItems = safeGetFromStorage(newCartKey, []);
      state.shippingAddress = safeGetFromStorage(newShippingKey, {});
      state.paymentMethod = safeGetFromStorage(newPaymentKey, '');
      
      // Update totals
      const totals = calculateTotals(state.cartItems);
      state.totalItems = totals.totalItems;
      state.totalPrice = totals.totalPrice;
    },
    
    addToCart: (state, action) => { 
      const item = action.payload; 
      
      const existItem = state.cartItems.find((x) => x._id === item._id); 
      
      if (existItem) { 
        state.cartItems = state.cartItems.map((x) => 
          x._id === existItem._id ? item : x 
        ); 
      } else { 
        state.cartItems = [...state.cartItems, item]; 
      } 
      
      // Update totals
      const totals = calculateTotals(state.cartItems);
      state.totalItems = totals.totalItems;
      state.totalPrice = totals.totalPrice;
      
      // Update localStorage with session-specific key
      safeSetToStorage(`cartItems_${state.currentSessionId}`, state.cartItems);
    }, 
    
    removeFromCart: (state, action) => { 
      state.cartItems = state.cartItems.filter((x) => x._id !== action.payload); 
      
      // Update totals
      const totals = calculateTotals(state.cartItems);
      state.totalItems = totals.totalItems;
      state.totalPrice = totals.totalPrice;
      
      // Update localStorage with session-specific key
      safeSetToStorage(`cartItems_${state.currentSessionId}`, state.cartItems);
    }, 
    
    resetCart: (state) => { 
      state.cartItems = []; 
      state.shippingAddress = {}; 
      state.paymentMethod = ''; 
      state.totalItems = 0;
      state.totalPrice = 0;
      
      // Remove session-specific data
      safeRemoveFromStorage(`cartItems_${state.currentSessionId}`);
      safeRemoveFromStorage(`shippingAddress_${state.currentSessionId}`);
      safeRemoveFromStorage(`paymentMethod_${state.currentSessionId}`);
    }, 
    
    clearCartItems: (state) => { 
      state.cartItems = []; 
      state.totalItems = 0;
      state.totalPrice = 0;
      
      // Remove session-specific cart items
      safeRemoveFromStorage(`cartItems_${state.currentSessionId}`);
    }, 
    
    saveShippingAddress: (state, action) => { 
      state.shippingAddress = action.payload; 
      
      // Update localStorage with session-specific key
      safeSetToStorage(`shippingAddress_${state.currentSessionId}`, action.payload);
    }, 
    
    savePaymentMethod: (state, action) => { 
      state.paymentMethod = action.payload; 
      
      // Update localStorage with session-specific key
      safeSetToStorage(`paymentMethod_${state.currentSessionId}`, action.payload);
    },
    
    // Clear all sessions data (useful for logout)
    clearAllSessions: (state) => {
      try {
        // Get all localStorage keys that match our pattern
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && (key.startsWith('cartItems_') || 
                     key.startsWith('shippingAddress_') || 
                     key.startsWith('paymentMethod_'))) {
            keysToRemove.push(key);
          }
        }
        
        // Remove all matching keys
        keysToRemove.forEach(key => safeRemoveFromStorage(key));
        
        // Reset state
        state.cartItems = [];
        state.shippingAddress = {};
        state.paymentMethod = '';
        state.totalItems = 0;
        state.totalPrice = 0;
        
        // Clear session storage
        sessionStorage.removeItem('sessionId');
        
      } catch (error) {
        console.warn('Error clearing all sessions:', error);
      }
    },
  }, 
}); 

export const { 
  addToCart, 
  removeFromCart, 
  clearCartItems, 
  saveShippingAddress, 
  savePaymentMethod, 
  resetCart,
  switchSession,
  clearAllSessions,
} = cartSlice.actions; 

export default cartSlice.reducer;
