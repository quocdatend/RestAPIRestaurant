// src/services/adminUserService.js
import axios from 'axios';
import { toast } from 'react-toastify';

const BASE_URL = 'http://localhost/restapirestaurant';

const adminUserService = {
  // Lấy danh sách users
  getAllUsers: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/users`);
      return {
        status: true,
        data: response.data
      };
    } catch (error) {
      return {
        status: false,
        message: error.response?.data?.message || 'Không thể tải danh sách người dùng'
      };
    }
  },

  // Lấy thông tin user theo token
  getUserInfo: async (token) => {
    try {
      const response = await axios.get(`${BASE_URL}/users/response`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return {
        status: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error fetching user info:', error);
      return {
        status: false,
        message: error.response?.data?.message || 'Không thể lấy thông tin người dùng'
      };
    }
  },

  // Tạo user mới
  createUser: async (userData) => {
    try {
      const response = await axios.post(`${BASE_URL}/users`, userData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return {
        status: true,
        data: response.data,
        message: 'Tạo tài khoản thành công'
      };
    } catch (error) {
      console.error('Error creating user:', error);
      return {
        status: false,
        message: error.response?.data?.message || 'Không thể tạo tài khoản'
      };
    }
  },

  // Cập nhật thông tin user
  updateUser: async (userId, data) => {
    try {
      const response = await axios.put(`${BASE_URL}/users/${userId}`, data);
      console.log('Update response:', response);

      return {
        status: true,
        message: 'Cập nhật thành công',
        data: response.data
      };
    } catch (error) {
      console.error('Update error:', error);
      throw new Error(error.response?.data?.message || 'Lỗi cập nhật thông tin');
    }
  },

  // Xóa user
  deleteUser: async (userId) => {
    try {
      // Thêm headers và method rõ ràng
      const response = await axios({
        method: 'DELETE',
        url: `${BASE_URL}/users/${userId}`,
        headers: {
          'Content-Type': 'application/json',
          // Thêm headers khác nếu cần
        }
      });

      console.log('Delete response:', response.data);

      // Kiểm tra response
      if (response.data && response.data.status === true) {
        return {
          status: true,
          message: 'Xóa người dùng thành công',
          data: userId
        };
      } else {
        throw new Error(response.data?.message || 'Không thể xóa người dùng');
      }
    } catch (error) {
      console.error('Delete API Error:', error);
      if (error.response?.status === 405) {
        // Xử lý lỗi Method Not Allowed
        throw new Error('Phương thức xóa không được hỗ trợ');
      }
      throw new Error(error.response?.data?.message || 'Lỗi khi xóa người dùng');
    }
  }
};

export default adminUserService;