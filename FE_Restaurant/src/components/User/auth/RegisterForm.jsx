// src/components/User/auth/RegisterForm.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaUser, FaEnvelope, FaUserPlus } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import FormInput from './FormInput';
import PasswordInput from './PasswordInput';
import SubmitButton from './SubmitButton';
import AuthMessage from './AuthMessage';
import authService from '../../../services/authService';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState({ text: '', type: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
    
    if (message.type === 'error') {
      setMessage({ text: '', type: '' });
    }
    
    if ((name === 'password' && formData.confirmPassword && value !== formData.confirmPassword) || 
        (name === 'confirmPassword' && value !== formData.password)) {
      setErrors(prev => ({ ...prev, confirmPassword: 'Mật khẩu không khớp' }));
    } else if (name === 'confirmPassword' && value === formData.password) {
      setErrors(prev => ({ ...prev, confirmPassword: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name) {
      newErrors.name = "Vui lòng nhập tên đăng nhập";
    } else if (formData.name.length < 4) {
      newErrors.name = "Tên đăng nhập phải có ít nhất 4 ký tự";
    }
    
    if (!formData.email) {
      newErrors.email = "Vui lòng nhập email";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }
    
    if (!formData.password) {
      newErrors.password = "Vui lòng nhập mật khẩu";
    } else if (formData.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Vui lòng xác nhận mật khẩu";
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = "Mật khẩu không khớp";
    }
    
    if (!agreeTerms) {
      newErrors.terms = "Bạn phải đồng ý với điều khoản dịch vụ";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    setMessage({ text: '', type: '' });
    
    try {
      const response = await authService.register({
        username: formData.name,
        email: formData.email,
        password: formData.password
      });

      console.log('Register response:', response);

      if (response && response.status === true) {
        setMessage({
          text: "Đăng ký thành công! Vui lòng đăng nhập.",
          type: "success"
        });
        
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setMessage({
          text: response?.message || 'Đăng ký thất bại',
          type: 'error'
        });
      }
    } catch (error) {
      console.error('Registration error:', error);
      setMessage({
        text: 'Có lỗi xảy ra trong quá trình đăng ký',
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-auto overflow-hidden"
    >
      <div className="text-center mb-6">
        <motion.div 
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          className="h-16 w-16 bg-gradient-to-br from-yellow-400 to-red-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-3"
        >
          <FaUserPlus />
        </motion.div>
        <h2 className="text-3xl font-extrabold text-gray-800 mb-2">Tạo Tài Khoản</h2>
        <p className="text-gray-600">Tham gia cùng chúng tôi để có trải nghiệm tốt nhất</p>
      </div>
      
      <AnimatePresence>
        {message.text && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <AuthMessage message={message.text} type={message.type} />
          </motion.div>
        )}
      </AnimatePresence>
      
      <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-3">
          <FormInput
            id="name"
            name="name"
            type="text"
            label="Họ và tên"
            value={formData.name}
            onChange={handleChange}
            placeholder="Nhập họ và tên"
            error={errors.name}
            icon={FaUser}
            required
            className="bg-gray-50 border-0 rounded-lg shadow-sm"
          />
          
          <FormInput
            id="email"
            name="email"
            type="email"
            label="Email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Nhập email"
            error={errors.email}
            icon={FaEnvelope}
            required
            className="bg-gray-50 border-0 rounded-lg shadow-sm"
          />
          
          <PasswordInput
            id="password"
            name="password"
            label="Mật khẩu"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            required
            className="bg-gray-50 border-0 rounded-lg shadow-sm"
          />
          
          <PasswordInput
            id="confirmPassword"
            name="confirmPassword"
            label="Xác nhận mật khẩu"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            required
            className="bg-gray-50 border-0 rounded-lg shadow-sm"
          />
        </div>
        
        <div className="flex items-start mt-4">
          <div className="flex items-center h-5">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              checked={agreeTerms}
              onChange={() => setAgreeTerms(!agreeTerms)}
              className="h-4 w-4 text-yellow-500 focus:ring-yellow-400 border-gray-300 rounded"
            />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor="terms" className={`text-gray-600 ${errors.terms ? 'text-red-600' : ''}`}>
              Tôi đồng ý với <a href="#" className="text-yellow-600 hover:underline">Điều khoản dịch vụ</a> và <a href="#" className="text-yellow-600 hover:underline">Chính sách bảo mật</a>
            </label>
            {errors.terms && <p className="text-red-600 mt-1 text-xs">{errors.terms}</p>}
          </div>
        </div>
        
        <div className="mt-6">
          <SubmitButton 
            isLoading={isLoading} 
            text="Đăng ký ngay"
            className="bg-gradient-to-r from-yellow-500 to-red-600 hover:from-yellow-600 hover:to-red-700 w-full py-3 rounded-lg shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] text-white font-medium"
          />
        </div>
        
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Đã có tài khoản?{' '}
            <Link to="/login" className="font-medium text-yellow-600 hover:text-yellow-500 transition-colors">
              Đăng nhập
            </Link>
          </p>
        </div>
      </form>
    </motion.div>
  );
};

export default RegisterForm;