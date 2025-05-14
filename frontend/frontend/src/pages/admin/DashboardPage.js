import React from 'react';
import { useGetUsersQuery } from '../../slices/usersApiSlice';
import { useGetOrdersQuery } from '../../slices/ordersApiSlice';
import { useGetProductsQuery } from '../../slices/productsApiSlice';
import Loader from '../../components/layout/Loader';

const DashboardPage = () => {
  const { data: users, isLoading: loadingUsers } = useGetUsersQuery();
  const { data: orders, isLoading: loadingOrders } = useGetOrdersQuery();
  const { data: products, isLoading: loadingProducts } = useGetProductsQuery();

  if (loadingUsers || loadingOrders || loadingProducts) {
    return <Loader />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Users</h2>
          <p className="text-3xl font-bold text-blue-600">{users?.length || 0}</p>
          <p className="text-gray-600">Total Users</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Orders</h2>
          <p className="text-3xl font-bold text-green-600">{orders?.length || 0}</p>
          <p className="text-gray-600">Total Orders</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Products</h2>
          <p className="text-3xl font-bold text-purple-600">{products?.length || 0}</p>
          <p className="text-gray-600">Total Products</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;