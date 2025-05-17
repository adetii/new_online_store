import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import cartReducer from './slices/cartSlice';
import authReducer from './slices/authSlice';
import { productsApiSlice } from './slices/productsApiSlice';
import { usersApiSlice } from './slices/usersApiSlice';
import { ordersApiSlice } from './slices/ordersApiSlice';
import { adminApiSlice } from './slices/adminApiSlice';

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
    getDefaultMiddleware()
      .concat(productsApiSlice.middleware)
      .concat(usersApiSlice.middleware)
      .concat(ordersApiSlice.middleware)
      .concat(adminApiSlice.middleware),
  devTools: process.env.NODE_ENV !== 'production',
});

// optional, but required for refetchOnFocus/refetchOnReconnect behaviors
setupListeners(store.dispatch);

export default store;