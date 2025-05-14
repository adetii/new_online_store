import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Row, Col, ListGroup, Image, Card, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { FaArrowLeft, FaTruck, FaMoneyBillWave, FaUser, FaEnvelope, FaMapMarkerAlt, FaPhone, FaCalendarAlt, FaBox, FaShippingFast, FaMoneyBill } from 'react-icons/fa';
import {
  useGetOrderDetailsQuery,
  useUpdateOrderToDeliveredMutation,
  usePayOrderMutation,
  useUpdateOrderStatusMutation,
} from '../../slices/ordersApiSlice';
import Message from '../../components/layout/Message';
import Loader from '../../components/layout/Loader';

const AdminOrderPage = () => {
  const { id: orderId } = useParams();
  const [selectedStatus, setSelectedStatus] = useState('');

  const {
    data: order,
    refetch,
    isLoading,
    error,
  } = useGetOrderDetailsQuery(orderId);

  const [updateOrderToDelivered, { isLoading: loadingDeliver }] =
    useUpdateOrderToDeliveredMutation();

  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();

  const [updateOrderStatus, { isLoading: loadingStatusUpdate }] =
    useUpdateOrderStatusMutation();

  const deliverHandler = async () => {
    try {
      await updateOrderToDelivered(orderId).unwrap();
      refetch();
      toast.success('Order marked as delivered');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const payHandler = async () => {
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
      refetch();
      toast.success('Order marked as paid');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const updateStatusHandler = async () => {
    if (!selectedStatus) {
      toast.error('Please select a status');
      return;
    }

    try {
      await updateOrderStatus({
        orderId,
        status: selectedStatus,
      }).unwrap();
      refetch();
      toast.success(`Order status updated to ${selectedStatus}`);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error?.data?.message || error.error}</Message>
      ) : (
        <div className="bg-gray-50 min-h-screen p-2 sm:p-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center mb-4 sm:mb-6">
              <Link 
                to="/admin/orders" 
                className="flex items-center text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                <FaArrowLeft className="mr-2" /> 
                <span>Back to Orders</span>
              </Link>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-3 sm:p-6 mb-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 sm:mb-6">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 md:mb-0">
                  Order #{order._id.substring(0, 8)}...
                </h1>
                <div className="mt-1 md:mt-0">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
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
                  }`}>
                    {order.status || 'Pending'}
                  </span>
                </div>
              </div>
              
              <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
                <div className="w-full lg:w-2/3">
                  {/* Customer Information */}
                  <div className="bg-gray-50 rounded-lg p-3 sm:p-5 mb-4 sm:mb-6">
                    <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-800 flex items-center">
                      <FaUser className="mr-2 text-indigo-600" /> Customer Information
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <div className="flex items-start mb-3">
                          <FaUser className="mt-1 mr-2 text-gray-500" />
                          <div>
                            <p className="text-sm text-gray-500">Name</p>
                            <p className="font-medium">{order.user.name}</p>
                          </div>
                        </div>
                        <div className="flex items-start mb-3">
                          <FaEnvelope className="mt-1 mr-2 text-gray-500" />
                          <div>
                            <p className="text-sm text-gray-500">Email</p>
                            <a href={`mailto:${order.user.email}`} className="font-medium text-indigo-600 hover:text-indigo-800 break-all">
                              {order.user.email}
                            </a>
                          </div>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-start mb-3">
                          <FaCalendarAlt className="mt-1 mr-2 text-gray-500" />
                          <div>
                            <p className="text-sm text-gray-500">Order Date</p>
                            <p className="font-medium">{formatDate(order.createdAt)}</p>
                          </div>
                        </div>
                        <div className="flex items-start mb-3">
                          <FaPhone className="mt-1 mr-2 text-gray-500" />
                          <div>
                            <p className="text-sm text-gray-500">Phone</p>
                            <p className="font-medium">{order.shippingAddress.phoneNumber || 'N/A'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Shipping Information */}
                  <div className="bg-gray-50 rounded-lg p-3 sm:p-5 mb-4 sm:mb-6">
                    <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-800 flex items-center">
                      <FaShippingFast className="mr-2 text-indigo-600" /> Shipping Details
                    </h2>
                    <div className="flex items-start mb-3">
                      <FaMapMarkerAlt className="mt-1 mr-2 text-gray-500 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-500">Address</p>
                        <p className="font-medium break-words">
                          {order.shippingAddress.address}, {order.shippingAddress.city}{' '}
                          {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                        </p>
                      </div>
                    </div>
                    <div className="mt-3">
                      {order.isDelivered ? (
                        <div className="bg-green-100 text-green-800 p-3 rounded-md flex items-center">
                          <FaTruck className="mr-2 flex-shrink-0" />
                          <span>Delivered on {formatDate(order.deliveredAt)}</span>
                        </div>
                      ) : (
                        <div className="bg-yellow-100 text-yellow-800 p-3 rounded-md flex items-center">
                          <FaTruck className="mr-2 flex-shrink-0" />
                          <span>Not Delivered</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Payment Information */}
                  <div className="bg-gray-50 rounded-lg p-3 sm:p-5 mb-4 sm:mb-6">
                    <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-800 flex items-center">
                      <FaMoneyBill className="mr-2 text-indigo-600" /> Payment Information
                    </h2>
                    <div className="flex items-start mb-3">
                      <FaMoneyBillWave className="mt-1 mr-2 text-gray-500 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-500">Method</p>
                        <p className="font-medium">{order.paymentMethod}</p>
                      </div>
                    </div>
                    <div className="mt-3">
                      {order.isPaid ? (
                        <div className="bg-green-100 text-green-800 p-3 rounded-md flex items-center">
                          <FaMoneyBillWave className="mr-2 flex-shrink-0" />
                          <span>Paid on {formatDate(order.paidAt)}</span>
                        </div>
                      ) : (
                        <div className="bg-red-100 text-red-800 p-3 rounded-md flex items-center">
                          <FaMoneyBillWave className="mr-2 flex-shrink-0" />
                          <span>Not Paid</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Order Items */}
                  <div className="bg-gray-50 rounded-lg p-3 sm:p-5 mb-4 sm:mb-6">
                    <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-800 flex items-center">
                      <FaBox className="mr-2 text-indigo-600" /> Order Items
                    </h2>
                    {order.orderItems.length === 0 ? (
                      <Message>Order is empty</Message>
                    ) : (
                      <div className="overflow-x-auto -mx-3 sm:mx-0">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-100">
                            <tr>
                              <th scope="col" className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Item
                              </th>
                              <th scope="col" className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Qty
                              </th>
                              <th scope="col" className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Price
                              </th>
                              <th scope="col" className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Total
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {order.orderItems.map((item, index) => (
                              <tr key={index} className="hover:bg-gray-50">
                                <td className="px-3 sm:px-6 py-2 sm:py-4">
                                  <div className="flex items-center">
                                    <div className="flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10">
                                      <img className="h-8 w-8 sm:h-10 sm:w-10 rounded-md object-cover" src={item.image} alt={item.name} />
                                    </div>
                                    <div className="ml-2 sm:ml-4">
                                      <Link to={`/product/${item.product}`} className="text-xs sm:text-sm font-medium text-indigo-600 hover:text-indigo-900 line-clamp-2">
                                        {item.name}
                                      </Link>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-3 sm:px-6 py-2 sm:py-4 text-xs sm:text-sm text-gray-500">
                                  {item.qty}
                                </td>
                                <td className="px-3 sm:px-6 py-2 sm:py-4 text-xs sm:text-sm text-gray-500">
                                  GH₵{item.price.toFixed(2)}
                                </td>
                                <td className="px-3 sm:px-6 py-2 sm:py-4 text-xs sm:text-sm font-medium text-gray-900">
                                  GH₵{(item.qty * item.price).toFixed(2)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="w-full lg:w-1/3">
                  {/* Order Summary */}
                  <div className="bg-gray-50 rounded-lg p-3 sm:p-5 mb-4 sm:mb-6 lg:sticky lg:top-4">
                    <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-800">Order Summary</h2>
                    <div className="space-y-2 sm:space-y-3">
                      <div className="flex justify-between py-2 border-b border-gray-200">
                        <span className="text-gray-600">Items</span>
                        <span className="font-medium">GH₵{order.itemsPrice.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-200">
                        <span className="text-gray-600">Shipping</span>
                        <span className="font-medium">GH₵{order.shippingPrice.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-200">
                        <span className="text-gray-600">Tax</span>
                        <span className="font-medium">GH₵{order.taxPrice.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between py-2 sm:py-3 font-bold text-base sm:text-lg">
                        <span>Total</span>
                        <span>GH₵{order.totalPrice.toFixed(2)}</span>
                      </div>
                    </div>
                    
                    {/* Admin Actions */}
                    <div className="mt-4 sm:mt-6">
                      <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-gray-800 border-b pb-2">Admin Actions</h3>
                      
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Update Order Status
                        </label>
                        <select
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                          value={selectedStatus}
                          onChange={(e) => setSelectedStatus(e.target.value)}
                        >
                          <option value="">Select Status...</option>
                          <option value="Processing">Processing</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                        <button
                          type="button"
                          className="mt-2 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex justify-center items-center"
                          disabled={loadingStatusUpdate || !selectedStatus}
                          onClick={updateStatusHandler}
                        >
                          {loadingStatusUpdate ? 'Updating...' : 'Update Status'}
                        </button>
                      </div>
                      
                      <div className="space-y-3">
                        {!order.isPaid && order.paymentMethod === 'CashOnDelivery' && order.status !== 'Cancelled' && (
                          <button
                            type="button"
                            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 flex justify-center items-center"
                            disabled={loadingPay}
                            onClick={payHandler}
                          >
                            <FaMoneyBillWave className="mr-2" />
                            {loadingPay ? 'Processing...' : 'Mark as Paid'}
                          </button>
                        )}

                        console.log('Order status:', order.status);
                        console.log('Is order cancelled?', order.status === 'Cancelled');
                        
                        {!order.isDelivered && order.isPaid && order.status !== 'Cancelled' && (
                          <button
                            type="button"
                            className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 flex justify-center items-center"
                            disabled={loadingDeliver}
                            onClick={deliverHandler}
                          >
                            <FaTruck className="mr-2" />
                            {loadingDeliver ? 'Processing...' : 'Mark as Delivered'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminOrderPage;