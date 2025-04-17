// src/services/authService.js
import axios from 'axios';

const API_URL = 'http://localhost/restapirestaurant/users';

// Lưu token vào localStorage
const setToken = (token) => {
  localStorage.setItem('token', token);
};

// Lấy token từ localStorage
export const getToken = () => {
  return localStorage.getItem('token');
};

// Xóa token khỏi localStorage
const removeToken = () => {
  localStorage.removeItem('token');
};

// Đăng nhập
export const login = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, {
      username, // Có thể là username hoặc email
      password
    });

    if (response.data && response.data.status === "success") {
      // API của bạn trả về token khi thành công
      setToken(response.data.data); // Lưu token
      return {
        status: true,
        data: response.data.user,
        message: 'Đăng nhập thành công!'
      };
    } else {
      return {
        status: false,
        data: null,
        message: response.data.message || 'Đăng nhập thất bại'
      };
    }
  } catch (error) {
    console.error('Login error:', error);
    return {
      status: false,
      data: null,
      message: error.response?.data?.message || 'Đăng nhập thất bại'
    };
  }
};

// Đăng ký
export const register = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, {
      username: userData.username,
      email: userData.email,
      password: userData.password
    });

    console.log('Register API response:', response);

    // Kiểm tra response.data.status nếu API trả về đối tượng JSON
    if (response.data && response.data.status === "success") {
      return {
        status: true,  // Đã sửa thành TRUE
        data: response.data,
        message: 'Đăng ký thành công!'
      };
    } 
    // Kiểm tra HTTP status code (200-299 là thành công)
    else if (response.status >= 200 && response.status < 300) {
      return {
        status: true,  // Thành công dựa vào HTTP status
        data: response.data,
        message: 'Đăng ký thành công!'
      };
    }
    else {
      return {
        status: false,
        data: null,
        message: response.data && response.data.message ? response.data.message : 'Đăng ký thất bại'
      };
    }
  } catch (error) {
    console.error('Register error:', error);
    return {
      status: false,
      data: null,
      message: error.response?.data?.message || 'Đăng ký thất bại, vui lòng thử lại'
    };
  }
};

// Quên mật khẩu
export const forgotPassword = async (email) => {
  try {
    const response = await axios.post('http://localhost/restapirestaurant/users/sendEmail', 
      { email: email },
      { 
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.data && response.data.status === "success") {
      return {
        status: true,
        message: 'Email đặt lại mật khẩu đã được gửi thành công!'
      };
    } else {
      return {
        status: false,
        message: response.data.message || 'Không thể gửi email đặt lại mật khẩu'
      };
    }
  } catch (error) {
    console.error('Forgot password error:', error);
    return {
      status: false,
      message: error.response?.data?.message || 'Không thể gửi email đặt lại mật khẩu'
    };
  }
};

// Đăng xuất
export const logout = () => {
  removeToken();
  return {
    status: true,
    message: 'Đăng xuất thành công!'
  };
};

export default {
  login,
  register,
  logout,
  getToken,
  forgotPassword
};