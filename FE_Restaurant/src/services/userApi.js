// src/data/userApi.js
import axios from 'axios';
import CryptoJS from 'crypto-js';

const API_URL = 'http://localhost/RestAPIRestaurant/users';

/**
 * Kiểm tra định dạng số điện thoại
 * @param {string} phone - Số điện thoại cần kiểm tra
 * @returns {boolean} Kết quả kiểm tra
 */
const isValidPhoneNumber = (phone) => {
  if (!phone) return true; // Cho phép trống
  return phone.length >= 9 && phone.length <= 11 && /^\d+$/.test(phone);
};

/**
 * Kiểm tra định dạng email
 * @param {string} email - Email cần kiểm tra
 * @returns {boolean} Kết quả kiểm tra
 */
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Hàm đăng ký người dùng mới
 * @param {object} userData - Thông tin người dùng từ form
 * @returns {Promise} Kết quả xử lý
 */
export const registerUser = async (userData) => {
  try {
    // Validate dữ liệu
    if (!userData.name || !userData.name.trim()) {
      throw new Error('Họ tên không được để trống');
    }
    
    if (!userData.email || !isValidEmail(userData.email)) {
      throw new Error('Email không hợp lệ');
    }
    
    if (userData.phone && !isValidPhoneNumber(userData.phone)) {
      throw new Error('Số điện thoại không hợp lệ');
    }
    
    if (!userData.password || userData.password.length < 6) {
      throw new Error('Mật khẩu phải có ít nhất 6 ký tự');
    }
    
    // Mã hóa mật khẩu
    const hashedPassword = CryptoJS.SHA256(userData.password).toString();
    
    // Chuẩn bị dữ liệu gửi đi
    const postData = {
      username: userData.name, // Chuyển name thành username cho API
      password: hashedPassword,
      email: userData.email,
      phone: userData.phone || ''
    };
    
    // Gọi API với Axios
    const response = await axios.post(API_URL, postData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    // Kiểm tra kết quả
    const data = response.data;
    
    if (!data.status && data.status !== undefined) {
      throw new Error(data.message || 'Đăng ký thất bại');
    }
    
    return data;
  } catch (error) {
    // Xử lý các loại lỗi
    if (error.response) {
      // Lỗi từ server với status code
      const errorMessage = error.response.data.message || 'Đăng ký thất bại. Vui lòng thử lại.';
      console.error('Lỗi từ server:', error.response.data);
      throw new Error(errorMessage);
    } else if (error.request) {
      // Lỗi không nhận được response
      console.error('Không nhận được phản hồi từ server:', error.request);
      throw new Error('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng và thử lại sau.');
    } else {
      // Lỗi khác
      console.error('Lỗi đăng ký:', error.message);
      throw error;
    }
  }
};

// Có thể thêm các API functions khác ở đây (login, getUserInfo, etc.)