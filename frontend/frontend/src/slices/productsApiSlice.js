import { apiSlice } from './apiSlice';

const PRODUCTS_URL = '/api/products';

export const productsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: ({ keyword = '', pageNumber = 1, category = '' }) => {
        return {
          url: '/api/products',
          params: { 
            keyword, 
            pageNumber, 
            category 
          },
        };
      },
      keepUnusedDataFor: 5,
      providesTags: ['Products'],
    }),
    getProductDetails: builder.query({
      // Fix this endpoint to include /api prefix
      query: (productId) => ({
        url: `/api/products/${productId}`,
      }),
      keepUnusedDataFor: 5,
    }),
    createReview: builder.mutation({
      // Fix this endpoint to include /api prefix
      query: (data) => ({
        url: `/api/products/${data.productId}/reviews`,
        method: 'POST',
        body: data,
      }),
    }),
    // Fix all other endpoints to include /api prefix
    createQuestion: builder.mutation({
      query: (data) => ({
        url: `/api/products/${data.productId}/questions`,
        method: 'POST',
        body: data,
      }),
    }),
    // In the updateProduct mutation
    updateProduct: builder.mutation({
      query: (data) => {
        // Extract productId from data
        const { productId, ...productData } = data;
        
        // Make sure we're using the correct ID in the URL
        return {
          url: `${PRODUCTS_URL}/${productId}`,
          method: 'PUT',
          body: productData,
        };
      },
      invalidatesTags: ['Products'],
    }),
    // Add a new endpoint for low stock products
    getLowStockProducts: builder.query({
      query: () => ({
        url: `${PRODUCTS_URL}/low-stock`,
      }),
      keepUnusedDataFor: 5,
    }),
    uploadProductImage: builder.mutation({
      query: (data) => ({
        url: '/api/products/upload',
        method: 'POST',
        body: data,
      }),
    }),
    deleteProduct: builder.mutation({
      query: (productId) => ({
        url: `${PRODUCTS_URL}/${productId.trim()}`,
        method: 'DELETE',
        credentials: 'include',
      }),
      invalidatesTags: ['Products'],
    }),
    // Add this new endpoint
    // Make sure your createProduct mutation is properly defined
    createProduct: builder.mutation({
      query: (productData) => ({
        url: PRODUCTS_URL,
        method: 'POST',
        body: productData,
      }),
      invalidatesTags: ['Products'],
    }),
    // Add this endpoint for admin dashboard
    // Rename this endpoint to avoid conflict
    getAllProductsAdmin: builder.query({
      query: () => ({
        url: `/api/products`,
      }),
      providesTags: ['Products'],
      keepUnusedDataFor: 5,
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductDetailsQuery,
  useCreateReviewMutation,
  useCreateQuestionMutation,
  useUpdateProductMutation,
  useUploadProductImageMutation,
  useDeleteProductMutation,
  useCreateProductMutation,
  useGetAllProductsAdminQuery, // Export the renamed hook
  useGetLowStockProductsQuery,
} = productsApiSlice;