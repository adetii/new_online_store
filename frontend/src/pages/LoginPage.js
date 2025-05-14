import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useLoginMutation } from '../slices/usersApiSlice';
import { setCredentials } from '../slices/authSlice';
import { FaUser, FaLock } from 'react-icons/fa';
import Loader from '../components/layout/Loader';
import { showSuccessToast, showErrorToast } from '../utils/toastUtils';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Extract redirect query parameter, if available; otherwise default to '/'
  const redirect = new URLSearchParams(location.search).get('redirect') || '/';
  
  const [login, { isLoading }] = useLoginMutation();
  const { userInfo } = useSelector((state) => state.auth);
  
  // Redirect if already logged in
  useEffect(() => {
    if (userInfo) {
      if (userInfo.isAdmin) {
        navigate('/admin/dashboard');
      } else {
        navigate(redirect);
      }
    }
  }, [userInfo, navigate, redirect]);
  
  // Then in your submitHandler function
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials(res));
      showSuccessToast('Logged in successfully');
      
      // Redirect based on user role
      if (res.isAdmin) {
        navigate('/admin/dashboard');
      } else {
        navigate(redirect);
      }
    } catch (error) {
      showErrorToast(error?.data?.message || error.error || 'Login failed');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center">Sign In</h1>
      <form onSubmit={submitHandler}>
        <div className="mb-4">
          <label htmlFor="email" className="block mb-2 font-medium">
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 w-12 flex items-center justify-center pointer-events-none">
              <FaUser className="text-primary text-lg" />
            </div>
            <input
              type="email"
              id="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-10 pl-12 pr-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary bg-white"
              required
            />
          </div>
        </div>
        
        <div className="mb-6">
          <label htmlFor="password" className="block mb-2 font-medium">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 w-12 flex items-center justify-center pointer-events-none">
              <FaLock className="text-primary text-lg" />
            </div>
            <input
              type="password"
              id="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-10 pl-12 pr-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary bg-white"
              required
            />
          </div>
          <div className="mt-6 text-right">
          <Link to="/forgotpassword" className="text-primary hover:underline">
            Forgot Password?
          </Link>
      </div>
        </div>

        <button
          type="submit"
          className="w-full bg-primary hover:bg-primary-dark text-white py-3 px-4 rounded-md font-semibold transition-colors"
          disabled={isLoading}
        >
          {isLoading ? 'Signing In...' : 'Sign In'}
        </button>
        
        <div className="mt-6 text-center">
          <p>
            New Customer?{' '}
            <Link
              to={redirect ? `/register?redirect=${redirect}` : '/register'}
              className="text-primary hover:underline"
            >
              Register
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;