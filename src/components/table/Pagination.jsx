import React from 'react';
import { MdArrowBackIos, MdArrowForwardIos, MdFirstPage, MdLastPage } from 'react-icons/md';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const isPrevDisabled = currentPage <= 1;
  const isNextDisabled = currentPage >= totalPages;

  const getPaginationGroup = () => {
    let start = Math.max(currentPage - 2, 1);
    let end = Math.min(start + 4, totalPages);
    start = Math.max(end - 4, 1); // adjust start index if end index is less than 5 places away from start

    const pages = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="mt-[40px] flex justify-center items-center">
      <div className="flex items-center text-primary-main gap-[22px]">
        {/* Start button */}
        <h1
          className={`cursor-pointer ${isPrevDisabled ? 'text-gray-400 cursor-not-allowed' : 'text-primary-main'}`}
          onClick={() => onPageChange(1)}
        >
          <MdFirstPage />
        </h1>
        
        {/* Previous button */}
        <h1
          className={`cursor-pointer ${isPrevDisabled ? 'text-gray-400 cursor-not-allowed' : 'text-primary-main'}`}
          onClick={() => !isPrevDisabled && onPageChange(Math.max(currentPage - 1, 1))}
        >
          <MdArrowBackIos />
        </h1>

        {/* Page numbers with ellipses */}
        {currentPage > 3 && <h1 className="text-primary-main">...</h1>}
        {getPaginationGroup().map(page => (
          <h1
            key={page}
            className={`w-[26px] h-[26px] rounded-full flex justify-center items-center cursor-pointer ${
              currentPage === page ? 'text-white bg-primary-main' : 'text-primary-main'
            }`}
            onClick={() => onPageChange(page)}
          >
            {page}
          </h1>
        ))}
        {totalPages > currentPage + 2 && <h1 className="text-primary-main">...</h1>}

        {/* Next button */}
        <h1
          className={`cursor-pointer ${isNextDisabled ? 'text-gray-400 cursor-not-allowed' : 'text-primary-main'}`}
          onClick={() => !isNextDisabled && onPageChange(Math.min(currentPage + 1, totalPages))}
        >
          <MdArrowForwardIos />
        </h1>

        {/* End button */}
        <h1
          className={`cursor-pointer ${isNextDisabled ? 'text-gray-400 cursor-not-allowed' : 'text-primary-main'}`}
          onClick={() => onPageChange(totalPages)}
        >
          <MdLastPage />
        </h1>
      </div>
    </div>
  );
};

export default Pagination;
