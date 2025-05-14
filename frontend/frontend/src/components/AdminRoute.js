import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Loader from './layout/Loader';
import Message from './layout/Message';

const AdminRoute = ({ children }) => {
  const { userInfo, isLoading, error } = useSelector((state) => state.auth);

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <Message variant="danger">{error}</Message>;
  }

  if (!userInfo || !userInfo.isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return children ? children : <Outlet />;
};

export default AdminRoute;