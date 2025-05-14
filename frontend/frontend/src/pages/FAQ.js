import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqs = [
    {
      question: 'How do I place an order?',
      answer: 'To place an order, browse our products, add items to your cart, and proceed to checkout. You\'ll need to provide shipping information and payment details to complete your purchase.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept various payment methods including credit/debit cards, Paystack, and cash on delivery for eligible locations.'
    },
    {
      question: 'How long will it take to receive my order?',
      answer: 'Delivery times vary depending on your location. Typically, orders are delivered within 3-7 business days for local deliveries and 7-14 business days for international shipments.'
    },
    {
      question: 'Can I cancel my order?',
      answer: 'Yes, you can cancel your order as long as it hasn\'t been shipped yet. Go to your order history, find the order you want to cancel, and click the "Cancel" button.'
    },
    {
      question: 'What is your return policy?',
      answer: 'We accept returns within 14 days of delivery. Items must be in their original condition with tags attached. Please visit our Return Policy page for more details.'
    },
    {
      question: 'Do you ship internationally?',
      answer: 'Yes, we ship to select countries internationally. Shipping costs and delivery times vary by location.'
    },
    {
      question: 'How can I track my order?',
      answer: 'Once your order is shipped, you\'ll receive a tracking number via email. You can also check your order status in your account dashboard.'
    },
    {
      question: 'Are there any discounts or promotions available?',
      answer: 'We regularly offer promotions and discounts. Subscribe to our newsletter to stay updated on our latest offers and sales.'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h1>
      
      <div className="max-w-3xl mx-auto">
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border rounded-lg overflow-hidden">
              <button
                className="flex justify-between items-center w-full p-4 text-left bg-white hover:bg-gray-50 focus:outline-none"
                onClick={() => toggleFAQ(index)}
              >
                <span className="font-medium">{faq.question}</span>
                {activeIndex === index ? <FaChevronUp /> : <FaChevronDown />}
              </button>
              
              {activeIndex === index && (
                <div className="p-4 bg-gray-50 border-t">
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="mt-10 p-6 bg-primary-light rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Still have questions?</h2>
          <p className="mb-4">If you couldn't find the answer to your question, please contact our customer support team.</p>
          <a
            href="/contact"
            className="inline-block bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary-dark transition duration-300"
          >
            Contact Us
          </a>
        </div>
      </div>
    </div>
  );
};

export default FAQ;