import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForgotPasswordMutation } from '../slices/usersApiSlice';
import Loader from '../components/layout/Loader';
import FormContainer from '../components/layout/FormContainer';
// Change this import:
// import { showSuccessToast, showErrorToast } from '../../utils/toastConfig';

// To this:
import { showSuccessToast, showErrorToast } from '../utils/toastUtils';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const submitHandler = async (e) => {
    e.preventDefault();
    
    try {
      await forgotPassword({ email }).unwrap();
      setEmailSent(true);
      showSuccessToast('Password reset email sent');
    } catch (err) {
      showErrorToast(err?.data?.message || err.error || 'Something went wrong');
    }
  };

  return (
    <FormContainer>
      <h1 className="text-2xl font-bold mb-6">Forgot Password</h1>
      
      {emailSent ? (
        <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-md mb-4">
          <p>Password reset email sent! Please check your inbox.</p>
          <p className="mt-2">
            <Link to="/login" className="text-primary hover:underline">
              Return to login
            </Link>
          </p>
        </div>
      ) : (
        <form onSubmit={submitHandler}>
          <div className="mb-4">
            <label htmlFor="email" className="block mb-1 font-medium">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className="w-full p-2 border rounded focus:border-primary focus:ring-1 focus:ring-primary"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-primary hover:bg-primary-dark text-white py-2 px-4 rounded-md font-medium"
            disabled={isLoading}
          >
            {isLoading ? 'Sending...' : 'Send Reset Email'}
          </button>

          <div className="mt-4 text-center">
            <Link to="/login" className="text-primary hover:underline">
              Back to Login
            </Link>
          </div>
        </form>
      )}
    </FormContainer>
  );
};

export default ForgotPasswordPage;