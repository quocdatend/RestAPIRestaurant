// src/pages/admin/orders.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { 
  FaEye, 
  FaTrash, 
  FaCheck, 
  FaTimes,
  FaSearch,
  FaEdit
} from 'react-icons/fa';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchOrders();
    fetchProducts();
  }, []);

  // Lọc đơn hàng theo từ khóa tìm kiếm và trạng thái
  const filteredOrders = orders.filter(order => 
    (statusFilter === 'all' || Number(order.status) === Number(statusFilter)) &&
    (!searchTerm || 
      (order.order_id && order.order_id.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (order.customer_name && order.customer_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (order.style_tiec && order.style_tiec.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (order.phone_number && order.phone_number.includes(searchTerm))
    )
  );

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Vui lòng đăng nhập để quản lý đơn hàng');
      }

      console.log('Đang lấy danh sách đơn hàng...');
      
      const response = await axios.get(
        'http://localhost/restapirestaurant/order',
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        }
      );

      console.log('Phản hồi API thô:', response);

      // Xử lý dữ liệu API
      let orderData = [];
      
      // Xử lý trường hợp dữ liệu là chuỗi có {"data":null} ở cuối
      if (typeof response.data === 'string') {
        try {
          // Loại bỏ {"data":null} ở cuối chuỗi nếu có
          const cleanedData = response.data.replace(/\{"data":null\}$/, '');
          orderData = JSON.parse(cleanedData);
        } catch (e) {
          console.error('Lỗi khi phân tích chuỗi JSON:', e);
        }
      } 
      // Xử lý trường hợp dữ liệu là mảng
      else if (Array.isArray(response.data)) {
        orderData = response.data;
      } 
      // Xử lý trường hợp dữ liệu có thuộc tính data là mảng
      else if (response.data && response.data.data && Array.isArray(response.data.data)) {
        orderData = response.data.data;
      } 
      // Xử lý trường hợp dữ liệu là đối tượng đơn
      else if (response.data && typeof response.data === 'object') {
        if (response.data.id || response.data.order_id) {
          orderData = [response.data];
        }
      }

      console.log('Dữ liệu đơn hàng đã xử lý:', orderData);
      
      if (!Array.isArray(orderData)) {
        console.error('Dữ liệu không phải là mảng sau khi xử lý:', orderData);
        orderData = [];
      }

      setOrders(orderData);
      setError(null);

    } catch (error) {
      console.error('Lỗi khi lấy danh sách đơn hàng:', error);
      console.error('Chi tiết lỗi:', error.response || error.message);
      setError(error.response?.data?.message || error.message || 'Không thể tải danh sách đơn hàng');
      toast.error('Không thể tải danh sách đơn hàng. Vui lòng kiểm tra console để biết chi tiết.');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // Hàm lấy danh sách sản phẩm
  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost/restapirestaurant/products');
      
      let productsData = [];
      if (response.data) {
        if (Array.isArray(response.data)) {
          productsData = response.data;
        } else if (response.data.data && Array.isArray(response.data.data)) {
          productsData = response.data.data;
        }
      }
      
      setProducts(productsData);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách sản phẩm:', error);
    }
  };

  // Hàm cập nhật trạng thái đơn hàng
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Vui lòng đăng nhập để thực hiện thao tác này');
      }

      console.log(`Cập nhật trạng thái đơn hàng ${orderId} thành ${newStatus}`);

      // Gọi API cập nhật trạng thái
      const response = await axios.put(
        `http://localhost/restapirestaurant/order/status/${orderId}`,
        { newStatus: newStatus.toString() }, // Đảm bảo newStatus là string theo yêu cầu API
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );

      console.log('Phản hồi API cập nhật trạng thái:', response.data);

      // Kiểm tra phản hồi từ API
      if (response.data && response.data.success) {
        // Cập nhật state local
        setOrders(orders.map(order => 
          order.id === orderId ? { ...order, status: Number(newStatus) } : order
        ));

        // Cập nhật order đang được chọn (nếu có)
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder({ ...selectedOrder, status: Number(newStatus) });
        }

        toast.success('Cập nhật trạng thái đơn hàng thành công');
      } else {
        toast.warning('Đã gửi yêu cầu cập nhật, nhưng không nhận được xác nhận từ server');
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật trạng thái đơn hàng:', error);
      console.error('Chi tiết lỗi:', error.response?.data);
      toast.error('Không thể cập nhật trạng thái đơn hàng: ' + 
        (error.response?.data?.message || error.message || 'Lỗi không xác định'));
    }
  };

  // Hàm ngăn reload trang và xóa an toàn
  const safeDeleteOrder = async (orderId) => {
    try {
      // Hiển thị hộp xác nhận
      if (!window.confirm('Bạn có chắc chắn muốn xóa đơn hàng này?')) {
        return;
      }
      
      // Hiển thị thông báo loading
      const toastId = toast.loading('Đang xóa đơn hàng...');
      
      const token = localStorage.getItem('token');
      if (!token) {
        toast.update(toastId, { 
          render: 'Không tìm thấy token đăng nhập', 
          type: 'error',
          isLoading: false,
          autoClose: 2000
        });
        return;
      }
      
      // Tạo request xóa
      const xhr = new XMLHttpRequest();
      xhr.open('DELETE', `http://localhost/restapirestaurant/order/${orderId}`, true);
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.setRequestHeader('Accept', 'application/json');
      
      xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
          console.log('Xóa thành công');
          
          // Cập nhật UI
          setOrders(orders.filter(order => order.id !== orderId));
          
          // Đóng modal nếu đang hiển thị
          if (showModal && selectedOrder && selectedOrder.id === orderId) {
            setShowModal(false);
            setSelectedOrder(null);
          }
          
          toast.update(toastId, { 
            render: 'Xóa đơn hàng thành công', 
            type: 'success',
            isLoading: false,
            autoClose: 2000
          });
        } else {
          console.error('Lỗi:', xhr.status, xhr.responseText);
          toast.update(toastId, { 
            render: `Lỗi: ${xhr.status} - ${xhr.responseText}`, 
            type: 'error',
            isLoading: false,
            autoClose: 2000
          });
        }
      };
      
      xhr.onerror = function() {
        console.error('Lỗi kết nối khi xóa đơn hàng');
        toast.update(toastId, { 
          render: 'Lỗi kết nối khi xóa đơn hàng', 
          type: 'error',
          isLoading: false,
          autoClose: 2000
        });
      };
      
      // Gửi request
      xhr.send();
    } catch (error) {
      console.error('Lỗi:', error);
      toast.error('Không thể xóa đơn hàng: ' + error.message);
    }
    
    return false; // Trả về false để ngăn hành vi mặc định
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

  const getStatusText = (status) => {
    status = Number(status);
    switch (status) {
      case 0:
        return 'Đang chờ';
      case 1:
        return 'Đã xác nhận';
      case 2:
        return 'Đã hoàn thành';
      default:
        return 'Đã hủy';
    }
  };

  const formatCurrency = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  // Hàm lấy tên sản phẩm từ id
  const getProductName = (id) => {
    const product = products.find(p => p.id === parseInt(id));
    return product ? product.name : `Sản phẩm #${id}`;
  };

  // Hàm lấy giá sản phẩm từ id
  const getProductPrice = (id) => {
    const product = products.find(p => p.id === parseInt(id));
    return product ? parseFloat(product.price) : 0;
  };

  // Cập nhật lại hàm deleteOrder để ngăn refresh trang
  const deleteOrder = async (orderId, e) => {
    // Ngăn hành vi mặc định nếu có event được truyền vào
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (!window.confirm('Bạn có chắc chắn muốn xóa đơn hàng này?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Vui lòng đăng nhập để thực hiện thao tác này');
      }

      console.log(`Đang xóa đơn hàng ID: ${orderId}`);

      // Gọi API xóa đơn hàng
      const response = await fetch(
        `http://localhost/restapirestaurant/order/${orderId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );

      // Đọc phản hồi từ server
      const responseText = await response.text();
      console.log('Phản hồi từ server khi xóa:', responseText);
      
      // Kiểm tra phản hồi
      if (response.ok) {
        console.log('Xóa đơn hàng thành công!');
        
        // Cập nhật UI
        setOrders(orders.filter(order => order.id !== orderId));
        
        // Đóng modal nếu đang hiển thị chi tiết đơn hàng đã xóa
        if (showModal && selectedOrder && selectedOrder.id === orderId) {
          setShowModal(false);
          setSelectedOrder(null);
        }
        
        toast.success('Xóa đơn hàng thành công');
      } else {
        console.error('Lỗi khi xóa đơn hàng:', response.status, responseText);
        toast.error(`Không thể xóa đơn hàng: ${response.status} - ${responseText}`);
      }
    } catch (error) {
      console.error('Lỗi khi xóa đơn hàng:', error);
      toast.error('Không thể xóa đơn hàng: ' + error.message);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Quản Lý Đơn Hàng</h1>
      
      {/* Thanh tìm kiếm và bộ lọc */}
      <div className="mb-6 flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Tìm kiếm đơn hàng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded w-full"
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
        
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="py-2 px-4 border border-gray-300 rounded"
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="0">Đang chờ</option>
          <option value="1">Đã xác nhận</option>
          <option value="2">Đã hoàn thành</option>
          <option value="3">Đã hủy</option>
        </select>
        
        <button 
          onClick={fetchOrders} 
          className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Làm mới
        </button>
      </div>
      
      {/* Hiển thị trạng thái */}
      {loading ? (
        <div className="text-center p-10">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
          <p className="mt-2">Đang tải dữ liệu...</p>
        </div>
      ) : error ? (
        <div className="text-center p-10 bg-red-50 rounded-lg">
          <p className="text-red-500">{error}</p>
          <button 
            onClick={fetchOrders} 
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Thử lại
          </button>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center p-10 bg-gray-50 rounded-lg">
          <p className="text-gray-500">Không tìm thấy đơn hàng nào</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2 text-left">Mã đơn</th>
                <th className="border px-4 py-2 text-left">Khách hàng</th>
                <th className="border px-4 py-2 text-left">Ngày đặt</th>
                <th className="border px-4 py-2 text-left">Loại tiệc</th>
                <th className="border px-4 py-2 text-left">Trạng thái</th>
                <th className="border px-4 py-2 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id || order.order_id || 'N/A'} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">#{order.id || order.order_id || 'N/A'}</td>
                  <td className="border px-4 py-2">
                    <div>{order.customer_name || 'Không có tên'}</div>
                    {order.phone_number && <div className="text-xs text-gray-500">{order.phone_number}</div>}
                  </td>
                  <td className="border px-4 py-2">
                    <div>{formatDate(order.order_date)}</div>
                    <div className="text-xs text-gray-500">{order.order_time}</div>
                  </td>
                  <td className="border px-4 py-2">
                    <div>{order.style_tiec}</div>
                    {order.num_people && <div className="text-xs text-gray-500">{order.num_people} người</div>}
                  </td>
                  <td className="border px-4 py-2">
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                      className="w-full p-1 border rounded"
                    >
                      <option value="0">Đang chờ</option>
                      <option value="1">Đã xác nhận</option>
                      <option value="2">Đã hoàn thành</option>
                      <option value="3">Đã hủy</option>
                    </select>
                  </td>
                  <td className="border px-4 py-2 text-center">
                    <button
                      onClick={() => openOrderDetail(order)}
                      className="text-blue-500 hover:text-blue-700 mx-1"
                      title="Xem chi tiết"
                    >
                      <FaEye />
                    </button>
                    <button
                      onClick={() => safeDeleteOrder(order.id)}
                      className="bg-red-500 text-white p-1 rounded"
                      title="Xóa đơn hàng"
                      type="button"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal chi tiết đơn hàng */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center p-4">
          <div className="bg-white rounded shadow-lg w-full max-w-3xl max-h-[90vh] overflow-auto">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-bold">Chi tiết đơn hàng #{selectedOrder.id}</h2>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                <FaTimes />
              </button>
            </div>
            
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="border rounded p-4">
                  <h3 className="font-medium mb-2">Thông tin đơn hàng</h3>
                  <p><strong>Ngày đặt:</strong> {formatDate(selectedOrder.order_date)}</p>
                  <p><strong>Giờ đặt:</strong> {selectedOrder.order_time}</p>
                  <p><strong>Loại tiệc:</strong> {selectedOrder.style_tiec}</p>
                  {selectedOrder.num_people && (
                    <p><strong>Số người:</strong> {selectedOrder.num_people}</p>
                  )}
                  <p><strong>Trạng thái:</strong> {getStatusText(selectedOrder.status)}</p>
                </div>
                
                <div className="border rounded p-4">
                  <h3 className="font-medium mb-2">Thông tin khách hàng</h3>
                  <p><strong>Tên khách hàng:</strong> {selectedOrder.customer_name || 'Không có'}</p>
                  <p><strong>Số điện thoại:</strong> {selectedOrder.phone_number || 'Không có'}</p>
                  {selectedOrder.special_request && (
                    <div>
                      <strong>Yêu cầu đặc biệt:</strong>
                      <p className="mt-1 p-2 bg-gray-50 rounded">{selectedOrder.special_request}</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mb-4">
                <h3 className="font-medium mb-2">Cập nhật trạng thái</h3>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => updateOrderStatus(selectedOrder.id, 0)}
                    className={`px-3 py-1 rounded ${
                      Number(selectedOrder.status) === 0 ? 'bg-yellow-500 text-white' : 'bg-gray-200'
                    }`}
                  >
                    Đang chờ
                  </button>
                  <button
                    onClick={() => updateOrderStatus(selectedOrder.id, 1)}
                    className={`px-3 py-1 rounded ${
                      Number(selectedOrder.status) === 1 ? 'bg-green-500 text-white' : 'bg-gray-200'
                    }`}
                  >
                    Đã xác nhận
                  </button>
                  <button
                    onClick={() => updateOrderStatus(selectedOrder.id, 2)}
                    className={`px-3 py-1 rounded ${
                      Number(selectedOrder.status) === 2 ? 'bg-blue-500 text-white' : 'bg-gray-200'
                    }`}
                  >
                    Đã hoàn thành
                  </button>
                  <button
                    onClick={() => updateOrderStatus(selectedOrder.id, 3)}
                    className={`px-3 py-1 rounded ${
                      Number(selectedOrder.status) === 3 ? 'bg-red-500 text-white' : 'bg-gray-200'
                    }`}
                  >
                    Đã hủy
                  </button>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Danh sách món đã đặt</h3>
                {selectedOrder.order_items && selectedOrder.order_items.length > 0 ? (
                  <table className="w-full border">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border px-2 py-1 text-left">Món ăn</th>
                        <th className="border px-2 py-1 text-center">SL</th>
                        <th className="border px-2 py-1 text-right">Đơn giá</th>
                        <th className="border px-2 py-1 text-right">Thành tiền</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder.order_items.map((item, index) => {
                        const price = getProductPrice(item.menu_item_id);
                        const total = price * item.quantity;
                        
                        return (
                          <tr key={index} className="border-b">
                            <td className="border px-2 py-1">
                              {getProductName(item.menu_item_id)}
                            </td>
                            <td className="border px-2 py-1 text-center">{item.quantity}</td>
                            <td className="border px-2 py-1 text-right">{formatCurrency(price)}</td>
                            <td className="border px-2 py-1 text-right">{formatCurrency(total)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot>
                      <tr className="bg-gray-100">
                        <td colSpan="3" className="border px-2 py-1 text-right font-bold">Tổng cộng:</td>
                        <td className="border px-2 py-1 text-right font-bold">
                          {formatCurrency(
                            selectedOrder.total_price || 
                            selectedOrder.order_items.reduce(
                              (sum, item) => sum + (getProductPrice(item.menu_item_id) * item.quantity), 
                              0
                            )
                          )}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                ) : (
                  <p className="text-center p-4 bg-gray-50 rounded">Không có món ăn nào trong đơn hàng</p>
                )}
              </div>
              
              <form 
                onSubmit={(e) => e.preventDefault()} 
                className="flex justify-end gap-2"
              >
                <button 
                  onClick={(e) => deleteOrder(selectedOrder.id, e)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  type="button"
                >
                  <FaTrash className="inline mr-1" />
                  Xóa
                </button>
                
                <button 
                  onClick={() => setShowModal(false)}
                  className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
                  type="button"
                >
                  Đóng
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      <div className="mb-4">
        <button 
          onClick={fetchOrders} 
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Làm mới dữ liệu
        </button>
      </div>
    </div>
  );
};

export default OrdersPage;