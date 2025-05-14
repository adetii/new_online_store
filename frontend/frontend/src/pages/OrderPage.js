import { Link, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaMapMarkerAlt, FaCreditCard, FaPhone } from 'react-icons/fa';
import Loader from '../components/layout/Loader';
import Message from '../components/layout/Message';
import { FaArrowLeft } from 'react-icons/fa';
import PaystackButton from '../components/payment/PaystackButton';
import { 
  useGetOrderDetailsQuery, 
  usePayOrderMutation, 
  useVerifyPaystackPaymentMutation 
} from '../slices/ordersApiSlice';
import { showSuccessToast, showErrorToast } from '../utils/toastUtils';
import { useEffect } from 'react';

// Helper function to create a URL slug (consider moving to a utils file)
const createSlug = (name) => {
  if (!name) return 'product';
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-'); // Replace multiple hyphens with single hyphen
};

const OrderPage = () => {
  const { id: orderId } = useParams();
  const { userInfo } = useSelector((state) => state.auth);

  const { data: order, isLoading, error, refetch } = useGetOrderDetailsQuery(orderId);
  // eslint-disable-next-line no-unused-vars
  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();
  const [verifyPaystackPayment, { isLoading: loadingVerify }] = useVerifyPaystackPaymentMutation();
  
  useEffect(() => {
    if (order) {
    }
  }, [order]);
  
  // Paystack handlers
  const handlePaystackSuccess = async (reference) => {
    try {
      await verifyPaystackPayment({
        reference: reference.reference,
        orderId: orderId
      }).unwrap();
      
      showSuccessToast('Payment successful!');
      refetch();
    } catch (err) {
      showErrorToast(err?.data?.message || err.error || 'Payment verification failed');
    }
  };
  
  const handlePaystackClose = () => {
    showSuccessToast('Payment cancelled');
  };
  
  // Get order status badge color
  const getStatusBadgeColor = (status) => {
    const statusLower = status ? status.toLowerCase() : '';
    switch (statusLower) {
      case 'pending payment':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-500 text-white';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="error">{error?.data?.message || error.error}</Message>
      ) : order ? (
        <>
        <Link to="/" className="flex items-center text-primary mb-4 hover:underline">
        <FaArrowLeft className="mr-2" /> Back to Products
      </Link>
      
          <h1 className="text-3xl font-bold mb-8">Order</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {/* Order Status */}
              <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4">Order Status</h2>
                <div className="flex items-center">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>
              </div>
              
              {/* Shipping */}
              <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-xl font-semibold mb-6">Shipping</h2>
                <div className="flex items-center mb-2">
                  <FaMapMarkerAlt className="mr-2 text-primary" />
                  <span className="font-medium">Address:</span>
                  <span className="ml-2">
                    {order.shippingAddress.address}, {order.shippingAddress.city}{' '}
                    {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                  </span>
                </div>
                <div className="flex items-center">
                  <FaPhone className="mr-2 text-primary" />
                  <span className="font-medium">Phone:</span>
                  <span className="ml-2">{order.shippingAddress.phoneNumber}</span>
                </div>
                <div className="mt-4">
                  {order.isDelivered ? (
                    <Message variant="success">
                      Delivered on {new Date(order.deliveredAt).toLocaleDateString()}
                    </Message>
                  ) : (
                    <Message variant="error">Not Delivered</Message>
                  )}
                </div>
              </div>

              {/* Payment */}
              <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-xl font-semibold mb-6">Payment</h2>
                <div className="flex items-center">
                  <FaCreditCard className="mr-2 text-primary" />
                  <span className="font-medium">Method:</span>
                  <span className="ml-2">{order.paymentMethod}</span>
                </div>
                <div className="mt-4">
                  {order.isPaid ? (
                    <Message variant="success">
                      Paid on {new Date(order.paidAt).toLocaleDateString()}
                    </Message>
                  ) : (
                    <Message variant="error">Not Paid</Message>
                  )}
                </div>
                
                {/* Paystack Button for unpaid orders with Paystack method */}
                {!order.isPaid && order.paymentMethod === 'Paystack' && (
                  <div className="mt-4">
                    <PaystackButton
                      amount={order.totalPrice}
                      email={userInfo.email}
                      onSuccess={handlePaystackSuccess}
                      onClose={handlePaystackClose}
                      isLoading={loadingVerify}
                    />
                  </div>
                )}
                
                {/* Cash on Delivery Message */}
                {!order.isPaid && order.paymentMethod === 'CashOnDelivery' && (
                  <div className="mt-4 p-3 bg-blue-50 text-blue-700 rounded">
                    You will pay GH₵{order.totalPrice.toFixed(2)} when your order is delivered.
                  </div>
                )}
              </div>

              {/* Order Items */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-6">Order Items</h2>
                <div className="space-y-4">
                  {order.orderItems && order.orderItems.map((item, index) => (
                    <div key={index} className="flex items-center border-b pb-4">
                      <div className="w-16 h-16 flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover rounded"
                        />
                      </div>
                      <div className="ml-4 flex-grow">
                        {/* Update the Link 'to' prop */}
                        <Link
                          to={`/product/${item.product}/${createSlug(item.name)}`}
                          className="font-medium hover:text-primary"
                        >
                          {item.name}
                        </Link>
                      </div>
                      <div className="ml-4">
                        {item.qty || 0} x GH₵{(item.price || 0).toFixed(2)} = GH₵{((item.qty || 0) * (item.price || 0)).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Items:</span>
                    <span>GH₵{order.itemsPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping:</span>
                    <span>GH₵{order.shippingPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax:</span>
                    <span>GH₵{order.taxPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg border-t pt-4">
                    <span>Total:</span>
                    <span>GH₵{order.totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <Message variant="error">Order not found</Message>
      )}
    </div>
  );
};

export default OrderPage;