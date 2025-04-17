// src/components/User/auth/ResetPasswordForm.jsx
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaLock, FaCheckCircle, FaTimesCircle, FaCheck } from 'react-icons/fa';
import { toast } from 'react-toastify';

const ResetPasswordForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { token } = useParams();
  const [error, setError] = useState('');

  // Kiểm tra độ mạnh của mật khẩu
  const passwordStrength = {
    length: formData.password.length >= 8,
    uppercase: /[A-Z]/.test(formData.password),
    lowercase: /[a-z]/.test(formData.password),
    number: /[0-9]/.test(formData.password),
    special: /[!@#$%^&*]/.test(formData.password),
  };

  const passwordsMatch = formData.password === formData.confirmPassword 
    && formData.confirmPassword !== '';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Kiểm tra mật khẩu đủ mạnh
    if (!Object.values(passwordStrength).every(Boolean)) {
      toast.error('Mật khẩu chưa đủ mạnh');
      return;
    }

    if (!passwordsMatch) {
      toast.error('Mật khẩu xác nhận không khớp');
      return;
    }

    try {
      setLoading(true);
      await onSubmit(token, formData.password);
      navigate('/login', { 
        state: { message: 'Đặt lại mật khẩu thành công! Vui lòng đăng nhập.' } 
      });
    } catch (error) {
      toast.error('Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div>
          <div className="mx-auto w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
            <FaLock className="h-8 w-8 text-indigo-600" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Đặt lại mật khẩu
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Tạo mật khẩu mới an toàn cho tài khoản của bạn
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Mật khẩu mới */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Mật khẩu mới
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Nhập mật khẩu mới"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={loading}
                  minLength="6"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? 
                    <FaEyeSlash className="h-5 w-5 text-gray-400" /> : 
                    <FaEye className="h-5 w-5 text-gray-400" />
                  }
                </button>
              </div>
            </div>

            {/* Xác nhận mật khẩu */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Xác nhận mật khẩu
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Xác nhận mật khẩu mới"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={loading}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? 
                    <FaEyeSlash className="h-5 w-5 text-gray-400" /> : 
                    <FaEye className="h-5 w-5 text-gray-400" />
                  }
                </button>
              </div>
            </div>

            {/* Kiểm tra độ mạnh mật khẩu */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">Yêu cầu mật khẩu:</p>
              <div className="grid grid-cols-1 gap-2">
                <div className="flex items-center space-x-2">
                  {passwordStrength.length ? 
                    <FaCheckCircle className="text-green-500" /> : 
                    <FaTimesCircle className="text-red-500" />
                  }
                  <span className="text-sm text-gray-600">Ít nhất 8 ký tự</span>
                </div>
                <div className="flex items-center space-x-2">
                  {passwordStrength.uppercase ? 
                    <FaCheckCircle className="text-green-500" /> : 
                    <FaTimesCircle className="text-red-500" />
                  }
                  <span className="text-sm text-gray-600">Ít nhất 1 chữ hoa</span>
                </div>
                <div className="flex items-center space-x-2">
                  {passwordStrength.lowercase ? 
                    <FaCheckCircle className="text-green-500" /> : 
                    <FaTimesCircle className="text-red-500" />
                  }
                  <span className="text-sm text-gray-600">Ít nhất 1 chữ thường</span>
                </div>
                <div className="flex items-center space-x-2">
                  {passwordStrength.number ? 
                    <FaCheckCircle className="text-green-500" /> : 
                    <FaTimesCircle className="text-red-500" />
                  }
                  <span className="text-sm text-gray-600">Ít nhất 1 số</span>
                </div>
                <div className="flex items-center space-x-2">
                  {passwordStrength.special ? 
                    <FaCheckCircle className="text-green-500" /> : 
                    <FaTimesCircle className="text-red-500" />
                  }
                  <span className="text-sm text-gray-600">Ít nhất 1 ký tự đặc biệt (!@#$%^&*)</span>
                </div>
                <div className="flex items-center space-x-2">
                  {passwordsMatch ? 
                    <FaCheckCircle className="text-green-500" /> : 
                    <FaTimesCircle className="text-red-500" />
                  }
                  <span className="text-sm text-gray-600">Mật khẩu xác nhận khớp</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading || !passwordsMatch || !Object.values(passwordStrength).every(Boolean)}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Đang xử lý...
                </span>
              ) : (
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <FaCheck className="h-5 w-5 text-yellow-500 group-hover:text-yellow-400" />
                </span>
              )}
              Đặt lại mật khẩu
            </button>
          </div>
        </form>

        <div className="text-center">
          <a 
            href="/login" 
            className="text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200"
          >
            Quay lại đăng nhập
          </a>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordForm;