import { apiSlice } from './apiSlice';

const ORDERS_URL = 'https://shopname.onrender.com/api/orders';

export const ordersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // In your ordersApiSlice.js file
    getOrders: builder.query({
      query: ({ pageNumber } = {}) => ({
        url: ORDERS_URL,
        params: { pageNumber },
      }),
      keepUnusedDataFor: 5,
      providesTags: ['Orders'],
    }),
    createOrder: builder.mutation({
      query: (order) => ({
        url: ORDERS_URL,
        method: 'POST',
        body: order,
      }),
    }),
    getOrderDetails: builder.query({
      query: (orderId) => ({
        url: `${ORDERS_URL}/${orderId}`,
      }),
      keepUnusedDataFor: 5,
    }),
    getMyOrders: builder.query({
      query: () => ({
        url: `${ORDERS_URL}/myorders`,
      }),
      keepUnusedDataFor: 5,
    }),
    payOrder: builder.mutation({
      query: ({ orderId, paymentResult }) => ({
        url: `${ORDERS_URL}/${orderId}/pay`,
        method: 'PUT',
        body: paymentResult,
      }),
    }),
    verifyPaystackPayment: builder.mutation({
      query: ({ reference, orderId }) => ({
        url: `${ORDERS_URL}/${orderId}/verify-paystack`,
        method: 'POST',
        body: { reference },
      }),
    }),
    // Added cancelOrder mutation endpoint
    cancelOrder: builder.mutation({
      query: (orderId) => ({
        url: `${ORDERS_URL}/${orderId}/cancel`,
        method: 'PUT',
      }),
    }),
    updateOrderToDelivered: builder.mutation({
      query: (orderId) => ({
        url: `${ORDERS_URL}/${orderId}/deliver`,
        method: 'PUT',
      }),
      invalidatesTags: ['Order'],
    }),
    // Add this new mutation for updating order status
    updateOrderStatus: builder.mutation({
      query: ({ orderId, status }) => ({
        url: `${ORDERS_URL}/${orderId}/status`,
        method: 'PUT',
        body: { status },
      }),
      invalidatesTags: ['Orders', 'Order'],
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetOrderDetailsQuery,
  usePayOrderMutation,
  useGetMyOrdersQuery,
  useGetOrdersQuery,
  useVerifyPaystackPaymentMutation,
  useCancelOrderMutation,
  useUpdateOrderToDeliveredMutation,
  useUpdateOrderStatusMutation, // Add this export
} = ordersApiSlice;
