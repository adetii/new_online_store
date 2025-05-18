import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { showSuccessToast, showErrorToast } from '../utils/toastUtils';
import { useCreateOrderMutation, useVerifyPaystackPaymentMutation } from '../slices/ordersApiSlice';
import { clearCartItems } from '../slices/cartSlice';
import { FaMapMarkerAlt, FaCreditCard, FaShoppingCart, FaPhone, FaArrowLeft } from 'react-icons/fa';
import CheckoutSteps from '../components/checkout/CheckoutSteps';
import Message from '../components/layout/Message';
import Loader from '../components/layout/Loader';

// Helper to slugify product names
const createSlug = (name) =>
  name
    ?.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');

const PlaceOrderPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { cartItems, shippingAddress, paymentMethod } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);

  const [createOrder, { isLoading: placingOrder, error }] = useCreateOrderMutation();
  const [verifyPaystackPayment, { isLoading: verifyingPayment }] = useVerifyPaystackPaymentMutation();

  // disable both loading states
  const isProcessing = placingOrder || verifyingPayment;

  // redirect if necessary
  useEffect(() => {
    if (!shippingAddress.address) navigate('/shipping');
    else if (!paymentMethod) navigate('/payment');
  }, [shippingAddress.address, paymentMethod, navigate]);

  // prices
  const itemsPrice = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shippingPrice = itemsPrice > 100 ? 0 : 10;
  const taxPrice = Number((0.15 * itemsPrice).toFixed(2));
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  // dynamically load Paystack script
  useEffect(() => {
    if (!window.PaystackPop) {
      const script = document.createElement('script');
      script.src = 'https://js.paystack.co/v1/inline.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const placeOrderHandler = async () => {
    try {
      // prepare order items
      const orderItems = cartItems.map((item) => ({
        name: item.name,
        qty: item.qty,
        image: item.images?.[0]?.url || item.image,
        price: item.price,
        product: item._id,
      }));

      // create order
      const order = await createOrder({
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
      }).unwrap();

      if (paymentMethod === 'Paystack') {
        if (typeof window.PaystackPop === 'undefined') {
          showErrorToast('Payment service not available. Please try again later.');
          return;
        }

        const handler = window.PaystackPop.setup({
          key: process.env.REACT_APP_PAYSTACK_PUBLIC_KEY,    // from .env
          email: userInfo.email,
          amount: Math.round(totalPrice * 100),
          currency: 'GHS',
          ref: '' + Math.floor(Math.random() * 1e9 + 1),
          onClose: () => showErrorToast('Payment window closed'),
          callback: async (response) => {
            try {
              await verifyPaystackPayment({
                reference: response.reference,
                orderId: order._id,
                paymentDetails: {
                  transactionId: response.transaction,
                  reference: response.reference,
                  amount: totalPrice,
                  currency: 'GHS',
                  status: 'COMPLETED',
                  paymentDate: new Date().toISOString(),
                  paymentMethod: 'Paystack',
                  email: userInfo.email,
                },
              }).unwrap();

              dispatch(clearCartItems());
              showSuccessToast('Payment successful!');
              navigate(`/order/${order._id}`);
            } catch (err) {
              showErrorToast(err?.data?.message || err.error || 'Payment verification failed');
            }
          },
        });

        handler.openIframe();
      } else {
        // Cash on Delivery
        dispatch(clearCartItems());
        showSuccessToast('Order placed! Pay on delivery.');
        navigate(`/order/${order._id}`);
      }
    } catch (err) {
      showErrorToast(err?.data?.message || err.error || 'An error occurred');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <CheckoutSteps step1 step2 step3 step4 />

      <Link to="/payment" className="flex items-center text-primary mb-4 hover:underline">
        <FaArrowLeft className="mr-2" /> Back to Payment
      </Link>

      <h1 className="text-3xl font-bold mb-8">Place Order</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Shipping */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Shipping</h2>
            <div className="flex items-center mb-2">
              <FaMapMarkerAlt className="mr-2 text-primary" />
              <span>
                {shippingAddress.address}, {shippingAddress.city}{' '}
                {shippingAddress.postalCode}, {shippingAddress.country}
              </span>
            </div>
            <div className="flex items-center">
              <FaPhone className="mr-2 text-primary" />
              <span>{shippingAddress.phoneNumber}</span>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
            <div className="flex items-center">
              <FaCreditCard className="mr-2 text-primary" />
              <span>{paymentMethod}</span>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Order Items</h2>
            {cartItems.length === 0 ? (
              <Message>Your cart is empty</Message>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item._id} className="flex items-center border-b pb-4">
                    <img
                      src={item.images?.[0]?.url || item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="ml-4 flex-grow">
                      <Link
                        to={`/product/${item._id}/${createSlug(item.name)}`}
                        className="font-medium hover:text-primary"
                      >
                        {item.name}
                      </Link>
                    </div>
                    <div>
                      {item.qty} x GH₵{item.price.toFixed(2)} = GH₵
                      {(item.qty * item.price).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right column */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6 space-y-4">
            <h2 className="text-xl font-semibold">Order Summary</h2>
            <div className="flex justify-between"><span>Items:</span><span>GH₵{itemsPrice.toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Shipping:</span><span>GH₵{shippingPrice.toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Tax:</span><span>GH₵{taxPrice.toFixed(2)}</span></div>
            <div className="flex justify-between font-bold text-lg border-t pt-4">
              <span>Total:</span><span>GH₵{totalPrice.toFixed(2)}</span>
            </div>

            {error && <Message variant="error">{error.data?.message || error.error}</Message>}

            <button
              type="button"
              className={`w-full mt-4 py-3 rounded-md text-white font-semibold flex items-center justify-center ${
                isProcessing
                  ? 'bg-gray-400 cursor-not-allowed'
                  : paymentMethod === 'Paystack'
                  ? 'bg-green-500 hover:bg-green-600'
                  : 'bg-primary hover:bg-primary-dark'
              }`}
              disabled={cartItems.length === 0 || isProcessing}
              onClick={placeOrderHandler}
            >
              {isProcessing ? (
                <Loader small />
              ) : paymentMethod === 'Paystack' ? (
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
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrderPage;
