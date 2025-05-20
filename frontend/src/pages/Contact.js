import React, { useState } from 'react';
-import { showSuccessToast, showErrorToast } from '../utils/toastUtils';
+import { showSuccessToast, showErrorToast } from '../utils/toastUtils';
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
-import axios from 'axios';
-import Loader from '../components/ui/Loader';
+import axios from 'axios';
+import Loader from '../components/ui/Loader';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const { name, email, subject, message } = formData;

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    
    // 1) Early validation
    if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
      showErrorToast('Please fill in all fields.');
      return;
    }

    try {
      setLoading(true);
      
      // 2) Centralize base URL via env var
      const API_URL = process.env.REACT_APP_API_URL || '';
      const config = {
        baseURL: API_URL,
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 10000,            // 10s timeout
      };
      
-      await axios.post('/api/contact', formData, config);
+      await axios.post('/api/contact', formData, config);
      
      showSuccessToast('Message sent successfully! We will get back to you soon.');
      
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      // 3) More robust error extraction
      const errorMessage =
        error.response?.data?.message ||
        error.message?.includes('timeout') 
          ? 'Request timed out. Please try again.' 
          : 'Something went wrong. Please try again later.';
      
      showErrorToast(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Contact Us</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Info column */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Get In Touch</h2>
          <p className="mb-6 text-gray-600">
            Have questions about our products or services? We're here to help! Fill out the form and we'll get back to you as soon as possible.
          </p>
          
          <div className="space-y-4">
            <div className="flex items-start">
              <FaMapMarkerAlt className="text-primary mt-1 mr-3" />
              <div>
                <h3 className="font-medium">Address</h3>
                <p className="text-gray-600">123 Shopping Street, Accra, Ghana</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <FaEnvelope className="text-primary mt-1 mr-3" />
              <div>
                <h3 className="font-medium">Email</h3>
                <p className="text-gray-600">
                  <a href="mailto:info@shopname.com" className="hover:underline">
                    info@shopname.com
                  </a>
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <FaPhone className="text-primary mt-1 mr-3" />
              <div>
                <h3 className="font-medium">Phone</h3>
                <p className="text-gray-600">
                  <a href="tel:+233267161718" className="hover:underline">
                    +233 26 716 1718
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Form column */}
        <div>
          <form onSubmit={onSubmit} className="bg-white p-6 rounded-lg shadow-md">
            {/** Name **/}
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-700 font-medium mb-2">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={name}
                onChange={onChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            
            {/** Email **/}
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={onChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            
            {/** Subject **/}
            <div className="mb-4">
              <label htmlFor="subject" className="block text-gray-700 font-medium mb-2">Subject</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={subject}
                onChange={onChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            
            {/** Message **/}
            <div className="mb-4">
              <label htmlFor="message" className="block text-gray-700 font-medium mb-2">Message</label>
              <textarea
                id="message"
                name="message"
                value={message}
                onChange={onChange}
                rows="5"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                required
              ></textarea>
            </div>
            
            {/** Submit button **/}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary-dark transition duration-300 flex justify-center items-center"
            >
              {loading ? <Loader size="sm" /> : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
