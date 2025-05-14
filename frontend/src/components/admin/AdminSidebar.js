import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FaTachometerAlt, 
  FaShoppingBag, 
  FaBox, 
  FaUsers, 
  FaCreditCard, 
  FaCog, 
  FaSignOutAlt,
  FaBars,
  FaTimes
} from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { logout } from '../../slices/authSlice';

const AdminSidebar = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { path: '/admin/dashboard', name: 'Dashboard', icon: <FaTachometerAlt /> },
    { path: '/admin/productlist', name: 'Products', icon: <FaBox /> },
    { path: '/admin/orderlist', name: 'Orders', icon: <FaShoppingBag /> },
    { path: '/admin/userlist', name: 'Users', icon: <FaUsers /> },
    { path: '/admin/payments', name: 'Payments', icon: <FaCreditCard /> },
    { path: '/admin/settings', name: 'Settings', icon: <FaCog /> },
  ];

  const logoutHandler = () => {
    dispatch(logout());
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={toggleMobileMenu}
          className="p-2 rounded-md bg-primary text-white"
        >
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-gray-900 text-white transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex items-center justify-center h-16 border-b border-gray-800">
          <h1 className="text-xl font-bold">Admin Panel</h1>
        </div>

        <nav className="mt-6">
          <div className="px-4 py-2 text-xs text-gray-400 uppercase">Main</div>
          
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-6 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors ${
                location.pathname === item.path ? 'bg-gray-800 text-white' : ''
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span className="mr-3">{item.icon}</span>
              {item.name}
            </Link>
          ))}
          
          <button
            onClick={logoutHandler}
            className="flex items-center w-full px-6 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
          >
            <span className="mr-3"><FaSignOutAlt /></span>
            Logout
          </button>
        </nav>
      </div>
    </>
  );
};

export default AdminSidebar;