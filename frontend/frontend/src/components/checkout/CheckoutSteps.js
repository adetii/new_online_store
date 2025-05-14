import React from 'react';
import { Link } from 'react-router-dom';
import { FaUser, FaTruck, FaCreditCard, FaCheck } from 'react-icons/fa';

const CheckoutSteps = ({ step1, step2, step3, step4 }) => {
  return (
    <div className="flex justify-between mb-8">
      <div className={`flex flex-col items-center ${step1 ? 'text-primary' : 'text-gray-400'}`}>
        <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step1 ? 'bg-primary text-white' : 'bg-gray-200'}`}>
          <FaUser />
        </div>
        <span className="mt-2 text-sm">Sign In</span>
      </div>

      <div className={`flex-1 h-0.5 self-center mx-2 ${step2 ? 'bg-primary' : 'bg-gray-200'}`}></div>

      <div className={`flex flex-col items-center ${step2 ? 'text-primary' : 'text-gray-400'}`}>
        <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step2 ? 'bg-primary text-white' : 'bg-gray-200'}`}>
          <FaTruck />
        </div>
        <span className="mt-2 text-sm">Shipping</span>
      </div>

      <div className={`flex-1 h-0.5 self-center mx-2 ${step3 ? 'bg-primary' : 'bg-gray-200'}`}></div>

      <div className={`flex flex-col items-center ${step3 ? 'text-primary' : 'text-gray-400'}`}>
        <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step3 ? 'bg-primary text-white' : 'bg-gray-200'}`}>
          <FaCreditCard />
        </div>
        <span className="mt-2 text-sm">Payment</span>
      </div>

      <div className={`flex-1 h-0.5 self-center mx-2 ${step4 ? 'bg-primary' : 'bg-gray-200'}`}></div>

      <div className={`flex flex-col items-center ${step4 ? 'text-primary' : 'text-gray-400'}`}>
        <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step4 ? 'bg-primary text-white' : 'bg-gray-200'}`}>
          <FaCheck />
        </div>
        <span className="mt-2 text-sm">Place Order</span>
      </div>
    </div>
  );
};

export default CheckoutSteps;