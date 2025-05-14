import React from 'react';
import { FaSearch, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const ProductImageGallery = ({ images, activeImage, setActiveImage }) => {
  const navigate = useNavigate();
  
  if (!images || images.length === 0) {
    return (
      <div className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
        <span className="text-gray-500">No image available</span>
      </div>
    );
  }
  
  return (
    <div>
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-700 hover:text-primary mb-4"
      >
        <FaArrowLeft className="mr-2" /> Back to previous page
      </button>
      
      <div className="relative aspect-square bg-white rounded-lg overflow-hidden mb-4 border border-gray-200">
        <img
          src={images[activeImage]?.url || 'https://via.placeholder.com/600'}
          alt="Product"
          className="w-full h-full object-contain"
        />
        
        <button
          className="absolute bottom-4 right-4 bg-white/80 hover:bg-white p-2 rounded-full shadow-md transition-colors"
          aria-label="Zoom image"
        >
          <FaSearch />
        </button>
      </div>
    </div>
  );
};

export default ProductImageGallery;