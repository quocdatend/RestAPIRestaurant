import React, { useState } from 'react';

const MenuFilter = ({ onFilter }) => {
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    priceRange: '',
    status: '',
    sortBy: 'newest'
  });

  // Dữ liệu các danh mục món ăn
  const categories = [
    { id: 'all', name: 'Tất cả' },
    { id: 'main', name: 'Món chính' },
    { id: 'appetizer', name: 'Khai vị' },
    { id: 'soup', name: 'Súp' },
    { id: 'salad', name: 'Salad' },
    { id: 'dessert', name: 'Tráng miệng' },
    { id: 'drink', name: 'Đồ uống' }
  ];

  // Dữ liệu khoảng giá
  const priceRanges = [
    { id: 'all', name: 'Tất cả mức giá' },
    { id: '0-50000', name: 'Dưới 50.000đ' },
    { id: '50000-100000', name: '50.000đ - 100.000đ' },
    { id: '100000-200000', name: '100.000đ - 200.000đ' },
    { id: '200000', name: 'Trên 200.000đ' }
  ];

  // Xử lý thay đổi filter
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Xử lý reset filter
  const handleResetFilters = () => {
    setFilters({
      search: '',
      category: '',
      priceRange: '',
      status: '',
      sortBy: 'newest'
    });
  };

  // Xử lý submit filter
  const handleSubmit = (e) => {
    e.preventDefault();
    onFilter(filters);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Tìm kiếm */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tìm kiếm
            </label>
            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder="Tên món ăn..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Danh mục */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Danh mục
            </label>
            <select
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Khoảng giá */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Khoảng giá
            </label>
            <select
              name="priceRange"
              value={filters.priceRange}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              {priceRanges.map(range => (
                <option key={range.id} value={range.id}>
                  {range.name}
                </option>
              ))}
            </select>
          </div>

          {/* Trạng thái */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Trạng thái
            </label>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="available">Còn món</option>
              <option value="unavailable">Hết món</option>
              <option value="hidden">Ẩn</option>
            </select>
          </div>

          {/* Sắp xếp */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sắp xếp theo
            </label>
            <select
              name="sortBy"
              value={filters.sortBy}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="newest">Mới nhất</option>
              <option value="oldest">Cũ nhất</option>
              <option value="price-asc">Giá tăng dần</option>
              <option value="price-desc">Giá giảm dần</option>
              <option value="name-asc">Tên A-Z</option>
              <option value="name-desc">Tên Z-A</option>
            </select>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-3 mt-4">
          <button
            type="button"
            onClick={handleResetFilters}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Đặt lại
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Áp dụng
          </button>
        </div>
      </form>
    </div>
  );
};

export default MenuFilter; 