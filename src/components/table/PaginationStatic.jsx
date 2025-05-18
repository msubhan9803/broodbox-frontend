import React, { useState } from "react";
import { MdArrowBackIos, MdArrowForwardIos } from "react-icons/md";

const PaginationStatic = ({ totalItems, itemsPerPage, onPageChange }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      onPageChange(page);
    }
  };

  const isPrevDisabled = currentPage <= 1;
  const isNextDisabled = currentPage >= totalPages;

  return (
    <div className="mt-[40px] flex justify-center items-center">
      <div className="flex items-center text-primary-main gap-[22px]">
        <h1
          className={`cursor-pointer ${
            isPrevDisabled
              ? "text-gray-400 cursor-not-allowed"
              : "text-primary-main"
          }`}
          onClick={() => !isPrevDisabled && handlePageChange(currentPage - 1)}
        >
          <MdArrowBackIos />
        </h1>

        {Array.from({ length: totalPages }, (_, index) => (
          <h1
            key={index + 1}
            className={`w-[26px] h-[26px] rounded-full flex justify-center items-center cursor-pointer ${
              currentPage === index + 1
                ? "text-white bg-primary-main"
                : "text-primary-main"
            }`}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </h1>
        ))}

        <h1
          className={`cursor-pointer ${
            isNextDisabled
              ? "text-gray-400 cursor-not-allowed"
              : "text-primary-main"
          }`}
          onClick={() => !isNextDisabled && handlePageChange(currentPage + 1)}
        >
          <MdArrowForwardIos />
        </h1>
      </div>
    </div>
  );
};

export default PaginationStatic;
