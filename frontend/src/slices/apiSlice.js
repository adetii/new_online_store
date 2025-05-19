import { fetchBaseQuery, createApi } from '@reduxjs/toolkit/query/react';

// Base URL from environment
const API_URL = process.env.REACT_APP_API_URL;  // e.g. https://my-backend.onrender.com

const baseApiUrl = API_URL || window.location.origin;

const baseQuery = fetchBaseQuery({
  baseUrl:
    process.env.NODE_ENV === 'production'
      ? API_URL  // in prod, calls go to https://<backend>/api/…
      : '',      // in dev, calls go to /api/… (CRA proxy)
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

export const apiSlice = createApi({
  baseQuery,
  tagTypes: ['Product', 'Order', 'User', 'Products', 'Wishlist'],
  endpoints: (builder) => ({}),
});
