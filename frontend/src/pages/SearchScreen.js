import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useGetProductsQuery } from '../slices/productsApiSlice';
import ProductCard from '../components/products/ProductCard';
import Loader from '../components/layout/Loader';
import Message from '../components/layout/Message';
import { FaArrowLeft } from 'react-icons/fa';

const SearchScreen = () => {
  const { keyword, pageNumber = 1 } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, error } = useGetProductsQuery({
    keyword,
    pageNumber,
  });

  // Function to handle page changes
  const handlePageChange = (page) => {
    navigate(`/search/${keyword}/page/${page}`);
  };

  return (
    <>
      <Link to="/" className="btn btn-light mb-4 flex items-center">
        <FaArrowLeft className="mr-2" /> Back to Home
      </Link>
      
      <h1 className="text-2xl font-bold mb-4">
        {keyword ? `Search Results for "${keyword}"` : 'All Products'}
      </h1>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="error">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <>
          {data.products.length === 0 ? (
            <Message variant="info">
              No products found for "{keyword}"
            </Message>
          ) : (
            <>
              <div className="mb-4">
                <p className="text-gray-600">
                  {data.products.length} {data.products.length === 1 ? 'result' : 'results'} found
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {data.products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
              
              {/* Pagination */}
              {data.pages > 1 && (
                <div className="flex justify-center mt-6">
                  <ul className="flex space-x-2">
                    {[...Array(data.pages).keys()].map((x) => (
                      <li key={x + 1}>
                        <button
                          onClick={() => handlePageChange(x + 1)}
                          className={`px-3 py-1 rounded ${
                            x + 1 === data.page
                              ? 'bg-primary text-white'
                              : 'bg-gray-200 hover:bg-gray-300'
                          }`}
                        >
                          {x + 1}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
        </>
      )}
    </>
  );
};

export default SearchScreen;