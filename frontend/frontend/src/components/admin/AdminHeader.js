import React from 'react';
import { useSelector } from 'react-redux';
import { FaBell, FaSearch } from 'react-icons/fa';

const AdminHeader = () => {
  const { userInfo } = useSelector((state) => state.auth);

  return (
    <header className="bg-white shadow-sm z-10">
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <h2 className="text-xl font-semibold text-gray-800">Admin Dashboard</h2>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="w-64 pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          
          <div className="relative">
            <button className="text-gray-500 hover:text-gray-700">
              <FaBell className="h-6 w-6" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
                3
              </span>
            </button>
          </div>
          
          <div className="flex items-center">
            <img
              src={userInfo?.avatar || 'https://via.placeholder.com/40'}
              alt="User Avatar"
              className="h-8 w-8 rounded-full object-cover"
            />
            <span className="ml-2 text-gray-700 font-medium">{userInfo?.name}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;