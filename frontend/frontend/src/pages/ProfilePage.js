import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaUser, FaEnvelope, FaLock } from 'react-icons/fa';
import { showSuccessToast, showErrorToast } from '../utils/toastUtils';
import {
  useUpdateUserProfileMutation,
  useGetUserDetailsQuery,
} from '../slices/usersApiSlice';
import { setCredentials } from '../slices/authSlice';
import Loader from '../components/layout/Loader';

const ProfilePage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordErrors, setPasswordErrors] = useState([]);
  
  const dispatch = useDispatch();
  
  const { userInfo } = useSelector((state) => state.auth);
  
  const { data: user, refetch, isLoading: loadingUser } = useGetUserDetailsQuery();
  
  const [updateProfile, { isLoading: loadingUpdate }] = useUpdateUserProfileMutation();
  
  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);
  
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
    
    // Only validate password if it's provided (for updating)
    if (password) {
      const passwordValidation = validatePassword(password);
      if (!passwordValidation.isValid) {
        setPasswordErrors(passwordValidation.errors);
        showErrorToast(passwordValidation.errors[0]);
        return;
      }
    }
    
    try {
      const res = await updateProfile({
        name,
        email,
        password: password || undefined,
      }).unwrap();
      
      dispatch(setCredentials(res));
      refetch();
      showSuccessToast('Profile updated successfully');
      setPassword('');
      setConfirmPassword('');
      setPasswordErrors([]);
    } catch (err) {
     showErrorToast(err?.data?.message || err.error);
    }
  };
  
  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-6">Update Profile</h2>
        
        {loadingUser ? (
          <Loader />
        ) : (
          <form onSubmit={submitHandler}>
            <div className="mb-4">
              <label htmlFor="name" className="form-label">
                Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="text-gray-400" />
                </div>
                <input
                  type="text"
                  id="name"
                  placeholder="Enter name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="form-input pl-10"
                />
              </div>
            </div>
            
            <div className="mb-4">
              <label htmlFor="email" className="form-label">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input pl-10"
                />
              </div>
            </div>
            
            <div className="mb-4">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-gray-400" />
                </div>
                <input
                  type="password"
                  id="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input pl-10"
                />
              </div>
              {password && (
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
              )}
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
            
            <div className="mb-6">
              <label htmlFor="confirmPassword" className="form-label">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-gray-400" />
                </div>
                <input
                  type="password"
                  id="confirmPassword"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="form-input pl-10"
                />
              </div>
            </div>
            
            <button
              type="submit"
              className="bg-primary text-white py-2 px-4 rounded-md font-semibold hover:bg-primary-dark"
              disabled={loadingUpdate}
            >
              {loadingUpdate ? 'Updating...' : 'Update'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;