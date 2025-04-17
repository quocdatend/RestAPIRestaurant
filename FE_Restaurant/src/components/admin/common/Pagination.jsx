import React from 'react';

const Pagination = ({ totalItems, itemsPerPage, currentPage = 1, onPageChange }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  return (
    <div className="flex items-center justify-between">
      <div className="text-sm text-gray-700">
        Hiển thị {(currentPage - 1) * itemsPerPage + 1} đến{' '}
        {Math.min(currentPage * itemsPerPage, totalItems)} trong số {totalItems} kết quả
      </div>
      
      <div className="flex space-x-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 border rounded-md disabled:opacity-50"
        >
          Trước
        </button>
        
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            onClick={() => onPageChange(index + 1)}
            className={`px-3 py-1 border rounded-md ${
              currentPage === index + 1 ? 'bg-blue-500 text-white' : ''
            }`}
          >
            {index + 1}
          </button>
        ))}
        
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 border rounded-md disabled:opacity-50"
        >
          Sau
        </button>
      </div>
    </div>
  );
};

export default Pagination; 