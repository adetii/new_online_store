import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useGetProductsQuery, useDeleteProductMutation } from '../../slices/productsApiSlice';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import Loader from '../../components/layout/Loader';
import Message from '../../components/layout/Message';
import Paginate from '../../components/layout/Paginate';

const ProductListScreen = () => {
  // Use useSearchParams to manage URL search parameters
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Derive pageNumber from URL search params, defaulting to 1 if not present
  const pageNumber = Number(searchParams.get('page')) || 1;

  // Fetch products using the derived pageNumber
  const { data, isLoading, error, refetch } = useGetProductsQuery({ pageNumber });

  // Mutation hook for deleting a product
  const [deleteProduct] = useDeleteProductMutation();

  // Handler for deleting a product
  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id);
        // Refetch data to update the list after deletion
        refetch();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Products</h1>
        <Link
          to="/admin/product/create"
          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark flex items-center"
        >
          <FaPlus className="mr-2" /> Create Product
        </Link>
      </div>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="error">{error?.data?.message || error.error}</Message>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">ID</th>
                  <th className="px-6 py-3 text-left">NAME</th>
                  <th className="px-6 py-3 text-left">PRICE</th>
                  <th className="px-6 py-3 text-left">CATEGORY</th>
                  <th className="px-6 py-3 text-left">STOCK</th>
                  <th className="px-6 py-3 text-left"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data.products.map((product) => (
                  <tr key={product._id}>
                    <td className="px-6 py-4">{product._id}</td>
                    <td className="px-6 py-4">{product.name}</td>
                    <td className="px-6 py-4">${product.price}</td>
                    <td className="px-6 py-4">{product.category}</td>
                    <td className="px-6 py-4">{product.countInStock}</td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-4">
                        <Link
                          to={`/admin/product/${product._id}/edit`}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <FaEdit />
                        </Link>
                        <button
                          onClick={() => deleteHandler(product._id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {data.pages > 1 && (
            <div className="pagination-container mt-4 flex justify-center">
              {[...Array(data.pages).keys()].map((x) => (
                <button
                  key={x + 1}
                  onClick={() => setSearchParams({ page: x + 1 })}
                  className={`mx-1 px-4 py-2 border rounded ${
                    x + 1 === pageNumber ? 'bg-primary text-white' : 'bg-white'
                  }`}
                >
                  {x + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProductListScreen;