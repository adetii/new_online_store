import { fetchBaseQuery, createApi } from '@reduxjs/toolkit/query/react';

const API_URL = process.env.REACT_APP_API_URL;  // e.g. https://my-backend.onrender.com

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NODE_ENV === 'production'
    ? API_URL            // calls go to https://<backend>/api/…
    : '',                // calls go to /api/… (CRA dev proxy)
  credentials: 'include',
});

export const apiSlice = createApi({
  baseQuery,
  tagTypes: ['Product', 'Order', 'User', 'Products'],
  endpoints: (builder) => ({}),
});
