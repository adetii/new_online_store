import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { showSuccessToast, showErrorToast } from '../utils/toastUtils';
import { useResetPasswordMutation } from '../slices/usersApiSlice';
import Loader from '../components/layout/Loader';
import FormContainer from '../components/layout/FormContainer';

const ResetPasswordPage = () => {
  const { resettoken } = useParams();
  const navigate = useNavigate();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordReset, setPasswordReset] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState([]);

  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  // Password validation function
  const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);
    const errors = [];

    if (password.length < minLength) {
      errors.push(`Password must be at least ${minLength} characters long`);
    }
    if (!hasUpperCase) {
      errors.push('Password must contain at least one uppercase letter');
    }
    if (!hasLowerCase) {
      errors.push('Password must contain at least one lowercase letter');
    }
    if (!hasNumbers) {
      errors.push('Password must contain at least one number');
    }
    if (!hasSpecialChar) {
      errors.push('Password must contain at least one special character');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      showErrorToast('Passwords do not match');
      return;
    }
    
    // Validate password
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      setPasswordErrors(passwordValidation.errors);
      showErrorToast(passwordValidation.errors[0]);
      return;
    }
    
    try {
      await resetPassword({
        resettoken,
        password,
      }).unwrap();
      
      setPasswordReset(true);
      showSuccessToast('Password reset successful');
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      showErrorToast(err?.data?.message || err.error || 'Invalid or expired token');
    }
  };

  return (
    <FormContainer>
      <h1 className="text-2xl font-bold mb-6">Reset Password</h1>
      
      {passwordReset ? (
        <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-md mb-4">
          <p>Your password has been reset successfully!</p>
          <p className="mt-2">
            Redirecting to login page... or{' '}
            <Link to="/login" className="text-primary hover:underline">
              click here
            </Link>
          </p>
        </div>
      ) : (
        <form onSubmit={submitHandler}>
          <div className="mb-4">
            <label htmlFor="password" className="block mb-1 font-medium">
              New Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full p-2 border rounded focus:border-primary focus:ring-1 focus:ring-primary"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div className="text-sm text-gray-600 mt-1">
              Password must:
              <ul className="list-disc pl-5">
                <li>Be at least 8 characters long</li>
                <li>Contain at least one uppercase letter</li>
                <li>Contain at least one lowercase letter</li>
                <li>Contain at least one number</li>
                <li>Contain at least one special character</li>
              </ul>
            </div>
            {passwordErrors.length > 0 && (
              <div className="text-sm text-red-500 mt-1">
                <ul className="list-disc pl-5">
                  {passwordErrors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="confirmPassword" className="block mb-1 font-medium">
              Confirm New Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              className="w-full p-2 border rounded focus:border-primary focus:ring-1 focus:ring-primary"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-primary hover:bg-primary-dark text-white py-2 px-4 rounded-md font-medium"
            disabled={isLoading}
          >
            {isLoading ? <Loader small /> : 'Reset Password'}
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

export default ResetPasswordPage;