import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axios from 'axios';

// Components
import LoginForm from '../../components/User/auth/LoginForm';
import ForgotPasswordForm from '../../components/User/auth/ForgotPasswordForm';
import ResetPasswordForm from '../../components/User/auth/ResetPasswordForm';

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  // Xác định form hiện tại dựa vào path
  const getCurrentForm = () => {
    const path = location.pathname;
    if (path === '/forgot-password') return 'forgot';
    if (path.includes('/reset-password')) return 'reset';
    return 'login';
  };

  // Xử lý đăng nhập
  const handleLogin = async (formData) => {
    setIsLoading(true);
    try {
      const response = await axios.post('/api/auth/login', formData);
      const { token, user } = response.data;

      // Lưu token vào localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      toast.success('Đăng nhập thành công!');
      
      // Chuyển hướng về trang chủ hoặc trang được yêu cầu trước đó
      const redirectPath = location.state?.from || '/';
      navigate(redirectPath);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Đăng nhập thất bại');
    } finally {
      setIsLoading(false);
    }
  };

  // Xử lý quên mật khẩu
  const handleForgotPassword = async (email) => {
    try {
      setIsLoading(true);
      // Gọi API forgot password
      const response = await axios.post('/api/auth/forgot-password', { email });
      
      // Nếu API trả về thành công, return true để component con biết
      if (response.data) {
        toast.success('Email đã được gửi thành công!');
        return true;
      }
      return false;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Xử lý đặt lại mật khẩu
  const handleResetPassword = async (token, password) => {
    setIsLoading(true);
    try {
      await axios.post('/api/auth/reset-password', {
        token,
        password
      });
      toast.success('Đặt lại mật khẩu thành công!');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
      setIsLoading(false);
    }
  };

  // Xử lý đăng xuất
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
    toast.success('Đăng xuất thành công!');
  };

  // Render form tương ứng
  const renderForm = () => {
    const currentForm = getCurrentForm();

    switch (currentForm) {
      case 'forgot':
        return (
          <ForgotPasswordForm 
            onSubmit={handleForgotPassword}
            isLoading={isLoading}
          />
        );
      case 'reset':
        return (
          <ResetPasswordForm
            onSubmit={handleResetPassword}
            isLoading={isLoading}
          />
        );
      default:
        return (
          <LoginForm
            onSubmit={handleLogin}
            isLoading={isLoading}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-white">
      <div className="container mx-auto px-4 py-8">
        {/* Logo hoặc branding */}
        <div className="text-center mb-8">
          <img 
            src="/logo.png" 
            alt="Logo" 
            className="h-16 mx-auto mb-4"
          />
        </div>

        {/* Form container */}
        <div className="max-w-md mx-auto">
          {renderForm()}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>© 2024 Your Restaurant. All rights reserved.</p>
        </div>
      </div>

      {/* Loading overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
        </div>
      )}
    </div>
  );
};

export default Auth; 