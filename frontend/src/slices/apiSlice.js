import { fetchBaseQuery, createApi } from '@reduxjs/toolkit/query/react';

// Update the baseQuery to use the correct configuration
const baseQuery = fetchBaseQuery({
  baseUrl: 'https://online-shop-backend-a3s6.onrender.com',  // Empty string to use relative URLs with the proxy
  credentials: 'include',
});

export const apiSlice = createApi({
  baseQuery,
  tagTypes: ['Product', 'Order', 'User', 'Products'],
  endpoints: (builder) => ({}),
});