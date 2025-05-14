import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const CustomerRoute = () => {
  const { userInfo } = useSelector((state) => state.auth);

  // If user is an admin, redirect to admin dashboard
  if (userInfo && userInfo.isAdmin) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <Outlet />;
};

export default CustomerRoute;