import React from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const Pagination = ({ pages, page, setPage, admin = false }) => {
  if (pages <= 1) return null;

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= pages) {
      setPage(newPage);
    }
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    
    if (pages <= maxPagesToShow) {
      // Show all pages if total pages are less than or equal to maxPagesToShow
      for (let i = 1; i <= pages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always include first page, current page, and last page
      pageNumbers.push(1);
      
      // Add ellipsis if current page is not close to first page
      if (page > 3) {
        pageNumbers.push('...');
      }
      
      // Add pages around current page
      const startPage = Math.max(2, page - 1);
      const endPage = Math.min(pages - 1, page + 1);
      
      for (let i = startPage; i <= endPage; i++) {
        if (i !== 1 && i !== pages) {
          pageNumbers.push(i);
        }
      }
      
      // Add ellipsis if current page is not close to last page
      if (page < pages - 2) {
        pageNumbers.push('...');
      }
      
      pageNumbers.push(pages);
    }
    
    return pageNumbers;
  };

  return (
    <div className="flex justify-center mt-8">
      <div className="flex items-center space-x-2">
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
          className={`flex items-center justify-center w-10 h-10 rounded-md ${
            page === 1
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          <FaChevronLeft />
        </button>

        {getPageNumbers().map((pageNumber, index) => (
          <React.Fragment key={index}>
            {pageNumber === '...' ? (
              <span className="flex items-center justify-center w-10 h-10">...</span>
            ) : (
              <button
                onClick={() => handlePageChange(pageNumber)}
                className={`flex items-center justify-center w-10 h-10 rounded-md ${
                  pageNumber === page
                    ? 'bg-primary text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {pageNumber}
              </button>
            )}
          </React.Fragment>
        ))}

        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={page === pages}
          className={`flex items-center justify-center w-10 h-10 rounded-md ${
            page === pages
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          <FaChevronRight />
        </button>
      </div>
    </div>
  );
};

export default Pagination;