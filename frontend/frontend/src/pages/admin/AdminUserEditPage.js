import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FaArrowLeft, FaSave } from 'react-icons/fa';
import { 
  useGetUserDetailsQuery, 
  useUpdateUserMutation 
} from '../../slices/usersApiSlice';
import Loader from '../../components/layout/Loader';
import Message from '../../components/layout/Message';
import { showSuccessToast, showErrorToast } from '../../utils/toastUtils';

const AdminUserEditPage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  
  const { data: user, isLoading, error, refetch } = useGetUserDetailsQuery(userId, {
    skip: !userId,
    refetchOnMountOrArgChange: true
  });
  
  const [updateUser, { isLoading: loadingUpdate }] = useUpdateUserMutation();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setIsAdmin(user.isAdmin || false);
    }
  }, [user]);
  
  const submitHandler = async (e) => {
    e.preventDefault();
    
    const updateData = {
      userId,
      name,
      email,
      isAdmin,
    };
    
    try {
      const result = await updateUser(updateData);
      console.log('Update response:', result);
      showSuccessToast('User updated successfully');
      refetch();
      navigate('/admin/users');
    } catch (err) {
      console.error('Update error:', err);
      showErrorToast(err?.data?.message || err.error || 'An error occurred');
    }
  };
  
  return (
    <div className="admin-user-edit">
      <Link to="/admin/users" className="flex items-center text-primary mb-4 hover:underline">
        <FaArrowLeft className="mr-1" /> Back to Users
      </Link>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6">Edit User</h1>
        
        {loadingUpdate && <Loader />}
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">
            {error?.data?.message || error.error || 'An error occurred'}
          </Message>
        ) : (
          <form onSubmit={submitHandler} className="max-w-md">
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isAdmin"
                  checked={isAdmin}
                  onChange={(e) => setIsAdmin(e.target.checked)}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label htmlFor="isAdmin" className="ml-2 block text-sm text-gray-900">
                  Admin
                </label>
              </div>
            </div>
            
            <div className="mt-6">
              <button
                type="submit"
                className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition duration-300 flex items-center justify-center"
                disabled={loadingUpdate}
              >
                <FaSave className="mr-2" /> Save Changes
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AdminUserEditPage;