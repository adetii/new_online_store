import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight, FaEllipsisH } from 'react-icons/fa';

const Paginate = ({ pages, page, onPageChange, keyword = '', category = '' }) => {
  const params = useParams();
  const [isMobile, setIsMobile] = useState(false);
  
  // Check if we're on mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);
  
  if (pages <= 1) {
    return null;
  }

  const handlePageChange = (newPage) => {
    if (onPageChange) {
      // Pass the current category along with the page change
      onPageChange(newPage, params.category || category);
    }
  };

  // Function to determine which pages to show
  const getVisiblePages = () => {
    // For mobile, show fewer pages
    const maxVisiblePages = isMobile ? 3 : 7;
    
    if (pages <= maxVisiblePages) {
      // If total pages is less than max, show all pages
      return Array.from({ length: pages }, (_, i) => i + 1);
    }
    
    // Calculate visible page range
    let start, end;
    
    if (isMobile) {
      // On mobile, just show current page and one on each side if possible
      start = Math.max(1, page - 1);
      end = Math.min(pages, page + 1);
      
      // If we're at the start or end, adjust to still show 3 pages
      if (page <= 2) {
        start = 1;
        end = Math.min(3, pages);
      } else if (page >= pages - 1) {
        start = Math.max(1, pages - 2);
        end = pages;
      }
    } else {
      // On desktop, show more pages
      start = Math.max(1, page - Math.floor(maxVisiblePages / 2));
      end = Math.min(pages, start + maxVisiblePages - 1);
      
      // Adjust start if end is at max pages
      if (end === pages) {
        start = Math.max(1, pages - maxVisiblePages + 1);
      }
    }
    
    // Create array of visible page numbers
    const visiblePages = Array.from({ length: end - start + 1 }, (_, i) => start + i);
    
    // Add ellipsis indicators
    const result = [];
    
    if (start > 1) {
      result.push(1);
      if (start > 2) result.push('start-ellipsis');
    }
    
    result.push(...visiblePages);
    
    if (end < pages) {
      if (end < pages - 1) result.push('end-ellipsis');
      result.push(pages);
    }
    
    return result;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="flex justify-center mt-4 mb-8">
      <div className="flex flex-wrap items-center justify-center gap-1">
        {/* Previous button */}
        <button
          onClick={() => page > 1 && handlePageChange(page - 1)}
          disabled={page === 1}
          className={`px-2 py-1 rounded ${
            page === 1
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-gray-700 hover:bg-gray-200'
          }`}
          aria-label="Previous page"
        >
          <FaChevronLeft />
        </button>

        {/* Page numbers */}
        {visiblePages.map((pageNum, index) => {
          if (pageNum === 'start-ellipsis' || pageNum === 'end-ellipsis') {
            return (
              <span key={`ellipsis-${index}`} className="px-1 py-1">
                <FaEllipsisH className="text-gray-400" />
              </span>
            );
          }

          return (
            <button
              key={pageNum}
              onClick={() => handlePageChange(pageNum)}
              className={`w-8 h-8 flex items-center justify-center rounded ${
                pageNum === page
                  ? 'bg-primary text-white'
                  : 'text-gray-700 hover:bg-gray-200'
              }`}
            >
              {pageNum}
            </button>
          );
        })}

        {/* Next button */}
        <button
          onClick={() => page < pages && handlePageChange(page + 1)}
          disabled={page === pages}
          className={`px-2 py-1 rounded ${
            page === pages
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-gray-700 hover:bg-gray-200'
          }`}
          aria-label="Next page"
        >
          <FaChevronRight />
        </button>
      </div>
    </div>
  );
};

export default Paginate;