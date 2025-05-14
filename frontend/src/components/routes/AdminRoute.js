import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AdminRoute = ({ children }) => {
  const { userInfo } = useSelector((state) => state.auth);

  return userInfo && userInfo.isAdmin ? (
    children ? children : <Outlet />
  ) : (
    <Navigate to='/login' replace />
  );
};

export default AdminRoute;