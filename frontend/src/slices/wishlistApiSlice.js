import { apiSlice } from './apiSlice';

export const wishlistApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getWishlist: builder.query({
      query: () => '/api/users/wishlist',        // <-- Note the /users/ prefix
      providesTags: ['Wishlist'],
      keepUnusedDataFor: 5,
    }),
    addToWishlist: builder.mutation({
      query: (productId) => ({
        url: '/api/users/wishlist',               // <-- same here
        method: 'POST',
        body: { productId },
      }),
      invalidatesTags: ['Wishlist'],
    }),
    removeFromWishlist: builder.mutation({
      query: (productId) => ({
        url: `/api/users/wishlist/${productId}`,   // <-- and here
        method: 'DELETE',
      }),
      invalidatesTags: ['Wishlist'],
    }),
  }),
});

export const {
  useGetWishlistQuery,
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
} = wishlistApiSlice;
