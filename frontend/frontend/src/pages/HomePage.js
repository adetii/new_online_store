import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetProductsQuery } from '../slices/productsApiSlice';
import ProductCard from '../components/products/ProductCard';
import Loader from '../components/layout/Loader';
import Message from '../components/layout/Message';
import Paginate from '../components/layout/Paginate';
import FeaturedProducts from '../components/products/FeaturedProducts';
import { Helmet } from 'react-helmet';
import { FaFacebook, FaInstagram, FaTiktok, FaWhatsapp } from 'react-icons/fa';

// Helper function to create a URL slug (can be moved to a utils file)
const createSlug = (name) => {
  if (!name) return 'product';
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-'); // Replace multiple hyphens with single hyphen
};

const HomePage = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [page, setPage] = useState(1);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const { keyword, category } = useParams();

  // Sync selectedCategory with URL category parameter
  useEffect(() => {
    if (category) {
      setSelectedCategory(category);
      // Reset page to 1 when category changes
      setPage(1);
    } else {
      setSelectedCategory('');
    }
  }, [category]);

  // Get the query result with the correct parameters
  const { data, isLoading, error, refetch } = useGetProductsQuery({
    keyword,
    pageNumber: page,
    category: selectedCategory || '',
  }, {
    // This ensures the query updates when parameters change
    refetchOnMountOrArgChange: true
  });

  // Force refetch when category or page changes
  useEffect(() => {
    if (refetch) {
      refetch();
    }
  }, [selectedCategory, page, refetch]);

  // Handle scroll event to show/hide scroll to top button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const handleCategorySelect = (category) => {
    if (category === 'All' || category === '') {
      navigate('/');
      setSelectedCategory('');
    } else {
      navigate(`/category/${category}`);
      setSelectedCategory(category);
    }
    setPage(1);
  };

  // Handle page change with category preservation
  const handlePageChange = (newPage, currentCategory) => {
    setPage(newPage);
    scrollToTop();
  };

  // Social media sharing functions
  const shareUrl = window.location.href;
  const shareTitle = `Check out ${selectedCategory ? selectedCategory + ' products' : 'amazing products'} at The Cowries Shop!`;
  
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
      <Helmet>
        <title>{selectedCategory ? `${selectedCategory} Products | The Cowries Shop` : 'The Cowries Shop | Premium Online Shopping'}</title>
        <meta name="description" content={`Discover ${selectedCategory ? selectedCategory + ' products' : 'the best products'} at competitive prices. Shop now at The Cowries Shop!`} />
        <meta property="og:title" content={`${selectedCategory ? selectedCategory + ' Products | ' : ''}The Cowries Shop`} />
        <meta property="og:description" content={`Discover ${selectedCategory ? selectedCategory + ' products' : 'the best products'} at competitive prices. Shop now!`} />
        <meta property="og:url" content={shareUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/THE_COWRIES_PNG-01.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${selectedCategory ? selectedCategory + ' Products | ' : ''}The Cowries Shop`} />
        <meta name="twitter:description" content={`Discover ${selectedCategory ? selectedCategory + ' products' : 'the best products'} at competitive prices. Shop now!`} />
        <meta name="twitter:image" content="/THE_COWRIES_PNG-01.png" />
        <meta name="keywords" content={`online shopping, e-commerce, ${selectedCategory || 'products'}, The Cowries Shop, Ghana shopping`} />
        
        {/* JSON-LD structured data for better SEO */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "The Cowries Shop",
            "url": window.location.origin,
            "potentialAction": {
              "@type": "SearchAction",
              "target": `${window.location.origin}/search/{search_term_string}`,
              "query-input": "required name=search_term_string"
            }
          })}
        </script>
        
        {data?.products && data.products.length > 0 && (
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ItemList",
              "itemListElement": data.products.slice(0, 10).map((product, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "item": {
                  "@type": "Product",
                  "name": product.name,
                  "description": product.description,
                  "image": product.image,
                  // Update the URL to include the slug
                  "url": `${window.location.origin}/product/${product._id}/${createSlug(product.name)}`,
                  "offers": {
                    "@type": "Offer",
                    "price": product.price,
                    "priceCurrency": "GHS",
                    "availability": product.countInStock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
                  }
                }
              }))
            })}
          </script>
        )}
      </Helmet>
      
      <div>
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">
            {selectedCategory ? `${selectedCategory} Products` : 'All Products'}
          </h1>
          
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

        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant="error">
            {error?.data?.message || error.error}
          </Message>
        ) : (
          <>
            {data?.products && data.products.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
                  {data.products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                {data?.pages > 1 && (
                  <Paginate 
                    pages={data.pages} 
                    page={page} 
                    category={selectedCategory}
                    onPageChange={handlePageChange} 
                  />
                )}
              </>
            ) : (
              <Message>No products found</Message>
            )}
          </>
        )}
      </div>

      {data?.products?.some((product) => product.isFeatured) && (
        <div className="mb-8">
          <FeaturedProducts products={data.products.filter((product) => product.isFeatured)} />
        </div>
      )}

      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-4 right-4 bg-indigo-700 text-white p-3 rounded-full shadow-lg hover:bg-indigo-800 transition-colors flex items-center justify-center w-12 h-12"
          aria-label="Scroll to top"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </button>
      )}
    </>
  );
};

export default HomePage;