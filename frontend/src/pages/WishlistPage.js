import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { useGetWishlistQuery, useRemoveFromWishlistMutation } from '../slices/usersApiSlice';
import Loader from '../components/layout/Loader';
import Message from '../components/layout/Message';
import { FaTrash, FaShoppingCart, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { addToCart } from '../slices/cartSlice';
import Rating from '../components/products/Rating';
import { showSuccessToast, showErrorToast } from '../utils/toastUtils';

const WishlistPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.auth);

  // Redirect admin users to dashboard
  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      toast.error('Admin users cannot access the wishlist');
      navigate('/admin/dashboard');
    }
  }, [userInfo, navigate]);

  const {
    data: wishlistItems = [],
    isLoading,
    error,
    refetch,
  } = useGetWishlistQuery(undefined, {
    skip: !userInfo,
  });

  const [removeFromWishlist] = useRemoveFromWishlistMutation();

  const removeFromWishlistHandler = async (productId) => {
    try {
      await removeFromWishlist(productId).unwrap();
      showSuccessToast('Product removed from wishlist');
      refetch();
    } catch (err) {
      showErrorToast(err?.data?.message || err.error || 'Failed to remove from wishlist');
    }
  };

  const addToCartHandler = (product) => {
    dispatch(addToCart({ ...product, qty: 1 }));
    showSuccessToast(`${product.name} added to cart`);
  };

  if (!userInfo) {
    return (
      <Message variant="info">
        Please <Link to="/login" className="text-primary hover:underline">sign in</Link> to view your wishlist.
      </Message>
    );
  }

  return (
    <>
      <Link to="/" className="flex items-center text-primary mb-4 hover:underline">
        <FaArrowLeft className="mr-2" /> Back to Products
      </Link>

      <h1 className="text-3xl font-bold mb-6">My Wishlist</h1>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="error">{error?.data?.message || error.error}</Message>
      ) : !Array.isArray(wishlistItems) || wishlistItems.length === 0 ? (
        <Message variant="info">
          Your wishlist is empty. <Link to="/" className="text-primary hover:underline">Go Shopping</Link>
        </Message>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistItems.map((product) => {
            if (!product) return null;

            return (
              <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
                <div className="relative">
                  <Link to={`/product/${product._id}`}>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-64 object-cover"
                    />
                  </Link>
                </div>

                <div className="p-4 border-t border-gray-200">
                  <h3 className="text-lg font-bold text-gray-800 mb-1">{product.name}</h3>

                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {product.description ? product.description.substring(0, 80) : 'No description available'}
                  </p>

                  <div className="mt-4">
                    <p className="text-xl font-bold text-primary">
                      <Rating value={product.rating} text={`${product.numReviews} reviews`} />
                      GH₵{parseFloat(product.price).toFixed(2)}
                    </p>

                    <div className="flex justify-between items-center mt-3">
                      <button
                        onClick={() => addToCartHandler(product)}
                        className="flex items-center bg-primary text-white px-3 py-2 rounded-md hover:bg-primary-dark transition-colors"
                      >
                        <FaShoppingCart className="mr-2" />
                        Add to Cart
                      </button>

                      <Link to={`/product/${product._id}`} className="flex items-center text-primary hover:underline">
                        Explore <FaArrowRight className="ml-1" />
                      </Link>

                      <button
                        onClick={() => removeFromWishlistHandler(product._id)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};

export default WishlistPage;
