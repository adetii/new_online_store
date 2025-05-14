import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Privacy Policy</h1>
      
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <div className="prose prose-lg max-w-none">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">1. Introduction</h2>
          <p className="mb-4">
            Welcome to ShopName. We respect your privacy and are committed to protecting your personal data. 
            This privacy policy will inform you about how we look after your personal data when you visit our website 
            and tell you about your privacy rights and how the law protects you.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">2. The Data We Collect</h2>
          <p className="mb-4">
            We may collect, use, store and transfer different kinds of personal data about you including:
            identity data, contact data, financial data, transaction data, technical data, profile data,
            usage data, and marketing and communications data.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">3. How We Use Your Data</h2>
          <p className="mb-4">
            We will only use your personal data when the law allows us to. Most commonly, we will use your personal data
            to provide you with products/services, manage our relationship with you, administer and protect our business,
            and deliver relevant website content and advertisements to you.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">4. Data Security</h2>
          <p className="mb-4">
            We have put in place appropriate security measures to prevent your personal data from being accidentally lost,
            used or accessed in an unauthorized way, altered or disclosed.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">5. Your Legal Rights</h2>
          <p className="mb-4">
            Under certain circumstances, you have rights under data protection laws in relation to your personal data,
            including the right to request access, correction, erasure, restriction, transfer, to object to processing,
            to portability of data and the right to withdraw consent.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">6. Contact Us</h2>
          <p className="mb-4">
            If you have any questions about this privacy policy or our privacy practices, please contact us at:
            info@shopname.com or visit our Contact page.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;