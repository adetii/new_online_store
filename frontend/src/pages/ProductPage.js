import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useGetProductDetailsQuery, useCreateReviewMutation, useCreateQuestionMutation } from '../slices/productsApiSlice';
import { useRemoveFromWishlistMutation, useGetWishlistQuery } from '../slices/wishlistApiSlice';
import { addToCart } from '../slices/cartSlice';
import Loader from '../components/layout/Loader';
import Message from '../components/layout/Message';
import Rating from '../components/products/Rating';
import ProductTabs from '../components/products/ProductTabs';
import ProductImageGallery from '../components/products/ProductImageGallery';
import { showSuccessToast, showErrorToast } from '../utils/toastUtils';
import { Helmet } from 'react-helmet';
import {
  FaMinus,
  FaPlus,
  FaShoppingCart,
  FaFacebook,
  FaInstagram,
  FaTiktok,
  FaWhatsapp
} from 'react-icons/fa';
import { checkAdminAndNotify } from '../utils/adminUtils';


const ProductPage = () => {
  // Destructure id directly from useParams
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [question, setQuestion] = useState('');
  const [activeImage, setActiveImage] = useState(0);

  const {
    data: product,
    isLoading,
    refetch,
    error,
  } = useGetProductDetailsQuery(productId);

  const { userInfo } = useSelector((state) => state.auth);

  // Get the wishlist items for the current user if logged in
  const { data: wishlistItems = [] } = useGetWishlistQuery(undefined, {
    skip: !userInfo,
  });
  
  const [createReview, { isLoading: loadingReview }] = useCreateReviewMutation();
  const [createQuestion, { isLoading: loadingQuestion }] = useCreateQuestionMutation();
  // Remove FaHeart and FaArrowLeft if not used
  // const [addToWishlist, { isLoading: loadingWishlist }] = useAddToWishlistMutation();
  const [removeFromWishlist] = useRemoveFromWishlistMutation();
  
  // Function to check if the current product is in the wishlist
  const isInWishlist = () => {
    if (!wishlistItems || wishlistItems.length === 0 || !productId) return false;
    return wishlistItems.some(item => item._id === productId);
  };

  // Update the addToCartHandler to check if product is already in cart
  const addToCartHandler = () => {
    // If user is not logged in, redirect to login page
    if (!userInfo) {
      navigate(`/login?redirect=/product/${productId}`);
      showErrorToast('Please login to add items to your cart');
      return;
    }
    
    // Check if product is already in cart
    const cart = JSON.parse(localStorage.getItem('cart')) || { cartItems: [] };
    const isInCart = cart.cartItems.some(item => item._id === productId);
    
    if (isInCart) {
      showErrorToast(`${product.name} is already in your cart`);
      return;
    }

    dispatch(addToCart({ ...product, qty }));
    showSuccessToast(`${product.name} added to cart`);
  };
  
  // Either remove handleWishlistToggle or use it
  // eslint-disable-next-line no-unused-vars
  const handleWishlistToggle = async () => {
    // Check if user is admin and show message if needed
    if (checkAdminAndNotify(userInfo, navigate, 'add items to wishlist')) {
      return;
    }
    
    // function implementation
  };
  
  // Add a new handler for Buy Now functionality
  const buyNowHandler = () => {
    // If user is not logged in, redirect to login page
    if (!userInfo) {
      navigate(`/login?redirect=/product/${productId}`);
      showErrorToast('Please login to purchase this item');
      return;
    }
    
    // Check if user is admin and show message if needed
    if (checkAdminAndNotify(userInfo, navigate, 'proceed to checkout')) {
      return;
    }
    
    // Check if product is already in cart
    const cart = JSON.parse(localStorage.getItem('cart')) || { cartItems: [] };
    const isInCart = cart.cartItems.some(item => item._id === productId);
    
    if (!isInCart) {
      dispatch(addToCart({ ...product, qty }));
    }
    
    navigate('/shipping');
  };

  // Remove this duplicate declaration
  // const [createReview] = useCreateReviewMutation();
  
  const submitReviewHandler = async (e) => {
    e.preventDefault();
    try {
      await createReview({
        productId: product._id,
        rating,
        comment,
      }).unwrap();
      showSuccessToast('Review submitted successfully');
      setRating(0);
      setComment('');
      refetch();
    } catch (err) {
      showErrorToast(err?.data?.message || err.error || 'Something went wrong');
    }
  };

  const submitQuestionHandler = async (e) => {
    e.preventDefault();
    
    try {
      await createQuestion({
        productId,
        question,
      }).unwrap();
      refetch();
      showSuccessToast('Question submitted');
      setQuestion('');
    } catch (err) {
      showErrorToast(err?.data?.message || err.error);
    }
  };

  // Social media sharing functions
  const shareUrl = window.location.href;
  const shareTitle = `Check out ${product?.name} at The Cowries Shop!`;
  
  const shareOnFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
  };
  
  const shareOnWhatsApp = () => {
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareTitle + ' ' + shareUrl)}`, '_blank');
  };
  
  const shareOnInstagram = () => {
    // Instagram doesn't have a direct share URL, but we can open Instagram
    alert('Copy the link to share on Instagram: ' + shareUrl);
    window.open('https://www.instagram.com/', '_blank');
  };
  
  const shareOnTikTok = () => {
    // TikTok doesn't have a direct share URL, but we can open TikTok
    alert('Copy the link to share on TikTok: ' + shareUrl);
    window.open('https://www.tiktok.com/', '_blank');
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="error">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <>
          <Helmet>
            <title>{`${product.name} | The Cowries Shop`}</title>
            <meta name="description" content={product.description ? product.description.substring(0, 160) : `Buy ${product.name} at The Cowries Shop`} />
            
            {/* Open Graph tags for social sharing */}
            <meta property="og:title" content={`${product.name} | The Cowries Shop`} />
            <meta property="og:description" content={product.description ? product.description.substring(0, 160) : `Buy ${product.name} at The Cowries Shop`} />
            <meta property="og:url" content={window.location.href} />
            <meta property="og:type" content="product" />
            <meta property="og:image" content={product.image} />
            
            {/* Twitter Card tags */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={`${product.name} | The Cowries Shop`} />
            <meta name="twitter:description" content={product.description ? product.description.substring(0, 160) : `Buy ${product.name} at The Cowries Shop`} />
            <meta name="twitter:image" content={product.image} />
            
            {/* Product-specific keywords */}
            <meta name="keywords" content={`${product.name}, ${product.category}, ${product.brand}, online shopping, The Cowries Shop, Ghana shopping`} />
            
            {/* JSON-LD structured data for product */}
            <script type="application/ld+json">
              {JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Product",
                "name": product.name,
                "image": product.image,
                "description": product.description,
                "sku": product._id,
                "mpn": product._id,
                "brand": {
                  "@type": "Brand",
                  "name": product.brand
                },
                "offers": {
                  "@type": "Offer",
                  "url": window.location.href,
                  "priceCurrency": "GHS",
                  "price": product.price,
                  "priceValidUntil": new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
                  "itemCondition": "https://schema.org/NewCondition",
                  "availability": product.countInStock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
                },
                "aggregateRating": product.numReviews > 0 ? {
                  "@type": "AggregateRating",
                  "ratingValue": product.rating,
                  "reviewCount": product.numReviews
                } : undefined
              })}
            </script>
          </Helmet>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Image container with fill styling */}
            <div className="flex justify-center items-center border rounded-lg overflow-hidden h-96">
              <img 
                src={product.image} 
                alt={product.name} 
                className="object-cover h-full w-full" 
              />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-4">
                <h1 className="text-3xl font-bold">{product.name}</h1>
                
                {/* Social Media Sharing Buttons */}
                <div className="flex space-x-3">
                  <button 
                    onClick={shareOnFacebook}
                    className="text-blue-600 hover:text-blue-800"
                    aria-label="Share on Facebook"
                  >
                    <FaFacebook size={24} />
                  </button>
                  <button 
                    onClick={shareOnInstagram}
                    className="text-pink-600 hover:text-pink-800"
                    aria-label="Share on Instagram"
                  >
                    <FaInstagram size={24} />
                  </button>
                  <button 
                    onClick={shareOnTikTok}
                    className="text-black hover:text-gray-700"
                    aria-label="Share on TikTok"
                  >
                    <FaTiktok size={24} />
                  </button>
                  <button 
                    onClick={shareOnWhatsApp}
                    className="text-green-600 hover:text-green-800"
                    aria-label="Share on WhatsApp"
                  >
                    <FaWhatsapp size={24} />
                  </button>
                </div>
              </div>
              
              <div className="mb-4">
                <Rating
                  value={product.rating}
                  text={`${product.numReviews} reviews`}
                />
              </div>
              
              <div className="text-2xl font-bold mb-4">GH₵{product.price}</div>
              
              <div className="mb-6">
                <p className="text-gray-700">{product.description}</p>
              </div>
              
              <div className="mb-4 flex items-center">
                <span className="mr-4">Status:</span>
                {product.countInStock > 0 ? (
                  product.lowStockThreshold && product.countInStock <= product.lowStockThreshold ? (
                    <div className="flex flex-col">
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                        Low Stock
                      </span>
                      <span className="text-red-600 text-sm mt-1 font-medium">
                        Only {product.countInStock} left! Order soon.
                      </span>
                    </div>
                  ) : (
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                      In Stock ({product.countInStock} available)
                    </span>
                  )
                ) : (
                  <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-sm">
                    Out of Stock
                  </span>
                )}
              </div>
              
              {product.countInStock > 0 && (
                <div className="mb-6">
                  <div className="flex items-center">
                    <span className="mr-4">Quantity:</span>
                    <div className="flex items-center border border-gray-300 rounded-md">
                      <button
                        className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                        onClick={() => setQty(qty > 1 ? qty - 1 : 1)}
                        disabled={qty <= 1}
                      >
                        <FaMinus />
                      </button>
                      <span className="px-4 py-1 border-x border-gray-300">
                        {qty}
                      </span>
                      <button
                        className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                        onClick={() =>
                          setQty(qty < product.countInStock ? qty + 1 : qty)
                        }
                        disabled={qty >= product.countInStock}
                      >
                        <FaPlus />
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex space-x-4">
                <button
                  className="flex-1 bg-primary hover:bg-primary-dark text-white py-3 px-6 rounded-md font-semibold flex items-center justify-center disabled:bg-gray-400 disabled:cursor-not-allowed"
                  onClick={addToCartHandler}
                  disabled={product.countInStock === 0}
                >
                  <FaShoppingCart className="mr-2" />
                  {product.countInStock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>
                
                <button
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-md font-semibold flex items-center justify-center disabled:bg-gray-400 disabled:cursor-not-allowed"
                  onClick={buyNowHandler}
                  disabled={product.countInStock === 0}
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>
          
          <ProductTabs
            product={product}
            userInfo={userInfo}
            rating={rating}
            setRating={setRating}
            comment={comment}
            setComment={setComment}
            submitReviewHandler={submitReviewHandler}
            loadingReview={loadingReview}
            question={question}
            setQuestion={setQuestion}
            submitQuestionHandler={submitQuestionHandler}
            loadingQuestion={loadingQuestion}
          />
        </>
      )}
    </>
  );
};

export default ProductPage;
