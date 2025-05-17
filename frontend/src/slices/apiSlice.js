import { fetchBaseQuery, createApi } from '@reduxjs/toolkit/query/react';

// Get the API base URL from environment variables
const baseUrl = process.env.REACT_APP_API_BASE_URL || 'https://shopname.onrender.com';

// Create the base query with the environment variable
const baseQuery = fetchBaseQuery({
  baseUrl,
  credentials: 'include',
});

export const apiSlice = createApi({
  baseQuery,
  tagTypes: ['Product', 'Order', 'User', 'Products'],
  endpoints: (builder) => ({}),
});
