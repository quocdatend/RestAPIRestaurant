import React from 'react';

const ReviewFilter = ({ filters, onFilterChange }) => {
  const handleRatingFilter = (rating) => {
    onFilterChange({ ...filters, rating });
  };

  const handleSortChange = (e) => {
    onFilterChange({ ...filters, sortBy: e.target.value });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <h3 className="font-medium text-gray-700">Lọc theo đánh giá</h3>
          <div className="flex flex-wrap gap-2">
            {[0, 5, 4, 3, 2, 1].map((rating) => (
              <button
                key={rating}
                onClick={() => handleRatingFilter(rating)}
                className={`px-3 py-1 rounded-full text-sm ${
                  filters.rating === rating
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                {rating === 0 ? 'Tất cả' : `${rating} sao`}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="sort-select" className="block text-sm font-medium text-gray-700 mb-1">
            Sắp xếp theo
          </label>
          <select
            id="sort-select"
            value={filters.sortBy}
            onChange={handleSortChange}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="newest">Mới nhất</option>
            <option value="oldest">Cũ nhất</option>
            <option value="highest">Đánh giá cao nhất</option>
            <option value="lowest">Đánh giá thấp nhất</option>
            <option value="most_helpful">Hữu ích nhất</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default ReviewFilter; 