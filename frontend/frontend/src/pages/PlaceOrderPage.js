import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { showSuccessToast, showErrorToast } from '../utils/toastUtils';
import { useCreateOrderMutation } from '../slices/ordersApiSlice';
import { clearCartItems } from '../slices/cartSlice';
import { FaMapMarkerAlt, FaCreditCard, FaShoppingCart, FaPhone } from 'react-icons/fa';
import CheckoutSteps from '../components/checkout/CheckoutSteps';
import Message from '../components/layout/Message';
import Loader from '../components/layout/Loader';
import { useVerifyPaystackPaymentMutation } from '../slices/ordersApiSlice';
import { FaArrowLeft } from 'react-icons/fa';

// Helper function to create a URL slug (consider moving to a utils file)
const createSlug = (name) => {
  if (!name) return 'product';
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-'); // Replace multiple hyphens with single hyphen
};

const PlaceOrderPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);
  const [createOrder, { isLoading, error }] = useCreateOrderMutation();
  const [verifyPaystackPayment, { isLoading: loadingVerify }] = useVerifyPaystackPaymentMutation();

  useEffect(() => {
    if (!cart.shippingAddress.address) {
      navigate('/shipping');
    } else if (!cart.paymentMethod) {
      navigate('/payment');
    }
  }, [cart.shippingAddress.address, cart.paymentMethod, navigate]);

  const itemsPrice = cart.cartItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );
  const shippingPrice = itemsPrice > 100 ? 0 : 10;
  const taxPrice = Number((0.15 * itemsPrice).toFixed(2));
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  // Update the Paystack configuration with more complete parameters
  const paystackConfig = {
    reference: '' + Math.floor((Math.random() * 1000000000) + 1),
    email: userInfo?.email || 'customer@example.com',
    amount: Math.round(totalPrice * 100),
    publicKey: 'pk_test_4acaa38f0bdbbb29bab24088dbebc9ff07df50b9', // Hardcode the key for now
    currency: 'GHS',
    channels: ['card', 'bank', 'ussd', 'qr', 'mobile_money', 'bank_transfer'],
    label: 'Order payment',
    metadata: {
      custom_fields: [
        {
          display_name: "Order Items",
          variable_name: "order_items",
          value: cart.cartItems.map(item => item.name).join(', ').substring(0, 100)
        }
      ]
    }
  };

  // Modify the placeOrderHandler to use a simpler approach
  const placeOrderHandler = async () => {
    try {
      // Transform cart items to include the product field
      const orderItems = cart.cartItems.map(item => ({
        name: item.name,
        qty: item.qty,
        image: item.images && item.images[0] ? item.images[0].url : item.image,
        price: item.price,
        product: item._id,
      }));
  
      const res = await createOrder({
        orderItems: orderItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
      }).unwrap();
      
      if (cart.paymentMethod === 'Paystack') {
        // Ensure that the Paystack inline script is loaded
        if (typeof window.PaystackPop === 'undefined') {
          console.error("Paystack script not loaded");
         showErrorToast("Payment service not available. Please try again later.");
          return;
        }
        
        // Use a very simple configuration - only include required fields
        // Change currency to GHS (Ghana Cedis) which is likely supported
        const handler = window.PaystackPop.setup({
          key: 'pk_test_4acaa38f0bdbbb29bab24088dbebc9ff07df50b9',
          email: userInfo?.email,
          amount: Math.round(totalPrice * 100),
          currency: 'GHS', // Changed from NGN to GHS
          ref: '' + Math.floor((Math.random() * 1000000000) + 1),
          onClose: function() {
           showErrorToast('Payment window closed');
          },
          callback: function(response) {
            console.log("Payment Successful: ", response);
            // Use our internal verification endpoint with payment details
            verifyPaystackPayment({
              reference: response.reference,
              orderId: res._id,
              paymentDetails: {
                transactionId: response.transaction,
                reference: response.reference,
                amount: totalPrice,
                currency: 'GHS',
                status: 'COMPLETED',
                paymentDate: new Date().toISOString(),
                paymentMethod: 'Paystack',
                email: userInfo?.email
              }
            }).unwrap()
              .then(() => {
                dispatch(clearCartItems());
               showSuccessToast('Payment successful!');
                navigate(`/order/${res._id}`);
              })
              .catch((err) => {
                console.error("Payment verification error:", err);
               showErrorToast(err?.data?.message || err.error || 'Payment verification failed');
              });
          }
        });
        
        handler.openIframe();
      } else if (cart.paymentMethod === 'CashOnDelivery') {
        // For Cash on Delivery
        dispatch(clearCartItems());
        showSuccessToast('Order placed successfully! You will pay on delivery.');
        navigate(`/order/${res._id}`);
      }
    } catch (err) {
     showErrorToast(err?.data?.message || err.error || 'An error occurred');
    }
  };

  return (
    <>

    <div className="container mx-auto px-4 py-8">
      <CheckoutSteps step1 step2 step3 step4 />
      
      <Link to="/payment" className="flex items-center text-primary mb-4 hover:underline">
      <FaArrowLeft className="mr-2" /> Back to Payment
    </Link>

      <h1 className="text-3xl font-bold mb-8">Place Order</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-6">Shipping</h2>
            <div className="flex items-center mb-2">
              <FaMapMarkerAlt className="mr-2 text-primary" />
              <span className="font-medium">Address:</span>
              <span className="ml-2">
                {cart.shippingAddress.address}, {cart.shippingAddress.city}{' '}
                {cart.shippingAddress.postalCode}, {cart.shippingAddress.country}
              </span>
            </div>
            <div className="flex items-center">
              <FaPhone className="mr-2 text-primary" />
              <span className="font-medium">Phone:</span>
              <span className="ml-2">{cart.shippingAddress.phoneNumber}</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-6">Payment Method</h2>
            <div className="flex items-center">
              <FaCreditCard className="mr-2 text-primary" />
              <span className="font-medium">Method:</span>
              <span className="ml-2">{cart.paymentMethod}</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-6">Order Items</h2>
            {cart.cartItems.length === 0 ? (
              <Message>Your cart is empty</Message>
            ) : (
              <div className="space-y-4">
                {cart.cartItems.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-center border-b pb-4"
                  >
                    <div className="w-16 h-16 flex-shrink-0">
                      <img
                        src={item.images && item.images[0] ? item.images[0].url : item.image}
                        alt={item.name}
                        className="w-full h-full object-cover rounded"
                      />
                    </div>
                    <div className="ml-4 flex-grow">
                      {/* Update the Link 'to' prop */}
                      <Link
                        to={`/product/${item._id}/${createSlug(item.name)}`}
                        className="font-medium hover:text-primary"
                      >
                        {item.name}
                      </Link>
                    </div>
                    <div className="ml-4">
                      {item.qty} x GH₵{item.price} = GH₵
                      {(item.qty * item.price).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Items:</span>
                <span>GH₵{itemsPrice.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span>GH₵{shippingPrice.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between">
                <span>Tax:</span>
                <span>GH₵{taxPrice.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between font-bold text-lg border-t pt-4">
                <span>Total:</span>
                <span>GH₵{totalPrice.toFixed(2)}</span>
              </div>
            </div>

            {error && <Message variant="error">{error?.data?.message || error.error}</Message>}

            <button
              type="button"
              className={`w-full mt-6 ${cart.paymentMethod === 'Paystack' ? 'bg-green-500 hover:bg-green-600' : 'bg-primary hover:bg-primary-dark'} text-white py-3 px-4 rounded-md font-semibold flex items-center justify-center disabled:bg-gray-400 disabled:cursor-not-allowed`}
              disabled={cart.cartItems.length === 0 || isLoading}
              onClick={placeOrderHandler}
            >
              {isLoading ? (
                <Loader small />
              ) : (
                <>
                  {cart.paymentMethod === 'Paystack' ? (
                    <>
                      <FaCreditCard className="mr-2" />
                      Pay Now
                    </>
                  ) : (
                    <>
                      <FaShoppingCart className="mr-2" />
                      Place Order
                    </>
                  )}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default PlaceOrderPage;