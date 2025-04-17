import axios from 'axios';

const API_URL = 'http://localhost/restapirestaurant';

// Lấy userId từ token
export const getUserIdFromToken = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Không tìm thấy token');
    }

    const response = await axios.get(`${API_URL}/users/response`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.data && response.data.data && response.data.data.sub) {
      return response.data.data.sub;
    }

    throw new Error('Không tìm thấy userId trong response');
  } catch (error) {
    console.error('Lỗi khi lấy userId từ token:', error);
    throw error;
  }
};

// Lấy danh sách đơn hàng theo userId
export const getOrdersByUserId = async (userId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/order/user/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.data && Array.isArray(response.data)) {
      return response.data;
    }

    throw new Error('Dữ liệu trả về từ API không hợp lệ');
  } catch (error) {
    console.error('Lỗi khi lấy danh sách đơn hàng:', error);
    throw error;
  }
};