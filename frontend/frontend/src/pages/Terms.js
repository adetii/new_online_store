import React from 'react';

const Terms = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Terms & Conditions</h1>
      
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <div className="prose prose-lg max-w-none">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">1. Introduction</h2>
          <p className="mb-4">
            Welcome to ShopName. These terms and conditions outline the rules and regulations for the use of our website.
          </p>
          <p className="mb-4">
            By accessing this website, we assume you accept these terms and conditions in full. Do not continue to use ShopSmart if you do not accept all of the terms and conditions stated on this page.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">2. License to Use Website</h2>
          <p className="mb-4">
            Unless otherwise stated, ShopSmart and/or its licensors own the intellectual property rights for all material on ShopSmart. All intellectual property rights are reserved.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">3. User Account</h2>
          <p className="mb-4">
            If you create an account on our website, you are responsible for maintaining the security of your account and you are fully responsible for all activities that occur under the account.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">4. Product Information</h2>
          <p className="mb-4">
            We strive to provide accurate product information, but we do not warrant that product descriptions or other content is accurate, complete, reliable, current, or error-free.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">5. Pricing and Payment</h2>
          <p className="mb-4">
            All prices are subject to change without notice. We reserve the right to refuse or cancel any orders placed for products listed at an incorrect price.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">6. Limitation of Liability</h2>
          <p className="mb-4">
            In no event shall ShopName, nor any of its officers, directors and employees, be liable to you for anything arising out of or in any way connected with your use of this website.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Terms;