import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaEye, FaSearch, FaTruck, FaMoneyBillWave } from 'react-icons/fa';
import { toast } from 'react-toastify';
import {
  useGetOrdersQuery,
  useUpdateOrderToDeliveredMutation,
  usePayOrderMutation,
} from '../../slices/ordersApiSlice';
import Loader from '../../components/layout/Loader';
import Message from '../../components/layout/Message';

const AdminOrderListPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [allOrders, setAllOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get first page of orders
  const { data: page1Data, isLoading: isPage1Loading, error: page1Error } = useGetOrdersQuery({
    pageNumber: 1,
  });

  // Get second page of orders
  const { data: page2Data, isLoading: isPage2Loading, error: page2Error } = useGetOrdersQuery({
    pageNumber: 2,
  });

  // Get third page of orders
  const { data: page3Data, isLoading: isPage3Loading, error: page3Error } = useGetOrdersQuery({
    pageNumber: 3,
  });

  // Combine all pages of orders
  useEffect(() => {
    if (page1Data && page2Data && page3Data) {
      const combinedOrders = [
        ...(page1Data.orders || []),
        ...(page2Data.orders || []),
        ...(page3Data.orders || []),
      ];
      setAllOrders(combinedOrders);
      setLoading(false);
    }
  }, [page1Data, page2Data, page3Data]);

  const totalOrders = page1Data?.totalOrders || 0;

  const [updateOrderToDelivered, { isLoading: isUpdatingDelivered }] =
    useUpdateOrderToDeliveredMutation();
  const [payOrder, { isLoading: isUpdatingPaid }] = usePayOrderMutation();

  // Client-side filter - only for search, no status filtering
  const filteredOrders = allOrders.filter((order) => {
    return searchTerm === '' || // If search term is empty, don't filter by search
      order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.user?.name || '').toLowerCase().includes(searchTerm.toLowerCase());
  });

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const deliverHandler = async (orderId) => {
    try {
      await updateOrderToDelivered(orderId).unwrap();
      toast.success('Order marked as delivered');
      // Refetch all pages
      refetchAllPages();
    } catch (err) {
      toast.error(err?.data?.message || err.error || 'Failed to update order');
    }
  };

  const paidHandler = async (orderId) => {
    try {
      await payOrder({
        orderId,
        paymentResult: {
          id: `admin-payment-${Date.now()}`,
          status: 'success',
          update_time: new Date().toISOString(),
          email_address: 'admin@example.com',
          payer: { email_address: 'admin@example.com' },
        },
      }).unwrap();
      toast.success('Order marked as paid');
      // Refetch all pages
      refetchAllPages();
    } catch (err) {
      toast.error(
        err?.data?.message || err.error || 'Failed to update payment status'
      );
    }
  };

  // Function to refetch all pages
  const refetchAllPages = () => {
    if (page1Data?.refetch) page1Data.refetch();
    if (page2Data?.refetch) page2Data.refetch();
    if (page3Data?.refetch) page3Data.refetch();
  };

  // Check if any page is loading or has an error
  const isLoading = isPage1Loading || isPage2Loading || isPage3Loading || loading;
  const error = page1Error || page2Error || page3Error;

  return (
    <div className="admin-order-list">
      <h1 className="text-2xl font-bold mb-6">Orders</h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        {/* Search only - removed status filter */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Search orders or customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">
            {error?.data?.message || error.error || 'An error occurred'}
          </Message>
        ) : filteredOrders.length === 0 ? (
          <Message>No orders found</Message>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paid</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Delivered</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order._id.substring(0, 8)}...
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {order.user?.name || 'User deleted'}
                        </div>
                        {order.user && (
                          <div className="text-xs text-gray-500">
                            {order.user.email}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        GH₵{order.totalPrice.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {order.isPaid ? (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            {formatDate(order.paidAt)}
                          </span>
                        ) : (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                            Not Paid
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {order.isDelivered ? (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            {formatDate(order.deliveredAt)}
                          </span>
                        ) : (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                            Not Delivered
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            order.status === 'Delivered'
                              ? 'bg-green-100 text-green-800'
                              : order.status === 'Cancelled'
                              ? 'bg-red-100 text-red-800'
                              : order.status === 'Processing'
                              ? 'bg-blue-100 text-blue-800'
                              : order.status === 'Confirmed'
                              ? 'bg-indigo-100 text-indigo-800'
                              : order.status === 'Shipped'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <Link
                            to={`/admin/order/${order._id}`}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            <FaEye className="text-lg" />
                          </Link>
                          {!order.isDelivered && order.isPaid && order.status !== 'Cancelled' && (
                            <button
                              onClick={() => deliverHandler(order._id)}
                              className="text-green-600 hover:text-green-900"
                              disabled={isUpdatingDelivered}
                            >
                              <FaTruck className="text-lg" />
                            </button>
                          )}
                          {!order.isPaid &&
                            order.paymentMethod === 'CashOnDelivery' && 
                            order.status !== 'Cancelled' && (
                              <button
                                onClick={() => paidHandler(order._id)}
                                className="text-yellow-600 hover:text-yellow-900"
                                disabled={isUpdatingPaid}
                              >
                                <FaMoneyBillWave className="text-lg" />
                              </button>
                            )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Order count summary */}
            <div className="mt-6 flex justify-end">
              <div className="text-sm text-gray-500">
                Showing {filteredOrders.length} of {totalOrders} orders
                {searchTerm && ` (filtered by "${searchTerm}")`}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminOrderListPage;
