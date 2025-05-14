import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaHeart, FaRegHeart, FaShoppingCart, FaArrowRight } from 'react-icons/fa';
import { addToCart } from '../../slices/cartSlice';
import { useAddToWishlistMutation, useRemoveFromWishlistMutation, useGetWishlistQuery } from '../../slices/usersApiSlice';
import { showSuccessToast, showErrorToast } from '../../utils/toastConfig';
import Rating from './Rating';
import { checkAdminAndNotify } from '../../utils/adminUtils';

// Helper function to create a URL slug
const createSlug = (name) => {
  if (!name) return 'product';
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-'); // Replace multiple hyphens with single hyphen
};


const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Get auth state to check if user is logged in
  const { userInfo } = useSelector((state) => state.auth);

  // Get wishlist to check if product is in wishlist
  const { data: wishlistItems = [], refetch } = useGetWishlistQuery(undefined, {
    skip: !userInfo, // Skip the query if user is not logged in
  });

  // Function to check if the current product is in the wishlist
  const isInWishlist = () => {
    if (!wishlistItems || wishlistItems.length === 0) return false;
    return wishlistItems.some((item) => item._id === product._id);
  };

  const [addToWishlist] = useAddToWishlistMutation();
  const [removeFromWishlist] = useRemoveFromWishlistMutation();

  const handleAddToCart = (e) => {
    // Prevent the click from bubbling up to the parent (card) element
    e.stopPropagation();
    
    // Check if user is admin and show message if needed
    if (checkAdminAndNotify(userInfo, navigate, 'add items to cart')) {
      return;
    }
    
    // If user is not logged in, redirect to login page
    if (!userInfo) {
      navigate(`/login?redirect=/product/${product._id}`);
      showErrorToast('Please login to add items to your cart');
      return;
    }

    dispatch(addToCart({ ...product, qty: 1 }));
    showSuccessToast(`${product.name} added to cart`);
  };

  const handleWishlistToggle = async (e) => {
    e.stopPropagation();
    
    // Check if user is admin and show message if needed
    if (checkAdminAndNotify(userInfo, navigate, 'add items to wishlist')) {
      return;
    }
    
    // If user is not logged in, redirect to login page
    if (!userInfo) {
      navigate(`/login?redirect=/product/${product._id}`);
      showErrorToast('Please login to add items to your wishlist');
      return;
    }

    try {
      if (isInWishlist()) {
        await removeFromWishlist(product._id).unwrap();
        showSuccessToast(`${product.name} removed from wishlist`);
      } else {
        await addToWishlist(product._id).unwrap();
        showSuccessToast(`${product.name} added to wishlist`);
      }
      // Manually refetch the wishlist data after adding/removing
      refetch();
    } catch (err) {
      showErrorToast(err?.data?.message || 'Something went wrong');
    }
  };

  const navigateToProduct = () => {
    // Generate the slug from the product name
    const slug = createSlug(product.name);
    navigate(`/product/${product._id}/${slug}`);
  };

  return (
    <div
      className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 transition-all duration-300 hover:shadow-xl hover:transform hover:scale-[1.02] cursor-pointer"
      onClick={navigateToProduct} // Use the updated navigation function
    >
      <div className="relative overflow-hidden">
        <div className="w-full h-64 overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
          />
        </div>
        
        {/* Wishlist button positioned on top of the image */}
        <button
          onClick={handleWishlistToggle}
          className={`absolute top-2 right-2 p-2 bg-white bg-opacity-70 rounded-full transition-colors ${
            isInWishlist() ? 'text-red-500' : 'text-gray-600 hover:text-red-500'
          }`}
          aria-label={isInWishlist() ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          {isInWishlist() ? <FaHeart size={20} /> : <FaRegHeart size={20} />}
        </button>
      </div>

      <div className="p-4 border-t border-gray-200">
        {/* Use Link component with the new URL structure */}
        <Link to={`/product/${product._id}/${createSlug(product.name)}`}>
           <h3 className="text-lg font-bold text-gray-800 mb-1 hover:text-primary">{product.name}</h3>
        </Link>

        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {product.description ? product.description.substring(0, 80) : 'No description available'}
        </p>

        <div className="mt-4">
          <Rating value={product.rating} text={`${product.numReviews} reviews`} />
          <p className="text-xl font-bold text-primary mt-2">
            GH₵{parseFloat(product.price).toFixed(2)}
          </p>

          <div className="flex justify-between items-center mt-3">
            <button
              onClick={handleAddToCart}
              className="flex items-center bg-primary text-white px-3 py-2 rounded-md hover:bg-primary-dark transition-colors z-10"
            >
              <FaShoppingCart className="mr-2" />
              Add to Cart
            </button>

            {/* Update the Explore button to use the new navigate function */}
            <button
              onClick={(e) => {
                e.stopPropagation(); // Prevent card click
                navigateToProduct(); // Use the updated navigation function
              }}
              className="flex items-center text-primary hover:text-primary-dark transition-colors"
            >
              Explore <FaArrowRight className="ml-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;