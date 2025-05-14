import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { saveShippingAddress } from '../slices/cartSlice';
import { FaMapMarkerAlt, FaCity, FaGlobe, FaPhone, FaArrowLeft } from 'react-icons/fa';
import CheckoutSteps from '../components/checkout/CheckoutSteps';
import { toast } from 'react-toastify';
import { clearShoppingDataForAdmin } from '../utils/adminUtils';

const ShippingPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux state
  const { shippingAddress, cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);

  // Local form state
  const [address, setAddress]     = useState(shippingAddress?.address || '');
  const [city, setCity]           = useState(shippingAddress?.city || '');
  const [postalCode, setPostalCode] = useState(shippingAddress?.postalCode || '');
  const [country, setCountry]     = useState(shippingAddress?.country || '');
  const [phoneNumber, setPhoneNumber] = useState(shippingAddress?.phoneNumber || '');

  // Redirect admin users out of checkout
  useEffect(() => {
    if (userInfo?.isAdmin) {
      clearShoppingDataForAdmin(); // clear cart/wishlist etc.
      toast.error('Admin users cannot access the checkout process');
      navigate('/admin/dashboard');
    }
  }, [userInfo, navigate]);

  const goBackHandler = () => {
    navigate('/cart');
  };

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(
      saveShippingAddress({
        address,
        city,
        postalCode,
        country,
        phoneNumber,
      })
    );
    navigate('/payment');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <CheckoutSteps step1 step2 />

      <button
        onClick={goBackHandler}
        className="flex items-center text-gray-700 hover:text-primary mb-4"
      >
        <FaArrowLeft className="mr-2" /> Back to Cart
      </button>

      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6 mt-8">
        <h1 className="text-2xl font-bold mb-6">Shipping</h1>

        <form onSubmit={submitHandler}>
          {/* Address */}
          <div className="mb-4">
            <label htmlFor="address" className="block mb-2 font-medium">
              Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 w-14 flex items-center justify-center pointer-events-none">
                <FaMapMarkerAlt className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="address"
                type="text"
                placeholder="Enter address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full h-12 pl-14 pr-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
            </div>
          </div>

          {/* City */}
          <div className="mb-4">
            <label htmlFor="city" className="block mb-2 font-medium">
              City
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 w-14 flex items-center justify-center pointer-events-none">
                <FaCity className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="city"
                type="text"
                placeholder="Enter city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full h-12 pl-14 pr-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
            </div>
          </div>

          {/* Phone Number */}
          <div className="mb-6">
            <label htmlFor="phoneNumber" className="block mb-2 font-medium">
              Phone Number
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 w-14 flex items-center justify-center pointer-events-none">
                <FaPhone className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="phoneNumber"
                type="text"
                placeholder="Enter phone number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full h-12 pl-14 pr-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-primary hover:bg-primary-dark text-white py-2 px-4 rounded-md font-semibold"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
};

export default ShippingPage;
