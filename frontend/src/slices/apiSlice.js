import { fetchBaseQuery, createApi } from '@reduxjs/toolkit/query/react';

// Use environment variables to handle different environments
const baseUrl = process.env.NODE_ENV === 'production'
  ? '/api' // In production, prepend "/api" so requests go to `https://shopname.onrender.com/api/…`
  : '';    // In development, leave it empty so fetch('/api/…') proxies to your local server

const baseQuery = fetchBaseQuery({
  baseUrl,
  credentials: 'include',  // send cookies (e.g. for auth) on same‑origin/API calls
});

export const apiSlice = createApi({
  baseQuery,
  tagTypes: ['Product', 'Order', 'User', 'Products'],
  endpoints: (builder) => ({}),
});
