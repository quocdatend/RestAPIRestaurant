import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/layout/AdminLayout';
import { toast } from 'react-toastify';
import adminMenuService from '../../services/adminMenuService';
import { 
  MdAdd, 
  MdFilterList, 
  MdRestaurantMenu, 
  MdTrendingUp,
  MdStar,
  MdInventory 
} from 'react-icons/md';
import { FaEdit, FaImage, FaSearch } from 'react-icons/fa';

// Danh sách categories cố định
const CATEGORIES = [
  { id: 1, name: 'Món khai vị' },
  { id: 2, name: 'Món chính' },
  { id: 3, name: 'Món tráng miệng' },
  { id: 4, name: 'Nước uống' }
];

const ITEMS_PER_PAGE = 9; // Số sản phẩm mỗi trang

const MenuPage = () => {
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    category: 'all',
    status: 'all',
    search: ''
  });

  // Thêm state để theo dõi trạng thái loading cho từng món
  const [loadingStates, setLoadingStates] = useState({});

  // Lấy danh sách sản phẩm
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const result = await adminMenuService.getAllProducts();
      if (result.status) {
        setProducts(result.data);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Không thể tải danh sách sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Tính toán thống kê
  const stats = [
    {
      title: 'Tổng số món',
      value: products.length,
      icon: <MdRestaurantMenu size={24} />,
      color: 'blue'
    },
    {
      title: 'Món đang bán',
      value: products.filter(p => p.status).length,
      icon: <MdTrendingUp size={24} />,
      color: 'green'
    },
    {
      title: 'Món phổ biến',
      value: '35',
      icon: <MdStar size={24} />,
      color: 'yellow'
    },
    {
      title: 'Hết món',
      value: products.filter(p => !p.status).length,
      icon: <MdInventory size={24} />,
      color: 'red'
    }
  ];

  // Xử lý thay đổi trạng thái
  const handleStatusChange = (productId, newStatus) => {
    setProducts(prevProducts => 
      prevProducts.map(product => 
        product.id === productId 
          ? { ...product, status: newStatus }
          : product
      )
    );
  };

  // Xử lý upload ảnh
  const handleImageUpload = async (id, file) => {
    try {
      const result = await adminMenuService.uploadImage(id, file);
      if (result.status) {
        toast.success('Upload ảnh thành công');
        fetchProducts();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Lỗi khi upload ảnh');
    }
  };

  // Thêm function xử lý form data và upload ảnh
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      // Tạo FormData object để gửi dữ liệu form và file
      const formData = new FormData();
      
      // Thêm các trường dữ liệu cơ bản
      formData.append('name', selectedProduct.name);
      formData.append('price', selectedProduct.price);
      formData.append('description', selectedProduct.description);
      formData.append('detail', selectedProduct.detail);
      formData.append('category_id', selectedProduct.category_id);
      formData.append('status', selectedProduct.status);

      // Xử lý file ảnh nếu có
      if (selectedProduct.image instanceof File) {
        formData.append('image', selectedProduct.image);
      }

      // Gọi API tương ứng (thêm mới hoặc cập nhật)
      const result = selectedProduct.id
        ? await adminMenuService.updateProduct(selectedProduct.id, formData)
        : await adminMenuService.createProduct(formData);

      if (result.status) {
        toast.success(selectedProduct.id ? 'Cập nhật món ăn thành công' : 'Thêm món ăn mới thành công');
        setShowModal(false);
        setSelectedProduct(null);
        fetchProducts(); // Refresh danh sách
      } else {
        toast.error(result.message || 'Có lỗi xảy ra');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Có lỗi xảy ra khi xử lý yêu cầu');
    } finally {
      setLoading(false);
    }
  };

  // Lọc và phân trang sản phẩm
  const filteredProducts = products.filter(product => {
    const matchCategory = filters.category === 'all' || product.category_id.toString() === filters.category;
    const matchStatus = filters.status === 'all' || product.status.toString() === filters.status;
    const matchSearch = filters.search === '' || 
      product.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      product.description.toLowerCase().includes(filters.search.toLowerCase());
    return matchCategory && matchStatus && matchSearch;
  });

  // Tính toán phân trang
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Reset trang khi thay đổi bộ lọc
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  // Component nút toggle status
  const StatusToggleButton = ({ product, onStatusChange }) => {
    const [loading, setLoading] = useState(false);
    const [currentStatus, setCurrentStatus] = useState(product.status);

    const handleToggleStatus = async () => {
      try {
        setLoading(true);
        
        // Gọi API cập nhật trạng thái
        const result = await adminMenuService.updateStatus(product.id, !currentStatus);
        
        if (result.status) {
          // Cập nhật state local
          setCurrentStatus(!currentStatus);
          // Gọi callback để cập nhật state cha
          onStatusChange(product.id, !currentStatus);
          
          toast.success(`Món ${product.name} đã ${!currentStatus ? 'được bật' : 'bị ẩn'} khỏi menu`);
        } else {
          toast.error('Không thể cập nhật trạng thái món ăn');
        }
      } catch (error) {
        console.error('Error:', error);
        toast.error('Có lỗi xảy ra khi cập nhật trạng thái');
      } finally {
        setLoading(false);
      }
    };

    return (
      <button
        onClick={handleToggleStatus}
        disabled={loading}
        className={`
          inline-flex items-center px-4 py-2 rounded-lg
          transition-all duration-200 ease-in-out
          ${currentStatus 
            ? 'bg-green-100 text-green-800 hover:bg-green-200' 
            : 'bg-red-100 text-red-800 hover:bg-red-200'
          }
          ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          gap-2
        `}
      >
        {loading ? (
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : (
          <>
            <span className={`h-2 w-2 rounded-full ${currentStatus ? 'bg-green-500' : 'bg-red-500'}`}></span>
            <span>{currentStatus ? 'Còn món' : 'Hết món'}</span>
          </>
        )}
      </button>
    );
  };

  // Form thêm/sửa món ăn
  const renderForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Tên món */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tên món <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            value={selectedProduct.name || ''}
            onChange={(e) => setSelectedProduct({
              ...selectedProduct,
              name: e.target.value
            })}
            placeholder="Nhập tên món ăn"
          />
        </div>

        {/* Giá */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Giá <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            required
            min="0"
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            value={selectedProduct.price || ''}
            onChange={(e) => setSelectedProduct({
              ...selectedProduct,
              price: e.target.value
            })}
            placeholder="Nhập giá món ăn"
          />
        </div>
      </div>

      {/* Mô tả */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Mô tả ngắn <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          required
          className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
          value={selectedProduct.description || ''}
          onChange={(e) => setSelectedProduct({
            ...selectedProduct,
            description: e.target.value
          })}
          placeholder="Nhập mô tả ngắn về món ăn"
        />
      </div>

      {/* Chi tiết */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Chi tiết món ăn
        </label>
        <textarea
          className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
          rows="4"
          value={selectedProduct.detail || ''}
          onChange={(e) => setSelectedProduct({
            ...selectedProduct,
            detail: e.target.value
          })}
          placeholder="Nhập chi tiết về món ăn (nguyên liệu, cách chế biến...)"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Danh mục */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Danh mục <span className="text-red-500">*</span>
          </label>
          <select
            required
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            value={selectedProduct.category_id || ''}
            onChange={(e) => setSelectedProduct({
              ...selectedProduct,
              category_id: e.target.value
            })}
          >
            <option value="">Chọn danh mục</option>
            {CATEGORIES.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
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
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            value={selectedProduct.status}
            onChange={(e) => setSelectedProduct({
              ...selectedProduct,
              status: e.target.value === 'true'
            })}
          >
            <option value="true">Đang bán</option>
            <option value="false">Ngừng bán</option>
          </select>
        </div>
      </div>

      {/* Upload ảnh */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Hình ảnh {!selectedProduct.id && <span className="text-red-500">*</span>}
        </label>
        <div className="flex items-center space-x-4">
          {selectedProduct.image && !(selectedProduct.image instanceof File) && (
            <img
              src={selectedProduct.image}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg"
            />
          )}
          <div className="flex-1">
            <input
              type="file"
              accept="image/*"
              required={!selectedProduct.id}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  // Kiểm tra kích thước file (ví dụ: giới hạn 5MB)
                  if (file.size > 5 * 1024 * 1024) {
                    toast.error('Kích thước file không được vượt quá 5MB');
                    e.target.value = '';
                    return;
                  }
                  
                  // Kiểm tra loại file
                  if (!file.type.startsWith('image/')) {
                    toast.error('Vui lòng chọn file hình ảnh');
                    e.target.value = '';
                    return;
                  }

                  // Preview ảnh
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setSelectedProduct({
                      ...selectedProduct,
                      image: file,
                      imagePreview: reader.result
                    });
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />
            <p className="text-sm text-gray-500 mt-1">
              Hỗ trợ: JPG, PNG, GIF (Tối đa 5MB)
            </p>
          </div>
        </div>
        {selectedProduct.imagePreview && (
          <div className="mt-2">
            <img
              src={selectedProduct.imagePreview}
              alt="Preview"
              className="w-32 h-32 object-cover rounded-lg"
            />
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="flex justify-end space-x-2 pt-4">
        <button
          type="button"
          onClick={() => {
            setShowModal(false);
            setSelectedProduct(null);
          }}
          className="px-4 py-2 text-gray-600 hover:text-gray-800 border rounded-lg"
        >
          Hủy
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Đang xử lý...
            </>
          ) : (
            selectedProduct.id ? 'Cập nhật' : 'Thêm mới'
          )}
        </button>
      </div>
    </form>
  );

  return (
    <AdminLayout>
      <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Quản lý thực đơn</h1>
              <p className="text-gray-500 mt-1">Quản lý tất cả món ăn và thức uống của nhà hàng</p>
            </div>
            
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => setIsFilterVisible(!isFilterVisible)}
                className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 flex items-center"
              >
                <MdFilterList className="mr-2" size={20} />
                Bộ lọc
              </button>
              
              <button 
                onClick={() => {
                  setSelectedProduct({
                    name: '',
                    price: '',
                    description: '',
                    detail: '',
                    category_id: '1',
                    status: true
                  });
                  setShowModal(true);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
              >
                <MdAdd className="mr-2" size={20} />
                Thêm món ăn
              </button>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center">
                <div className={`p-3 bg-${stat.color}-100 rounded-lg`}>
                  <div className={`text-${stat.color}-600`}>{stat.icon}</div>
                </div>
                <div className="ml-4">
                  <p className="text-gray-500 text-sm">{stat.title}</p>
                  <h3 className="text-xl font-bold text-gray-800">{stat.value}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Filter Section */}
        {isFilterVisible && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tìm kiếm món ăn..."
                  value={filters.search}
                  onChange={(e) => setFilters({...filters, search: e.target.value})}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <FaSearch className="absolute left-3 top-3 text-gray-400" />
              </div>
              <select
                value={filters.category}
                onChange={(e) => setFilters({...filters, category: e.target.value})}
                className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Tất cả danh mục</option>
                {CATEGORIES.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <select
                value={filters.status}
                onChange={(e) => setFilters({...filters, status: e.target.value})}
                className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="true">Đang bán</option>
                <option value="false">Ngừng bán</option>
              </select>
            </div>
          </div>
        )}

        {/* Menu List */}
        <div className="bg-white rounded-xl shadow-sm">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                {paginatedProducts.map(product => (
                  <div key={product.id} className="bg-white rounded-lg shadow-sm overflow-hidden border">
                    <div className="relative h-48 bg-gray-200">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2 flex gap-2">
                        <label className="w-8 h-8 bg-white rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-100">
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(product.id, e.target.files[0])}
                          />
                          <FaImage className="text-gray-600" />
                        </label>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-semibold text-gray-800">
                          {product.name}
                        </h3>
                        <span className="text-lg font-bold text-green-600">
                          {new Intl.NumberFormat('vi-VN', {
                            style: 'currency',
                            currency: 'VND'
                          }).format(product.price)}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-2">
                        {product.description}
                      </p>
                      <div className="flex items-center text-sm text-gray-500 mb-4">
                        <span className="bg-gray-100 px-2 py-1 rounded">
                          {product.category_name}
                        </span>
                      </div>
                      <div className="flex justify-between items-center mt-4">
                        <StatusToggleButton
                          product={product}
                          onStatusChange={handleStatusChange}
                        />
                        
                        <button
                          onClick={() => {
                            setSelectedProduct(product);
                            setShowModal(true);
                          }}
                          className="p-2 text-blue-600 hover:text-blue-700 rounded-full hover:bg-blue-50"
                        >
                          <FaEdit size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Phân trang */}
              {totalPages > 1 && (
                <div className="flex justify-center space-x-2 p-6">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Trước
                  </button>
                  
                  {[...Array(totalPages)].map((_, index) => (
                    <button
                      key={index + 1}
                      onClick={() => setCurrentPage(index + 1)}
                      className={`px-4 py-2 border rounded-lg ${
                        currentPage === index + 1 
                          ? 'bg-blue-500 text-white' 
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}

                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Sau
                  </button>
                </div>
              )}

              {/* Hiển thị thông tin số sản phẩm */}
              <div className="text-center text-gray-500 text-sm pb-6">
                Hiển thị {startIndex + 1} - {Math.min(startIndex + ITEMS_PER_PAGE, filteredProducts.length)} 
                trong tổng số {filteredProducts.length} món
              </div>
            </>
          )}
        </div>

        {/* Modal thêm/sửa sản phẩm */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg w-full max-w-2xl">
              <div className="p-6">
                <h2 className="text-xl font-bold mb-4">
                  {selectedProduct.id ? 'Chỉnh sửa món ăn' : 'Thêm món ăn mới'}
                </h2>
                {renderForm()}
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default MenuPage;