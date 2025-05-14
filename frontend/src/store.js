import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import cartReducer from './slices/cartSlice';
import authReducer from './slices/authSlice';
import { productsApiSlice } from './slices/productsApiSlice';
import { usersApiSlice } from './slices/usersApiSlice';
import { ordersApiSlice } from './slices/ordersApiSlice';
import { adminApiSlice } from './slices/adminApiSlice';

// Create a middleware array with unique middleware instances
const apiMiddleware = [
  productsApiSlice.middleware,
  usersApiSlice.middleware,
  ordersApiSlice.middleware,
  adminApiSlice.middleware,
];

// Remove duplicates by converting to Set and back to Array
const uniqueMiddleware = [...new Set(apiMiddleware)];

const store = configureStore({
  reducer: {
    cart: cartReducer,
    auth: authReducer,
    [productsApiSlice.reducerPath]: productsApiSlice.reducer,
    [usersApiSlice.reducerPath]: usersApiSlice.reducer,
    [ordersApiSlice.reducerPath]: ordersApiSlice.reducer,
    [adminApiSlice.reducerPath]: adminApiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(uniqueMiddleware),
  devTools: process.env.NODE_ENV !== 'production',
});

setupListeners(store.dispatch);

export default store;
