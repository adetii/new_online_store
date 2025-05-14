import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaBox, 
  FaShoppingCart, 
  FaUsers, 
  FaChartLine, 
  FaArrowUp, 
  FaArrowDown,
  FaEllipsisH
} from 'react-icons/fa';
import { useGetProductsQuery } from '../../slices/productsApiSlice';
import { useGetOrdersQuery } from '../../slices/ordersApiSlice';
import { useGetUsersQuery } from '../../slices/usersApiSlice';
import Loader from '../../components/layout/Loader';
import Message from '../../components/layout/Message';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AdminDashboardPage = () => {
  const { data: products, isLoading: loadingProducts } = useGetProductsQuery({});
  const { data: ordersData, isLoading: loadingOrders } = useGetOrdersQuery({});
  const { data: users, isLoading: loadingUsers } = useGetUsersQuery();

  // Ensure we correctly access the orders array regardless of response structure
  const orders = ordersData?.orders || ordersData || [];

  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    paidOrders: 0,
    deliveredOrders: 0,
    salesData: [],
  });

  useEffect(() => {
    if (orders && orders.length > 0) {
      const totalSales = orders.reduce((sum, order) => {
        return order.isPaid ? sum + order.totalPrice : sum;
      }, 0);

      const paidOrders = orders.filter(order => order.isPaid).length;
      const deliveredOrders = orders.filter(order => order.isDelivered).length;

      // Create sales data for chart (last 7 days)
      const last7Days = [...Array(7)].map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        return d.toISOString().split('T')[0];
      }).reverse();

      const salesData = last7Days.map(date => {
        const dayOrders = orders.filter(order => 
          order.isPaid && order.createdAt.split('T')[0] === date
        );
        const daySales = dayOrders.reduce((sum, order) => sum + order.totalPrice, 0);
        return {
          name: date.split('-').slice(1).join('/'), // Format as MM/DD
          sales: daySales
        };
      });

      setStats({
        totalSales,
        totalOrders: orders.length,
        paidOrders,
        deliveredOrders,
        salesData,
      });
    }
  }, [orders]);

  const isLoading = loadingProducts || loadingOrders || loadingUsers;

  if (isLoading) return <Loader />;

  // Helper to generate CSV and trigger download
  const handleGenerateReport = () => {
    let csv = 'Dashboard Report\n\n';
    csv += `Total Revenue,GH₵${stats.totalSales.toFixed(2)}\n`;
    csv += `Total Products,${products?.totalProducts || products?.products?.length || 0}\n`;
    csv += `Total Orders,${orders.length}\n`;
    csv += `Total Users,${users?.length || 0}\n\n`;

    csv += 'Recent Orders\n';
    csv += 'Order ID,Customer,Customer Email,Date,Status,Paid,Delivered,Total\n';
    orders.slice(0, 5).forEach(order => {
      csv += `#${order._id.substring(0,8)},${order.user ? order.user.name : 'User deleted'},${order.user ? order.user.email : ''},${new Date(order.createdAt).toLocaleDateString()},${order.status || ''},${order.isPaid ? 'Yes' : 'No'},${order.isDelivered ? 'Yes' : 'No'},GH₵${order.totalPrice.toFixed(2)}\n`;
    });

    csv += '\nRecent Products\n';
    csv += 'Product,Brand,Category,Price,Stock,Low Stock Threshold\n';
    (products?.products || []).slice(0, 5).forEach(product => {
      csv += `${product.name},${product.brand},${product.category},GH₵${product.price.toFixed(2)},${product.countInStock > 0 ? `${product.countInStock} in stock` : 'Out of stock'},${product.lowStockThreshold ?? ''}\n`;
    });

    // Add UTF-8 BOM here
    const BOM = "\uFEFF";
    const blob = new Blob([BOM + csv], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dashboard_report_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="admin-dashboard">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div>
          <button
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition duration-300"
            onClick={handleGenerateReport}
          >
            Generate Report
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Revenue Card */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Revenue</p>
              <h2 className="text-2xl font-bold">GH₵{stats.totalSales.toFixed(2)}</h2>
              <p className="text-xs flex items-center mt-1 text-green-500">
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <FaChartLine className="text-green-500 text-xl" />
            </div>
          </div>
        </div>

        {/* Products Card */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Products</p>
              <h2 className="text-2xl font-bold">{products?.totalProducts || products?.products?.length || 0}</h2>
              <p className="text-xs flex items-center mt-1 text-green-500">
              </p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <FaBox className="text-purple-500 text-xl" />
            </div>
          </div>
        </div>

        {/* Orders Card */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Orders</p>
              <h2 className="text-2xl font-bold">{orders.length}</h2>
              <p className="text-xs flex items-center mt-1 text-red-500">
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <FaShoppingCart className="text-blue-500 text-xl" />
            </div>
          </div>
        </div>

        {/* Users Card */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Users</p>
              <h2 className="text-2xl font-bold">{users?.length || 0}</h2>
              <p className="text-xs flex items-center mt-1 text-green-500">
              </p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full">
              <FaUsers className="text-yellow-500 text-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Sales Chart */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Sales Overview</h2>
          <button className="text-gray-500 hover:text-gray-700">
            <FaEllipsisH />
          </button>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={stats.salesData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => [`GH₵${value}`, 'Sales']} />
              <Bar dataKey="sales" fill="#4f46e5" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Recent Orders</h2>
            <Link to="/admin/orders" className="text-primary hover:underline text-sm">
              View All
            </Link>
          </div>
          {orders && orders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.slice(0, 5).map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50">
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                        <Link to={`/order/${order._id}`} className="text-primary hover:underline">
                          #{order._id.substring(0, 8)}
                        </Link>
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                        {order.user ? order.user.name : 'User deleted'}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          order.isPaid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {order.isPaid ? 'Paid' : 'Not Paid'}
                        </span>
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                        GH₵{order.totalPrice.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <Message>No orders found</Message>
          )}
        </div>

        {/* Recent Products */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Recent Products</h2>
            <Link to="/admin/products" className="text-primary hover:underline text-sm">
              View All
            </Link>
          </div>
          {products?.products && products.products.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {products.products.slice(0, 5).map((product) => (
                    <tr key={product._id} className="hover:bg-gray-50">
                      <td className="px-4 py-2 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            <img 
                              className="h-10 w-10 rounded-full object-cover" 
                              src={product.image} 
                              alt={product.name} 
                            />
                          </div>
                          <div className="ml-4">
                            <Link to={`/admin/product/${product._id}/edit`} className="text-sm font-medium text-gray-900 hover:text-primary">
                              {product.name}
                            </Link>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                        GH₵{product.price.toFixed(2)}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          product.countInStock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {product.countInStock > 0 ? `${product.countInStock} in stock` : 'Out of stock'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <Message>No products found</Message>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;