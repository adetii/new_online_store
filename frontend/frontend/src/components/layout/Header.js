import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useLogoutMutation } from '../../slices/usersApiSlice';
import { logoutAndResetCart } from '../../slices/authSlice';
import { showErrorToast } from '../../utils/toastUtils';
import { resetCart } from '../../slices/cartSlice';
import {
  FaShoppingCart,
  FaUser,
  FaBars,
  FaTimes,
  FaChevronDown,
  FaSearch,
} from 'react-icons/fa';
import SearchBox from './SearchBox';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  const profileRef = useRef(null);
  const categoryRef = useRef(null);
  const mobileMenuRef = useRef(null);

  const categories = [
    'Electronics',
    'Clothing',
    'Home & Kitchen',
    'Sports & Outdoors',
    'Beauty & Personal Care',
  ];

  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutApiCall] = useLogoutMutation();

  // Logout handler
  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logoutAndResetCart());
      navigate('/login');
      setIsProfileOpen(false);
    } catch (err) {
      showErrorToast(err?.data?.message || err.error || 'Failed to logout');
      console.error('Logout error:', err);
    }
  };

  // Category selection
  const handleCategorySelect = (category) => {
    if (!category || category === 'All Products') {
      navigate('/');
    } else {
      navigate(`/category/${category}`);
    }
    setIsCategoryOpen(false);
    setIsMenuOpen(false);
  };

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (categoryRef.current && !categoryRef.current.contains(event.target)) {
        setIsCategoryOpen(false);
      }
      if (isMenuOpen && mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  return (
    <header className="bg-gray-900 text-white shadow-md w-full">
      {/* Top row */}
      <div className="flex items-center justify-between h-20 px-4">
        {/* Logo */}
        <Link to="/">
          <span className="text-3xl text-white uppercase  font-bold">
            ShopName
          </span>
        </Link>

        {/* Search (Desktop) */}
        <div className="hidden md:flex justify-center flex-1 mx-4">
          <SearchBox />
        </div>

        {/* Cart & Profile (Desktop) */}
        <div className="hidden md:flex items-center space-x-4">
          <Link to="/cart" className="flex items-center text-white hover:text-primary">
            <div className="relative">
              <FaShoppingCart className="text-xl" />
              {cartItems.length > 0 && userInfo && (
                <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItems.reduce((acc, item) => acc + item.qty, 0)}
                </span>
              )}
            </div>
            <span className="ml-2">Cart</span>
          </Link>

          {userInfo ? (
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center text-white hover:text-primary"
              >
                <FaUser className="text-xl" />
                <span className="ml-2">{userInfo.name}</span>
              </button>
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-black hover:bg-gray-100"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    My Profile
                  </Link>
                  <Link
                    to="/wishlist"
                    className="block px-4 py-2 text-black hover:bg-gray-100"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    My Wishlist
                  </Link>
                  <Link
                    to="/orders"
                    className="block px-4 py-2 text-black hover:bg-gray-100"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    My Orders
                  </Link>
                  {userInfo.isAdmin && (
                    <Link
                      to="/admin/dashboard"
                      className="block px-4 py-2 text-black hover:bg-gray-100"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      Dashboard
                    </Link>
                  )}
                  <button
                    onClick={logoutHandler}
                    className="block w-full text-left px-4 py-2 text-black hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="flex items-center text-white hover:text-primary">
              <FaUser className="text-xl" />
              <span className="ml-2">Sign In</span>
            </Link>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden flex items-center space-x-4">
          <Link to="/cart" className="flex items-center text-white hover:text-primary">
            <div className="relative">
              <FaShoppingCart className="text-xl" />
              {cartItems.length > 0 && userInfo && (
                <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItems.reduce((acc, item) => acc + item.qty, 0)}
                </span>
              )}
            </div>
          </Link>
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white">
            {isMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Categories (Desktop) */}
      <div className="border-gray-700 hidden md:block">
      <div className="relative flex items-center h-12 px-4" ref={categoryRef}>
        <button
          onClick={() => setIsCategoryOpen(!isCategoryOpen)}
          className={`flex items-center text-white hover:text-secondary px-3 py-2 rounded-md font-bold transition duration-300 ${
            isCategoryOpen ? 'bg-gray-700' : ''
          }`}
        >
          <span className= "text-xl">Categories</span>
          <FaChevronDown
            className={`ml-1 transition-transform ${isCategoryOpen ? 'rotate-180' : ''}`}
          />
        </button>
        {isCategoryOpen && (
          <div className="absolute top-[calc(100%_+_4px)] left-4 w-48 bg-white rounded-md shadow-lg py-1 z-50 transition-all duration-200 ease-in-out">
            <button
              onClick={() => {
                handleCategorySelect('');
                setIsCategoryOpen(false);
              }}
              className="block w-full text-left px-4 py-2 text-black hover:bg-gray-100 hover:text-primary hover:font-bold transition duration-200"
            >
              All Products
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => {
                  handleCategorySelect(category);
                  setIsCategoryOpen(false);
                }}
                className="block w-full text-left px-4 py-2 text-black hover:bg-gray-100 hover:text-primary hover:font-bold transition duration-200"
              >
                {category}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div ref={mobileMenuRef} className="md:hidden py-4 bg-gray-900 px-4">
          <SearchBox />

          <div className="mt-4 border-t border-b border-gray-600 py-2">
            <h2 className="text-xl text-center text-white">Categories</h2>
            <div className="space-y-2">
              <button
                onClick={() => handleCategorySelect('')}
                className="block w-full text-left text-white hover:text-primary"
              >
                All Products
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategorySelect(category)}
                  className="block w-full text-left text-white hover:text-primary"
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <nav className="mt-4 space-y-4">
            {userInfo ? (
              <>
                <Link
                  to="/profile"
                  className="block text-white hover:text-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  My Profile
                </Link>
                <Link
                  to="/wishlist"
                  className="block text-white hover:text-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  My Wishlist
                </Link>
                <Link
                  to="/orders"
                  className="block text-white hover:text-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  My Orders
                </Link>
                {userInfo.isAdmin && (
                  <Link
                    to="/admin/dashboard"
                    className="block text-white hover:text-primary"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                )}
                <button
                  onClick={() => {
                    logoutHandler();
                    setIsMenuOpen(false);
                  }}
                  className="block text-white hover:text-primary"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="block text-white hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign In
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
