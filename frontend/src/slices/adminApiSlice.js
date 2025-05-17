import { apiSlice } from './apiSlice';

export const adminApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query({
      query: () => ({
        url: '/api/admin/dashboard',
        method: 'GET',
      }),
      keepUnusedDataFor: 5 * 60, // 5 minutes in seconds
    }),
    // Add user management endpoints
    getUsers: builder.query({
      query: () => ({
        url: '/api/users',
        method: 'GET',
      }),
      keepUnusedDataFor: 5,
    }),
    getUserDetails: builder.query({
      query: (id) => ({
        url: `/api/users/${id}`,
        method: 'GET',
      }),
      keepUnusedDataFor: 5,
    }),
    updateUser: builder.mutation({
      query: (data) => ({
        url: `/api/users/${data.id}`,
        method: 'PUT',
        body: data,
      }),
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/api/users/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetDashboardStatsQuery,
  useGetUsersQuery,
  useGetUserDetailsQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = adminApiSlice;
