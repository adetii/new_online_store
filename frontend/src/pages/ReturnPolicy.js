import React from 'react';

const ReturnPolicy = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Return Policy</h1>
      
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <div className="prose prose-lg max-w-none">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">1. Return Period</h2>
          <p className="mb-4">
            We offer a 14-day return policy for most items. To be eligible for a return, your item must be unused and in the same condition that you received it. It must also be in the original packaging.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">2. Return Process</h2>
          <p className="mb-4">
            To start a return, you can contact us at info@shopname.com. If your return is accepted, we'll send you instructions on how and where to send your package. Items sent back to us without first requesting a return will not be accepted.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">3. Refunds</h2>
          <p className="mb-4">
            Once your return is received and inspected, we will send you an email to notify you that we have received your returned item. We will also notify you of the approval or rejection of your refund.
          </p>
          <p className="mb-4">
            If you are approved, then your refund will be processed, and a credit will automatically be applied to your credit card or original method of payment, within a certain amount of days.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">4. Late or Missing Refunds</h2>
          <p className="mb-4">
            If you haven't received a refund yet, first check your bank account again. Then contact your credit card company, it may take some time before your refund is officially posted. Next contact your bank. There is often some processing time before a refund is posted.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">5. Exchanges</h2>
          <p className="mb-4">
            We only replace items if they are defective or damaged. If you need to exchange it for the same item, send us an email at info@shopname.com and send your item to the address provided.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReturnPolicy;