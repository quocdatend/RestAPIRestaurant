import React, { useState } from 'react';

const ReviewFilter = ({ filters, onFilterChange }) => {
  const [tempFilters, setTempFilters] = useState({
    rating: filters.rating || 0,
    sortBy: filters.sortBy || 'newest',
    searchTerm: filters.searchTerm || '',
    dateRange: filters.dateRange || { start: '', end: '' }
  });

  const handleRatingFilter = (rating) => {
    const newFilters = { ...tempFilters, rating };
    setTempFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleSortChange = (e) => {
    const newFilters = { ...tempFilters, sortBy: e.target.value };
    setTempFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleSearchChange = (e) => {
    setTempFilters({ ...tempFilters, searchTerm: e.target.value });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onFilterChange(tempFilters);
  };

  const handleDateChange = (field, value) => {
    const newDateRange = { ...tempFilters.dateRange, [field]: value };
    const newFilters = { ...tempFilters, dateRange: newDateRange };
    setTempFilters(newFilters);
  };

  const applyDateFilter = () => {
    onFilterChange(tempFilters);
  };

  const clearFilters = () => {
    const defaultFilters = {
      rating: 0,
      sortBy: 'newest',
      searchTerm: '',
      dateRange: { start: '', end: '' }
    };
    setTempFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-4">
      <h2 className="text-lg font-semibold mb-2">Lọc đánh giá</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <form onSubmit={handleSearchSubmit} className="flex">
            <input
              type="text"
              value={tempFilters.searchTerm}
              onChange={handleSearchChange}
              placeholder="Tìm kiếm..."
              className="flex-1 border rounded-l px-3 py-2"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white rounded-r px-3"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </button>
          </form>
        </div>

        <select
          value={tempFilters.sortBy}
          onChange={handleSortChange}
          className="border rounded px-3 py-2"
        >
          <option value="newest">Mới nhất</option>
          <option value="oldest">Cũ nhất</option>
          <option value="highest">Đánh giá cao nhất</option>
          <option value="lowest">Đánh giá thấp nhất</option>
        </select>
      </div>

      <div className="mb-4">
        <h3 className="font-medium mb-2">Lọc theo đánh giá</h3>
        <div className="flex flex-wrap gap-2">
          {[0, 5, 4, 3, 2, 1].map((rating) => (
            <button
              key={rating}
              onClick={() => handleRatingFilter(rating)}
              className={`px-3 py-1 rounded-full ${
                tempFilters.rating === rating
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              {rating === 0 ? 'Tất cả' : `${rating} sao`}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={clearFilters}
          className="px-4 py-2 border rounded text-gray-700"
        >
          Xóa bộ lọc
        </button>
      </div>
    </div>
  );
};

export default ReviewFilter;