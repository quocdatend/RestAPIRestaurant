import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost/restapirestaurant';

const BookingDetailModal = ({ booking, onClose }) => {
  const [products, setProducts] = useState([]);

  // Hàm lấy danh sách sản phẩm từ API
  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}/products`);
      if (response.data && Array.isArray(response.data)) {
        setProducts(response.data);
      }
    } catch (error) {
      console.error('Lỗi khi lấy danh sách sản phẩm:', error);
    }
  };

  // Gọi API lấy danh sách sản phẩm khi component được render
  useEffect(() => {
    fetchProducts();
  }, []);

  // Hàm xử lý các món trùng nhau và cộng dồn số lượng
  const processOrderItems = (orderItems) => {
    const groupedItems = orderItems.reduce((acc, item) => {
      const existingItem = acc.find((i) => i.menu_item_id === item.menu_item_id);
      if (existingItem) {
        existingItem.quantity += 1; // Cộng dồn số lượng
      } else {
        acc.push({ ...item, quantity: 1 }); // Thêm món mới với số lượng ban đầu là 1
      }
      return acc;
    }, []);
    return groupedItems;
  };

  // Gộp các món trùng nhau
  const processedItems = processOrderItems(booking.order_items);

  // Hàm lấy tên món ăn dựa trên menu_item_id
  const getProductName = (menuItemId) => {
    const product = products.find((p) => p.id === menuItemId);
    return product ? product.name : `Món #${menuItemId}`;
  };

  // Hàm lấy giá món ăn dựa trên menu_item_id
  const getProductPrice = (menuItemId) => {
    const product = products.find((p) => p.id === menuItemId);
    return product ? parseFloat(product.price) : 0;
  };

  // Tính tổng giá tiền của đơn hàng
  const calculateTotalPrice = () => {
    return processedItems.reduce((total, item) => {
      const price = getProductPrice(item.menu_item_id);
      return total + price * item.quantity;
    }, 0);
  };

  const totalPrice = calculateTotalPrice();

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-2xl w-full mx-4 my-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Chi tiết đặt chỗ</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Thông tin cơ bản</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Mã đặt chỗ</p>
              <p className="mt-1">{booking.order_id}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Ngày và giờ</p>
              <p className="mt-1">{`${booking.order_date} ${booking.order_time}`}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Loại tiệc</p>
              <p className="mt-1">{booking.style_tiec}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Số lượng món</p>
              <p className="mt-1">{processedItems.length} món</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Tổng giá tiền</p>
              <p className="mt-1 text-green-600 font-semibold">{totalPrice.toLocaleString('vi-VN')} VND</p>
            </div>
          </div>
        </div>

        <div className="space-y-4 mt-4">
          <h3 className="text-lg font-semibold text-gray-800">Danh sách món</h3>
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tên món
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Số lượng
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Giá
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {processedItems.map((item, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                      {getProductName(item.menu_item_id)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-800">
                      {item.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-800">
                      {(getProductPrice(item.menu_item_id) * item.quantity).toLocaleString('vi-VN')} VND
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailModal;