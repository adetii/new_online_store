import React from 'react';

const CategoryFilter = ({ categories, onSelectCategory, selectedCategory }) => {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-3">Categories</h2>
      <div className="flex flex-col space-y-2">
        <button 
          onClick={() => onSelectCategory('')}
          className={`text-left hover:text-primary transition-colors ${
            selectedCategory === '' ? 'text-primary font-medium' : 'text-gray-700'
          }`}
        >
          All Products
        </button>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onSelectCategory(category)}
            className={`text-left hover:text-primary transition-colors ${
              selectedCategory === category ? 'text-primary font-medium' : 'text-gray-700'
            }`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;