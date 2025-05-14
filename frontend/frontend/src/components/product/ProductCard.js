// import React from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';
// import { FaHeart, FaRegHeart, FaShoppingCart, FaArrowRight } from 'react-icons/fa';
// import { useAddToWishlistMutation, useRemoveFromWishlistMutation, useGetWishlistQuery } from '../../slices/wishlistApiSlice';
// import { addToCart } from '../../slices/cartSlice';
// import { showSuccessToast, showErrorToast } from '../../utils/toastConfig';

// const ProductCard = ({ product }) => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
  
//   // Get auth state to check if user is logged in
//   const { userInfo } = useSelector((state) => state.auth);
  
//   // Get wishlist to check if product is in wishlist
//   const { data: wishlistItems = [] } = useGetWishlistQuery(undefined, {
//     skip: !userInfo, // Skip the query if user is not logged in
//   });
  
//   // Function to check if the current product is in the wishlist
//   const isInWishlist = () => {
//     if (!wishlistItems || wishlistItems.length === 0) return false;
//     return wishlistItems.some(item => item._id === product._id);
//   };
  
//   const [addToWishlist] = useAddToWishlistMutation();
//   const [removeFromWishlist] = useRemoveFromWishlistMutation();

//   const handleWishlistToggle = async () => {
//     if (!userInfo) {
//       showErrorToast('Please login to add items to wishlist');
//       navigate('/login');
//       return;
//     }

//     try {
//       if (isInWishlist()) {
//         await removeFromWishlist(product._id);
//         showSuccessToast('Removed from wishlist');
//       } else {
//         await addToWishlist(product._id);
//         showSuccessToast('Added to wishlist');
//       }
//     } catch (err) {
//       showErrorToast(err?.data?.message || 'Something went wrong');
//     }
//   };

//   const handleAddToCart = () => {
//     dispatch(addToCart({
//       ...product,
//       qty: 1,
//     }));
//     showSuccessToast('Added to cart');
//   };

//   return (
//     <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
//       <div className="relative">
//         <Link to={`/product/${product._id}`}>
//           <img
//             src={product.image}
//             alt={product.name}
//             className="w-full h-64 object-contain p-4"
//           />
//         </Link>
//         <button
//           onClick={handleWishlistToggle}
//           className="absolute top-2 right-2 p-2 rounded-full bg-white shadow-md hover:bg-gray-100 transition-colors"
//         >
//           {isInWishlist() ? (
//             <FaHeart className="text-xl text-red-500" />
//           ) : (
//             <FaRegHeart className="text-xl text-gray-400" />
//           )}
//         </button>
//       </div>

//       <div className="p-4 border-t border-gray-200">
//         <h3 className="text-lg font-bold text-gray-800 mb-1">{product.name}</h3>
        
//         <p className="text-sm text-gray-600 mb-3 line-clamp-2">
//           {product.description ? product.description.substring(0, 80) : 'No description available'}
//         </p>
        
//         <div className="mt-4">
//           <p className="text-xl font-bold text-primary">
//             GH₵{parseFloat(product.price).toFixed(2)}
//           </p>
          
//           <div className="flex justify-between items-center mt-3">
//             <button 
//               onClick={handleAddToCart}
//               className="flex items-center bg-primary text-white px-3 py-2 rounded-md hover:bg-primary-dark transition-colors"
//             >
//               <FaShoppingCart className="mr-2" />
//               Add to Cart
//             </button>
            
//             <Link 
//               to={`/product/${product._id}`} 
//               className="flex items-center text-primary hover:underline"
//             >
//               Explore <FaArrowRight className="ml-1" />
//             </Link>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductCard;