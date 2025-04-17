import axios from 'axios';

const API_URL = 'http://localhost/restapirestaurant';

// Hàm tạo đơn hàng
export const createOrder = async (orderData) => {
  try {
    const response = await axios.post(`${API_URL}/order`, orderData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi tạo đơn hàng:', error.response?.data || error.message);
    throw error;
  }
};

// Hàm lấy danh sách đơn hàng theo user_id
export const getOrdersByUserId = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/order/user/${userId}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.data && Array.isArray(response.data)) {
      return response.data.map(order => ({
        id: order.id,
        bookingCode: order.order_id,
        customerName: order.customer_name,
        email: order.email,
        phone: order.phone_number || 'Không có',
        style_tiec: order.style_tiec || 'Không xác định',
        num_people: order.num_people || 0,
        special_request: order.special_request || 'Không có',
        status: order.status === 0 ? 'pending' : 'completed',
        total_price: parseFloat(order.total_price || 0).toFixed(2),
        order_date: order.order_date,
        order_time: order.order_time,
        order_items: order.order_items || []
      }));
    }

    return [];
  } catch (error) {
    console.error('Lỗi khi lấy danh sách đơn hàng:', error.response?.data || error.message);
    throw error;
  }
};

// Hàm ánh xạ loại tiệc từ ID sang tên hiển thị
const mapPartyTypeToName = (partyTypeId) => {
  const partyTypes = {
    'normal': 'Đặt bàn thường',
    'birthday': 'Tiệc sinh nhật',
    'anniversary': 'Kỷ niệm',
    'family': 'Tiệc gia đình',
    'business': 'Hội họp',
    'other': 'Khác'
  };

  return partyTypes[partyTypeId] || 'Đặt bàn thường';
};

// Hàm định dạng dữ liệu đặt bàn
export const formatOrderData = (formData, selectedItems, userData) => {
  if (!formData || !selectedItems || !userData) {
    throw new Error('Dữ liệu đầu vào không hợp lệ');
  }

  // Tính tổng tiền
  const totalPrice = selectedItems.reduce(
    (sum, item) => sum + (parseFloat(item.price || 0) * item.quantity), 
    0
  ).toFixed(2);

  // Tạo order_items từ các món đã chọn
  const orderItems = selectedItems.map(item => ({
    menu_item_id: item.id,
    quantity: item.quantity,
    status: "pending"
  }));

  // Cấu trúc dữ liệu theo yêu cầu API
  return {
    user_id: userData?.id,
    username: userData?.username,
    email: userData?.email,
    total_price: totalPrice,
    num_people: parseInt(formData.guests) || 0,
    special_request: formData.request || "",
    customer_name: formData.name,
    order_date: formData.date,
    order_time: formData.time + ":00",
    status: 0,
    style_tiec: mapPartyTypeToName(formData.partyType),
    order_items: orderItems,
    payment_method: "cash"
  };
};