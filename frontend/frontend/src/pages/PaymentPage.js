import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { savePaymentMethod } from '../slices/cartSlice';
import { FaCreditCard, FaMoneyBillWave, FaArrowLeft } from 'react-icons/fa';
import CheckoutSteps from '../components/checkout/CheckoutSteps';

const PaymentPage = () => {
  const [paymentMethod, setPaymentMethod] = useState('Paystack');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  useEffect(() => {
    if (!shippingAddress.address) {
      navigate('/shipping');
    }
  }, [navigate, shippingAddress]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    navigate('/placeorder');
  };

  const goBackHandler = () => {
    navigate('/shipping');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <CheckoutSteps step1 step2 step3 />
      
      <button 
        onClick={goBackHandler}
        className="flex items-center text-gray-700 hover:text-primary mb-4"
      >
        <FaArrowLeft className="mr-2" /> Back to Shipping
      </button>
      
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6 mt-8">
        <h1 className="text-2xl font-bold mb-6">Payment Method</h1>
        
        <form onSubmit={submitHandler}>
          <div className="mb-6">
            <label className="block mb-4 font-medium">Select Method</label>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="Paystack"
                  name="paymentMethod"
                  value="Paystack"
                  checked={paymentMethod === 'Paystack'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="h-5 w-5 text-primary"
                />
                <label htmlFor="Paystack" className="ml-3 flex items-center">
                  <FaCreditCard className="mr-2 text-green-500" /> Paystack
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="radio"
                  id="CashOnDelivery"
                  name="paymentMethod"
                  value="CashOnDelivery"
                  checked={paymentMethod === 'CashOnDelivery'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="h-5 w-5 text-primary"
                />
                <label htmlFor="CashOnDelivery" className="ml-3 flex items-center">
                  <FaMoneyBillWave className="mr-2 text-gray-500" /> Cash On Delivery
                </label>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-primary hover:bg-primary-dark text-white py-3 px-4 rounded-md font-semibold"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
};

export default PaymentPage;