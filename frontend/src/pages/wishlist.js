import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { showSuccessToast, showErrorToast } from '../utils/toastUtils';
import { useGetWishlistQuery, useRemoveFromWishlistMutation } from '../slices/usersApiSlice';
import Loader from '../components/layout/Loader';
import Message from '../components/layout/Message';
import { FaTrash, FaShoppingCart, FaArrowLeft } from 'react-icons/fa';
import { addToCart } from '../slices/cartSlice';
import { useDispatch } from 'react-redux';

const WishlistPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);

  const { data: wishlistItems, isLoading, error, refetch } = useGetWishlistQuery();
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
    dispatch(addToCart({
      ...product,
      qty: 1,
    }));
    showSuccessToast(`${product.name} added to cart`);
  };

  if (!userInfo) {
    return (
      <Message variant="info">
        Please <Link to="/login" className="text-primary hover:underline">sign in</Link> to view your wishlist
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
        <Message variant="error">
          {error?.data?.message || error.error}
        </Message>
      ) : wishlistItems?.length === 0 ? (
        <Message variant="info">
          Your wishlist is empty. <Link to="/" className="text-primary hover:underline">Go Shopping</Link>
        </Message>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistItems.map((product) => (
            <div key={product._id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <Link to={`/product/${product._id}`}>
                <img 
                  src={product.images[0]} 
                  alt={product.name} 
                  className="w-full h-48 object-cover"
                />
              </Link>
              
              <div className="p-4">
                <Link to={`/product/${product._id}`} className="block">
                  <h2 className="text-lg font-semibold mb-2 hover:text-primary">{product.name}</h2>
                </Link>
                
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xl font-bold">GHS{product.price}</span>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    className="flex-1 bg-primary hover:bg-primary-dark text-white py-2 px-4 rounded-md font-medium flex items-center justify-center"
                    onClick={() => addToCartHandler(product)}
                    disabled={product.countInStock === 0}
                  >
                    <FaShoppingCart className="mr-2" />
                    {product.countInStock === 0 ? 'Out of Stock' : 'Add to Cart'}
                  </button>
                  
                  <button
                    className="bg-white border border-red-500 text-red-500 hover:bg-red-50 py-2 px-3 rounded-md"
                    onClick={() => removeFromWishlistHandler(product._id)}
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default WishlistPage;