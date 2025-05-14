import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Loader from '../layout/Loader';

const AdminRoute = () => {
  const { userInfo } = useSelector((state) => state.auth);

  // If not logged in or not an admin, redirect to login
  if (!userInfo || !userInfo.isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;