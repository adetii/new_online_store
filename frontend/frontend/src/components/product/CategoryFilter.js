import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { FaTag } from 'react-icons/fa';

const CategoryFilter = ({ categories }) => {
  const { category: activeCategory } = useParams();
  
  // Normalize the category name for comparison
  const normalizeCategory = (category) => {
    return category ? category.toLowerCase().trim() : '';
  };
  
  const normalizedActiveCategory = normalizeCategory(activeCategory);
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
      <h3 className="text-lg font-semibold mb-3">Categories</h3>
      
      <div className="space-y-2">
        <Link
          to="/"
          className={`block px-4 py-2 rounded-md transition-colors ${
            !activeCategory ? 'bg-primary text-white' : 'hover:bg-gray-100'
          }`}
        >
          All Products
        </Link>
        
        {categories && categories.length > 0 ? (
          categories.map((category) => (
            <Link
              key={category}
              to={`/category/${category}`}
              className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                normalizedActiveCategory === normalizeCategory(category)
                  ? 'bg-primary text-white'
                  : 'hover:bg-gray-100'
              }`}
            >
              <FaTag className="mr-2" />
              {category}
            </Link>
          ))
        ) : (
          <p className="text-gray-500 px-4 py-2">No categories available</p>
        )}
      </div>
    </div>
  );
};

export default CategoryFilter;