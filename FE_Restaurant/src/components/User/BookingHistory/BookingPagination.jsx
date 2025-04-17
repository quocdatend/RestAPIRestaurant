// src/components/User/BookingHistory/BookingPagination.jsx
import React from 'react';
import { FaChevronLeft, FaChevronRight, FaEllipsisH } from 'react-icons/fa';

const BookingPagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  totalItems, 
  itemsPerPage, 
  displayedItems 
}) => {
  // Tạo mảng các trang hiển thị
  const getPageNumbers = () => {
    const delta = 2; // Số trang hiển thị bên cạnh trang hiện tại
    const range = [];
    const rangeWithDots = [];

    // Luôn hiển thị trang 1
    range.push(1);

    for (let i = currentPage - delta; i <= currentPage + delta; i++) {
      if (i > 1 && i < totalPages) {
        range.push(i);
      }
    }

    // Luôn hiển thị trang cuối
    if (totalPages > 1) {
      range.push(totalPages);
    }

    // Thêm dấu ... vào giữa các trang
    let l;
    for (let i of range) {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push('...');
        }
      }
      rangeWithDots.push(i);
      l = i;
    }

    return rangeWithDots;
  };

  return (
    <div className="bg-white px-6 py-4 rounded-lg shadow-sm">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Thông tin hiển thị */}
        <div className="text-sm text-gray-700 flex items-center">
          <div className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-medium">
            {displayedItems} / {totalItems} kết quả
          </div>
        </div>

        {/* Điều hướng trang */}
        <nav className="flex items-center space-x-1" aria-label="Pagination">
          {/* Nút Previous */}
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`relative inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              currentPage === 1
                ? 'text-gray-300 cursor-not-allowed bg-gray-50'
                : 'text-gray-700 hover:bg-purple-50 hover:text-purple-600'
            }`}
          >
            <FaChevronLeft className="h-4 w-4" />
          </button>

          {/* Các nút số trang */}
          <div className="hidden sm:flex items-center space-x-1">
            {getPageNumbers().map((page, index) => (
              <React.Fragment key={index}>
                {page === '...' ? (
                  <span className="px-3 py-2">
                    <FaEllipsisH className="h-4 w-4 text-gray-400" />
                  </span>
                ) : (
                  <button
                    onClick={() => onPageChange(page)}
                    className={`relative inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      page === currentPage
                        ? 'bg-purple-600 text-white shadow-md hover:bg-purple-700'
                        : 'text-gray-700 hover:bg-purple-50 hover:text-purple-600'
                    }`}
                  >
                    {page}
                  </button>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Mobile Pagination */}
          <div className="sm:hidden flex items-center">
            <span className="text-gray-700 font-medium">
              Trang {currentPage} / {totalPages}
            </span>
          </div>

          {/* Nút Next */}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`relative inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              currentPage === totalPages
                ? 'text-gray-300 cursor-not-allowed bg-gray-50'
                : 'text-gray-700 hover:bg-purple-50 hover:text-purple-600'
            }`}
          >
            <FaChevronRight className="h-4 w-4" />
          </button>
        </nav>
      </div>

      {/* Mobile view - Thông tin bổ sung */}
      <div className="mt-3 sm:hidden text-center">
        <div className="text-sm text-gray-700">
          Hiển thị <span className="font-medium">{displayedItems}</span> trong số{' '}
          <span className="font-medium">{totalItems}</span> kết quả
        </div>
      </div>
    </div>
  );
};

export default BookingPagination;