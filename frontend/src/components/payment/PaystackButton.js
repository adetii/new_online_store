import React from 'react';
import { usePaystackPayment } from 'react-paystack';
import Loader from '../layout/Loader';

const PaystackButton = ({ amount, email, onSuccess, onClose, isLoading }) => {
  // Convert amount to kobo (Paystack uses the smallest currency unit)
  const amountInKobo = Math.round(amount * 100);
  
  const config = {
    reference: (new Date()).getTime().toString(),
    email: email,
    amount: amountInKobo,
    publicKey: process.env.REACT_APP_PAYSTACK_PUBLIC_KEY || 'pk_test_your_public_key_here',
    currency: 'GHS',
  };
  
  const initializePayment = usePaystackPayment(config);
  
  return (
    <button 
      type="button"
      onClick={() => {
        initializePayment(onSuccess, onClose);
      }}
      disabled={isLoading}
      className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-md font-semibold"
    >
      {isLoading ? <Loader /> : 'Pay with Paystack'}
    </button>
  );
};

export default PaystackButton;