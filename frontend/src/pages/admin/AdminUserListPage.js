import React, { useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FaEdit, FaTrash, FaCheck, FaTimes, FaSearch } from 'react-icons/fa';
import { useGetUsersQuery, useDeleteUserMutation } from '../../slices/usersApiSlice';
import Loader from '../../components/layout/Loader';
import Message from '../../components/layout/Message';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { showSuccessToast, showErrorToast } from '../../utils/toastUtils';

const AdminUserListPage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: users = [], isLoading, error, refetch } = useGetUsersQuery();
  const [deleteUser, { isLoading: loadingDelete }] = useDeleteUserMutation();

  const filteredUsers = useMemo(
    () => users.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    ),
    [users, searchTerm]
  );

  const deleteHandler = useCallback((id) => {
    confirmAlert({
      title: 'Confirm Deletion',
      message: 'Are you sure you want to delete this user?',
      buttons: [
        {
          label: 'Yes',
          onClick: async () => {
            try {
              await deleteUser(id).unwrap();
              await refetch();
              showSuccessToast('User deleted successfully');
            } catch (err) {
              showErrorToast(err?.data?.message || err.error || 'An error occurred');
            }
          }
        },
        { label: 'No' }
      ]
    });
  }, [deleteUser, refetch]);

  if (isLoading || loadingDelete) return <Loader />;

  return (
    <div className="admin-user-list">
      <h1 className="text-2xl font-bold mb-6">Users</h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="relative w-full md:w-64 mb-6">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>

        {error && (
          <Message variant="danger">
            {error?.data?.message || error.error || 'An error occurred'}
          </Message>
        )}

        {!error && filteredUsers.length === 0 && (
          <Message>No users found</Message>
        )}

        {!error && filteredUsers.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Admin</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user._id.substring(0,8)}...</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <a href={`mailto:${user.email}`} className="text-primary hover:underline">{user.email}</a>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {user.isAdmin ? <FaCheck className="text-green-500" /> : <FaTimes className="text-red-500" />}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex space-x-4">
                      <Link to={`/admin/users/${user._id}/edit`}>Edit</Link>
                      <button
                        onClick={() => deleteHandler(user._id)}
                        className={`text-red-600 hover:text-red-900 ${user.isAdmin ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={user.isAdmin}
                      >
                        <FaTrash className="text-lg" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUserListPage;
