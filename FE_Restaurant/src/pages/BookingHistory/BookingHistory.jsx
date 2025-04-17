// src/pages/BookingHistory/BookingHistory.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { 
  FaCalendar, 
  FaClock, 
  FaUtensils, 
  FaUser, 
  FaEye, 
  FaTimes, 
  FaShoppingBasket, 
  FaSearch,
  FaCheckCircle, 
  FaTimesCircle, 
  FaHourglassHalf,
  FaMoneyBillWave
} from 'react-icons/fa';

const BookingHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState('');
  const [products, setProducts] = useState({});
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchOrders();
    fetchProducts();
  }, []);

  // Lọc đơn hàng theo từ khóa tìm kiếm
  const filteredOrders = orders.filter(order => 
    !searchTerm || 
    (order.order_id && order.order_id.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (order.style_tiec && order.style_tiec.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Vui lòng đăng nhập để xem lịch sử đơn hàng');
      }

      // Lấy thông tin user_id từ API
      const userResponse = await axios.get(
        'http://localhost/restapirestaurant/users/response',
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        }
      );
      
      let currentUserId = '';
      if (userResponse.data?.data?.sub) {
        currentUserId = userResponse.data.data.sub;
      } else if (userResponse.data?.sub) {
        currentUserId = userResponse.data.sub;
      }
      
      if (!currentUserId) {
        throw new Error('Không thể xác định thông tin người dùng');
      }
      
      setUserId(currentUserId);

      // Lấy danh sách đơn hàng của user_id
      const ordersResponse = await axios.get(
        `http://localhost/restapirestaurant/order/user/${currentUserId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        }
      );

      // Xử lý dữ liệu API
      let orderData = [];
      
      if (ordersResponse.data) {
        if (Array.isArray(ordersResponse.data)) {
          orderData = ordersResponse.data;
        } else if (ordersResponse.data.data && Array.isArray(ordersResponse.data.data)) {
          orderData = ordersResponse.data.data;
        } else if (typeof ordersResponse.data === 'object' && !Array.isArray(ordersResponse.data)) {
          orderData = [ordersResponse.data];
        } else if (typeof ordersResponse.data === 'string') {
          try {
            const cleanedData = ordersResponse.data.replace(/\{"data":null\}$/, '');
            const parsedData = JSON.parse(cleanedData);
            if (Array.isArray(parsedData)) {
              orderData = parsedData;
            } else {
              orderData = [parsedData];
            }
          } catch (e) {
            console.error('Error parsing response string:', e);
          }
        }
      }

      setOrders(orderData);

    } catch (error) {
      console.error('Error fetching orders:', error);
      setError(error.message || 'Không thể tải danh sách đơn hàng');
      toast.error(error.message || 'Không thể tải danh sách đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  // Hàm lấy thông tin sản phẩm từ API
  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        'http://localhost/restapirestaurant/products'
      );

      let productsData = {};
      if (response.data) {
        let productsList = [];
        
        if (Array.isArray(response.data)) {
          productsList = response.data;
        } else if (response.data.data && Array.isArray(response.data.data)) {
          productsList = response.data.data;
        }
        
        // Chuyển mảng products thành object với id làm key
        productsList.forEach(product => {
          productsData[product.id] = product;
        });
      }
      
      setProducts(productsData);
      
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  // Hàm lấy tên món ăn từ menu_item_id
  const getProductName = (menuItemId) => {
    if (products[menuItemId]) {
      return products[menuItemId].name;
    }
    return `Món #${menuItemId}`;
  };

  // Hàm lấy giá món ăn từ menu_item_id
  const getProductPrice = (menuItemId) => {
    if (products[menuItemId]) {
      return parseFloat(products[menuItemId].price);
    }
    return 0;
  };

  // Hàm lấy mô tả món ăn
  const getProductDescription = (menuItemId) => {
    if (products[menuItemId]) {
      return products[menuItemId].description;
    }
    return '';
  };

  // Hàm lấy ảnh món ăn
  const getProductImage = (menuItemId) => {
    if (products[menuItemId] && products[menuItemId].image) {
      return products[menuItemId].image;
    }
    return 'https://via.placeholder.com/100x100?text=No+Image';
  };

  // Hàm mở modal chi tiết đơn hàng
  const openOrderDetail = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  // Hàm đóng modal
  const closeModal = () => {
    setSelectedOrder(null);
    setShowModal(false);
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('vi-VN');
    } catch (e) {
      return dateString;
    }
  };

  const getStatusBadge = (status) => {
    status = Number(status);
    switch (status) {
      case 0:
        return { text: 'Đang chờ', color: 'bg-yellow-100 text-yellow-800', icon: <FaHourglassHalf className="mr-1" /> };
      case 1:
        return { text: 'Đã xác nhận', color: 'bg-green-100 text-green-800', icon: <FaCheckCircle className="mr-1" /> };
      case 2:
        return { text: 'Đã hoàn thành', color: 'bg-blue-100 text-blue-800', icon: <FaCheckCircle className="mr-1" /> };
      default:
        return { text: 'Đã hủy', color: 'bg-red-100 text-red-800', icon: <FaTimesCircle className="mr-1" /> };
    }
  };

  const formatCurrency = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  // Tính tổng giá trị đơn hàng
  const calculateOrderTotal = (order) => {
    if (order.total_price) {
      return parseFloat(order.total_price);
    }
    
    let total = 0;
    if (order.order_items && order.order_items.length > 0) {
      order.order_items.forEach(item => {
        total += getProductPrice(item.menu_item_id) * item.quantity;
      });
    }
    return total;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4 md:mb-0">
            Lịch Sử Đặt Tiệc
          </h1>
          
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm đơn hàng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-64"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>
        
        {/* Hiển thị số lượng đơn hàng */}
        <div className="bg-white p-3 rounded-lg shadow-sm mb-6">
          <span className="font-medium">Tổng đơn hàng: {filteredOrders.length}</span>
        </div>
        
        {/* Nội dung chính */}
        {loading ? (
          <div className="flex justify-center items-center h-64 bg-white rounded-lg shadow-md">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <div className="text-red-500 mb-4">{error}</div>
            <button 
              onClick={fetchOrders} 
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Thử lại
            </button>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <FaCalendar className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium">Không có đơn hàng nào</h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredOrders.map((order, index) => {
              const statusBadge = getStatusBadge(order.status);
              const orderTotal = calculateOrderTotal(order);
              
              return (
                <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  {/* Header đơn hàng */}
                  <div className="p-4 border-b border-gray-100">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold text-gray-800">
                        Đơn #{order.order_id || order.id}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusBadge.color} flex items-center`}>
                        {statusBadge.icon}
                        {statusBadge.text}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-500 flex items-center">
                      <FaCalendar className="mr-1 text-gray-400" />
                      {formatDate(order.order_date)}
                    </p>
                  </div>

                  {/* Thông tin đơn hàng */}
                  <div className="p-4 space-y-2 border-b border-gray-100">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center text-gray-700">
                        <FaClock className="mr-2 text-blue-500" />
                        <span>{order.order_time}</span>
                      </div>
                      <div className="font-medium text-gray-800 flex items-center">
                        <FaMoneyBillWave className="mr-1 text-green-500" />
                        {formatCurrency(orderTotal)}
                      </div>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <FaUtensils className="mr-2 text-blue-500" />
                      <span className="truncate">{order.style_tiec}</span>
                    </div>
                    {order.customer_name && (
                      <div className="flex items-center text-gray-700">
                        <FaUser className="mr-2 text-blue-500" />
                        <span>{order.customer_name}</span>
                      </div>
                    )}
                  </div>

                  {/* Danh sách món (hiện 2 món đầu) */}
                  <div className="p-4">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-medium text-gray-800 flex items-center">
                        <FaShoppingBasket className="mr-2 text-blue-500" />
                        Món đã đặt:
                      </h4>
                      <button
                        onClick={() => openOrderDetail(order)}
                        className="py-1 px-3 bg-blue-500 text-white rounded-lg flex items-center hover:bg-blue-600 transition-colors text-sm"
                      >
                        <FaEye className="mr-1" />
                        Xem chi tiết
                      </button>
                    </div>
                    <div className="space-y-2">
                      {order.order_items && order.order_items.length > 0 ? (
                        <>
                          {order.order_items.slice(0, 2).map((item, idx) => (
                            <div 
                              key={idx}
                              className="flex items-center bg-gray-50 p-2 rounded-lg overflow-hidden"
                            >
                              <div className="w-10 h-10 mr-2 flex-shrink-0">
                                <img 
                                  src={getProductImage(item.menu_item_id)} 
                                  alt={getProductName(item.menu_item_id)}
                                  className="w-full h-full object-cover rounded"
                                  onError={(e) => {e.target.src = 'https://via.placeholder.com/100x100?text=Món+ăn'}}
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-gray-800 text-sm truncate">
                                  {getProductName(item.menu_item_id)}
                                </p>
                                <p className="text-xs text-gray-500">
                                  SL: {item.quantity}
                                </p>
                              </div>
                            </div>
                          ))}
                          
                          {/* Nếu có nhiều hơn 2 món, hiển thị thông báo xem thêm */}
                          {order.order_items.length > 2 && (
                            <div className="text-center mt-2">
                              <span className="text-xs text-gray-500">
                                +{order.order_items.length - 2} món khác
                              </span>
                            </div>
                          )}
                        </>
                      ) : (
                        <p className="text-gray-500 text-center py-3 bg-gray-50 rounded-lg text-sm">
                          Không có thông tin món
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal chi tiết đơn hàng */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-auto">
            <div className="sticky top-0 bg-white p-4 border-b border-gray-200 flex justify-between items-center z-10">
              <h2 className="text-lg font-bold text-gray-800">
                Chi tiết đơn hàng #{selectedOrder.order_id || selectedOrder.id}
              </h2>
              <button 
                onClick={closeModal}
                className="text-gray-500 hover:text-red-500"
              >
                <FaTimes size={20} />
              </button>
            </div>
            
            <div className="p-4">
              {/* Thông tin cơ bản */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Ngày đặt:</span>
                    <span className="font-medium">{formatDate(selectedOrder.order_date)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Giờ đặt:</span>
                    <span className="font-medium">{selectedOrder.order_time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Loại tiệc:</span>
                    <span className="font-medium">{selectedOrder.style_tiec}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Trạng thái:</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(selectedOrder.status).color}`}>
                      {getStatusBadge(selectedOrder.status).text}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  {selectedOrder.customer_name && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Khách hàng:</span>
                      <span className="font-medium">{selectedOrder.customer_name}</span>
                    </div>
                  )}
                  {selectedOrder.phone_number && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Số điện thoại:</span>
                      <span className="font-medium">{selectedOrder.phone_number}</span>
                    </div>
                  )}
                  {selectedOrder.num_people && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Số người:</span>
                      <span className="font-medium">{selectedOrder.num_people}</span>
                    </div>
                  )}
                  {selectedOrder.special_request && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Yêu cầu đặc biệt:</span>
                      <span className="font-medium">{selectedOrder.special_request}</span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Danh sách món */}
              <div className="mt-4">
                <h3 className="font-medium mb-3 border-b pb-2">Danh sách món đã đặt</h3>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="py-2 px-3 text-left">Món ăn</th>
                        <th className="py-2 px-3 text-center">SL</th>
                        <th className="py-2 px-3 text-right">Đơn giá</th>
                        <th className="py-2 px-3 text-right">Thành tiền</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder.order_items && selectedOrder.order_items.map((item, idx) => {
                        const price = getProductPrice(item.menu_item_id);
                        const total = price * item.quantity;
                        return (
                          <tr key={idx} className="border-b">
                            <td className="py-2 px-3">
                              <div className="flex items-center">
                                <div className="w-10 h-10 mr-2 flex-shrink-0">
                                  <img 
                                    src={getProductImage(item.menu_item_id)}
                                    alt={getProductName(item.menu_item_id)}
                                    className="w-full h-full object-cover rounded"
                                    onError={(e) => {e.target.src = 'https://via.placeholder.com/100x100?text=Món+ăn'}}
                                  />
                                </div>
                                <div>
                                  <div className="font-medium">{getProductName(item.menu_item_id)}</div>
                                  <div className="text-xs text-gray-500">
                                    {getProductDescription(item.menu_item_id)}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="py-2 px-3 text-center">{item.quantity}</td>
                            <td className="py-2 px-3 text-right">{formatCurrency(price)}</td>
                            <td className="py-2 px-3 text-right font-medium">{formatCurrency(total)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot>
                      <tr className="font-bold bg-gray-50">
                        <td colSpan="3" className="py-2 px-3 text-right">Tổng cộng:</td>
                        <td className="py-2 px-3 text-right text-blue-600">
                          {formatCurrency(calculateOrderTotal(selectedOrder))}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
              
              {/* Footer modal */}
              <div className="mt-6 flex justify-end">
                <button
                  onClick={closeModal}
                  className="py-2 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingHistory;