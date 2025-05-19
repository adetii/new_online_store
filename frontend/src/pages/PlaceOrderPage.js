import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { showSuccessToast, showErrorToast } from '../utils/toastUtils';
import { useCreateOrderMutation, useVerifyPaystackPaymentMutation } from '../slices/ordersApiSlice';
import { clearCartItems } from '../slices/cartSlice';
import { FaMapMarkerAlt, FaCreditCard, FaShoppingCart, FaPhone, FaArrowLeft } from 'react-icons/fa';
import CheckoutSteps from '../components/checkout/CheckoutSteps';
import Message from '../components/layout/Message';
import Loader from '../components/layout/Loader';

// Helper function to create a URL slug
const createSlug = (name) => {
  if (!name) return 'product';
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

const PlaceOrderPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);
  const [createOrder, { isLoading, error }] = useCreateOrderMutation();
  const [verifyPaystackPayment, { isLoading: loadingVerify }] = useVerifyPaystackPaymentMutation();

  useEffect(() => {
    if (!cart.shippingAddress.address) navigate('/shipping');
    else if (!cart.paymentMethod) navigate('/payment');
  }, [cart.shippingAddress.address, cart.paymentMethod, navigate]);

  const itemsPrice = cart.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const shippingPrice = itemsPrice > 100 ? 0 : 10;
  const taxPrice = Number((0.15 * itemsPrice).toFixed(2));
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  const placeOrderHandler = async () => {
    try {
      const orderItems = cart.cartItems.map(item => ({
        name: item.name,
        qty: item.qty,
        image: item.images?.[0]?.url || item.image,
        price: item.price,
        product: item._id,
      }));

      const res = await createOrder({
        orderItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
      }).unwrap();

      if (cart.paymentMethod === 'Paystack') {
        if (typeof window.PaystackPop === 'undefined') {
          showErrorToast("Payment service not available. Please try again later.");
          return;
        }

        const handler = window.PaystackPop.setup({
          key: process.env.REACT_APP_PAYSTACK_PUBLIC_KEY,   // ← environment-driven key
          email: userInfo.email,
          amount: Math.round(totalPrice * 100),
          currency: 'GHS',
          ref: '' + Math.floor(Math.random() * 1e9 + 1),
          onClose: () => showErrorToast('Payment window closed'),
          callback: function(response) {
            verifyPaystackPayment({
              reference: response.reference,
              orderId: res._id,
              paymentDetails: {
                transactionId: response.reference,
                reference: response.reference,
                amount: totalPrice,
                currency: 'GHS',
                status: 'COMPLETED',
                paymentDate: new Date().toISOString(),
                paymentMethod: 'Paystack',
                email: userInfo.email
              }
            }).unwrap()
              .then(() => {
                dispatch(clearCartItems());
                showSuccessToast('Payment successful!');
                navigate(`/order/${res._id}`);
              })
              .catch((err) => {
                showErrorToast(err?.data?.message || err.error || 'Payment verification failed');
              });
          }
        });

        handler.openIframe();
      } else {
        // Cash on Delivery
        dispatch(clearCartItems());
        showSuccessToast('Order placed successfully! You will pay on delivery.');
        navigate(`/order/${res._id}`);
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
      {/* ... rest of the JSX unchanged ... */}
      <button
        type="button"
        className={`w-full mt-6 ${cart.paymentMethod === 'Paystack' ? 'bg-green-500 hover:bg-green-600' : 'bg-primary hover:bg-primary-dark'} text-white py-3 px-4 rounded-md font-semibold flex items-center justify-center disabled:bg-gray-400 disabled:cursor-not-allowed`}
        disabled={cart.cartItems.length === 0 || isLoading}
        onClick={placeOrderHandler}
      >
        {isLoading ? <Loader small /> : (
          cart.paymentMethod === 'Paystack'
            ? <><FaCreditCard className="mr-2" /> Pay Now</>
            : <><FaShoppingCart className="mr-2" /> Place Order</>
        )}
      </button>
    </div>
  );
};

export default PlaceOrderPage;
