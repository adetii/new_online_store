import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useGetMyOrdersQuery, useCancelOrderMutation } from '../slices/ordersApiSlice';
import Loader from '../components/layout/Loader';
import Message from '../components/layout/Message';
import { FaArrowLeft, FaEye, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';


const OrdersPage = () => {
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const [cancellingOrderId, setCancellingOrderId] = useState(null);

  // Redirect admin users to dashboard
  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      toast.error('Admin users cannot access the Orders');
      navigate('/admin/dashboard');
    }
  }, [userInfo, navigate]);




  // Redirect if not logged in
  useEffect(() => {
    if (!userInfo) {
      navigate('/login?redirect=/orders');
    }
  }, [userInfo, navigate]);

  const { data: orders, isLoading, error, refetch } = useGetMyOrdersQuery();

  // Correctly calling the cancel mutation hook
  const [cancelOrder, { isLoading: isCancelling }] = useCancelOrderMutation();

  // Format date to a readable format
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Handle order cancellation
  const handleCancelOrder = async (orderId) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      try {
        setCancellingOrderId(orderId);
        console.log('Cancelling order with ID:', orderId);
        // Pass the order ID directly
        const result = await cancelOrder(orderId).unwrap();
        toast.success(result.message || 'Order cancelled successfully');
        refetch(); // Refresh the orders list
      } catch (err) {
        toast.error(err?.data?.message || err.error || 'Failed to cancel order');
      } finally {
        setCancellingOrderId(null);
      }
    }
  };

  // Check if order can be cancelled (not paid, not delivered, and not already cancelled)
  const canCancelOrder = (order) => {
    return !order.isPaid && !order.isDelivered && order.status !== 'Cancelled';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Link to="/" className="mr-4 text-gray-600 hover:text-primary">
          <FaArrowLeft />
        </Link>
        <h1 className="text-2xl font-bold">My Orders</h1>
      </div>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="error">
          {error?.data?.message || error.error}
        </Message>
      ) : orders?.length === 0 ? (
        <div className="text-center py-8">
          <Message>
            You have no orders yet. <Link to="/" className="text-primary hover:underline">Start shopping</Link>
          </Message>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-md">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="py-3 px-4 text-left">ID</th>
                <th className="py-3 px-4 text-left">DATE</th>
                <th className="py-3 px-4 text-left">TOTAL</th>
                <th className="py-3 px-4 text-left">PAID</th>
                <th className="py-3 px-4 text-left">DELIVERED</th>
                <th className="py-3 px-4 text-left">STATUS</th>
                <th className="py-3 px-4 text-left">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm">{order._id}</td>
                  <td className="py-3 px-4 text-sm">{formatDate(order.createdAt)}</td>
                  <td className="py-3 px-4 text-sm">GH₵{order.totalPrice.toFixed(2)}</td>
                  <td className="py-3 px-4 text-sm">
                    {order.isPaid ? (
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                        {formatDate(order.paidAt)}
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
                        Not Paid
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-sm">
                    {order.isDelivered ? (
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                        {formatDate(order.deliveredAt)}
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      order.status === 'Cancelled'
                        ? 'bg-red-100 text-red-800'
                        : order.status === 'Delivered'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-blue-100 text-blue-800'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm">
                    <div className="flex items-center space-x-3">
                      <Link to={`/order/${order._id}`} className="flex items-center text-primary hover:text-primary-dark">
                        <FaEye className="mr-1" /> View
                      </Link>
                      {canCancelOrder(order) && (
                        <button
                          onClick={() => handleCancelOrder(order._id)}
                          disabled={isCancelling && cancellingOrderId === order._id}
                          className="flex items-center text-red-500 hover:text-red-700 disabled:opacity-50"
                        >
                          <FaTimes className="mr-1" /> 
                          {isCancelling && cancellingOrderId === order._id ? 'Cancelling...' : 'Cancel'}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
