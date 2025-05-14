import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { FaEdit, FaTrash, FaPlus, FaSearch, FaExclamationTriangle } from 'react-icons/fa';
import { 
  useGetProductsQuery, 
  useDeleteProductMutation,
  useGetLowStockProductsQuery
} from '../../slices/productsApiSlice';
import Loader from '../../components/layout/Loader';
import Message from '../../components/layout/Message';
import Paginate from '../../components/layout/Paginate';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { showSuccessToast, showErrorToast } from '../../utils/toastUtils';

const AdminProductListPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const pageNumber = Number(searchParams.get('page')) || 1;
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);
  
  const { data, isLoading, error, refetch } = useGetProductsQuery({
    pageNumber,
  });
  
  const { data: lowStockProducts, isLoading: isLoadingLowStock } = useGetLowStockProductsQuery();
  
  const [deleteProduct, { isLoading: loadingDelete }] = useDeleteProductMutation();
  
  // Filter products when data or search term changes
  useEffect(() => {
    if (data?.products) {
      let filtered = [...data.products];
      
      // Apply search filter
      if (searchTerm.trim() !== '') {
        const lowercaseSearch = searchTerm.toLowerCase();
        filtered = filtered.filter(
          (product) => 
            product.name.toLowerCase().includes(lowercaseSearch) ||
            product.brand.toLowerCase().includes(lowercaseSearch) ||
            product.category.toLowerCase().includes(lowercaseSearch)
        );
      }
      
      // Apply low stock filter if enabled
      if (showLowStockOnly && lowStockProducts) {
        const lowStockIds = lowStockProducts.map(p => p._id);
        filtered = filtered.filter(product => lowStockIds.includes(product._id));
      }
      
      setFilteredProducts(filtered);
    }
  }, [data, searchTerm, lowStockProducts, showLowStockOnly]);
  
  // Check if a product is low in stock
  const isLowStock = (productId) => {
    if (!lowStockProducts) return false;
    return lowStockProducts.some(p => p._id === productId);
  };
  
  // Update page number in the URL
  const handlePageChange = (newPage) => {
    setSearchParams({ page: newPage });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const createProductHandler = () => {
    navigate('/admin/product/create');
  };
  
  const deleteHandler = (id) => {
    confirmAlert({
      title: 'Confirm Deletion',
      message: 'Are you sure you want to delete this product?',
      buttons: [
        {
          label: 'Yes',
          onClick: async () => {
            try {
              // Ensure the ID is properly formatted
              const cleanId = id.toString().trim();
              await deleteProduct(cleanId).unwrap();
              await refetch(); // Refresh the product list
              showSuccessToast('Product deleted successfully');
            } catch (err) {
              console.error('Delete error:', err);
              showErrorToast(
                err?.data?.message || 
                err.error || 
                'Failed to delete product'
              );
            }
          }
        },
        {
          label: 'No',
          onClick: () => {}
        }
      ]
    });
  };
  
  return (
    <div className="admin-product-list">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold">Products</h1>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          
          <button
            onClick={createProductHandler}
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition duration-300 flex items-center justify-center"
          >
            <FaPlus className="mr-2" /> Create Product
          </button>
        </div>
      </div>
      
      {/* Low Stock Alert Banner */}
      {lowStockProducts && lowStockProducts.length > 0 && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded-md">
          <div className="flex items-center">
            <FaExclamationTriangle className="text-yellow-600 mr-3" />
            <div>
              <p className="font-medium text-yellow-700">
                {lowStockProducts.length} {lowStockProducts.length === 1 ? 'product' : 'products'} with low stock
              </p>
              <div className="flex mt-2">
                <button 
                  onClick={() => setShowLowStockOnly(!showLowStockOnly)}
                  className={`mr-3 px-3 py-1 rounded-md text-sm ${
                    showLowStockOnly 
                      ? 'bg-yellow-200 text-yellow-800' 
                      : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                  }`}
                >
                  {showLowStockOnly ? 'Show All Products' : 'Show Low Stock Only'}
                </button>
                <Link 
                  to="/admin/low-stock" 
                  className="px-3 py-1 bg-yellow-100 text-yellow-700 hover:bg-yellow-200 rounded-md text-sm"
                >
                  View Detailed Report
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {loadingDelete && <Loader />}

      {isLoading || isLoadingLowStock ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error || 'An error occurred'}
        </Message>
      ) : (
        <>
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Brand
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <tr key={product._id} className={`hover:bg-gray-50 ${isLowStock(product._id) ? 'bg-yellow-50' : ''}`}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product._id.substring(0, 8)}...
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <img 
                            className="h-10 w-10 rounded-full object-cover" 
                            src={product.image} 
                            alt={product.name} 
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 flex items-center">
                            {product.name}
                            {isLowStock(product._id) && (
                              <FaExclamationTriangle className="ml-2 text-yellow-500" title="Low Stock" />
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      GH₵{product.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.brand}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        isLowStock(product._id) 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : product.countInStock > 0 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                      }`}>
                        {product.countInStock > 0 ? `${product.countInStock} in stock` : 'Out of stock'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Link
                          to={`/admin/product/${product._id}/edit`}
                          className="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-50"
                        >
                          <FaEdit className="text-lg" />
                        </Link>
                        <button
                          onClick={() => deleteHandler(product._id)}
                          className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                        >
                          <FaTrash className="text-lg" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Show product count summary */}
          <div className="mt-4 text-sm text-gray-500">
            Showing {filteredProducts.length} of {data.products.length} products
            {searchTerm && ` (filtered by "${searchTerm}")`}
            {showLowStockOnly && ' (showing low stock only)'}
          </div>
          
          {data?.pages > 1 && !searchTerm && !showLowStockOnly && (
            <div className="mt-6">
              <Paginate 
                pages={data.pages} 
                page={pageNumber}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminProductListPage;
