import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { FaSearch, FaTimes } from 'react-icons/fa';

const SearchBox = ({ centered = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Extract keyword from URL if it exists
  const [keyword, setKeyword] = useState('');
  const [showClearButton, setShowClearButton] = useState(false);
  
  // Update keyword when location changes
  useEffect(() => {
    // Check if we're on a search page and extract the keyword
    const pathParts = location.pathname.split('/');
    if (pathParts.includes('search') && pathParts.length > 2) {
      const searchKeyword = decodeURIComponent(pathParts[pathParts.indexOf('search') + 1]);
      setKeyword(searchKeyword);
    }
    
    // Also check if we're on a category page
    if (pathParts.includes('category') && pathParts.length > 2) {
      // If we're on a category page with no search term, we don't need to update the search box
      if (!pathParts.includes('search')) {
        setKeyword('');
      }
    }
  }, [location]);
  
  // Update clear button visibility based on keyword
  useEffect(() => {
    setShowClearButton(keyword.length > 0);
  }, [keyword]);
  
  const submitHandler = (e) => {
    e.preventDefault();
    
    // Get the current category from the URL if it exists
    const pathParts = location.pathname.split('/');
    const categoryIndex = pathParts.indexOf('category');
    const hasCategory = categoryIndex !== -1 && pathParts.length > categoryIndex + 1;
    const category = hasCategory ? pathParts[categoryIndex + 1] : '';
    
    if (keyword.trim()) {
      // If we have both a keyword and category, navigate to the combined route
      if (category) {
        navigate(`/search/${encodeURIComponent(keyword.trim())}/category/${category}`);
      } else {
        // Otherwise just navigate with the keyword
        navigate(`/search/${encodeURIComponent(keyword.trim())}`);
      }
    } else if (category) {
      // If we only have a category, navigate to the category route
      navigate(`/category/${category}`);
    } else {
      // If we have neither, go to the home page
      navigate('/');
    }
  };
  
  const clearSearch = () => {
    setKeyword('');
    navigate('/');
  };
  
  const handleInputChange = (e) => {
    setKeyword(e.target.value);
  };
  
  return (
    <form 
      onSubmit={submitHandler} 
      className={`flex ${centered ? 'mx-auto' : 'w-full'} max-w-md`}
    >
      <div className="relative flex-grow">
        <input
          type="text"
          name="q"
          value={keyword}
          onChange={handleInputChange}
          placeholder="Search products"
          className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-gray-800"
          aria-label="Search products"
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FaSearch className="text-gray-400" />
        </div>
        
        {showClearButton && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            aria-label="Clear search"
          >
            <FaTimes />
          </button>
        )}
      </div>
      
      <button
        type="submit"
        className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-r-md transition-colors"
      >
        Search
      </button>
    </form>
  );
};

export default SearchBox;