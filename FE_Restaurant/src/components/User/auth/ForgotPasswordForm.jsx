// src/components/User/auth/ForgotPasswordForm.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaEnvelope, FaKey } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import FormInput from './FormInput';
import SubmitButton from './SubmitButton';
import AuthMessage from './AuthMessage';
import authService from '../../../services/authService';

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setEmail(e.target.value);
    if (error) setError('');
    if (message.text) setMessage({ text: '', type: '' });
  };

  const validateForm = () => {
    if (!email) {
      setError('Vui lòng nhập email của bạn');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Email không hợp lệ');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      const result = await authService.forgotPassword(email);
      
      if (result.status) {
        setMessage({
          text: 'Link đặt lại mật khẩu đã được gửi vào email của bạn',
          type: 'success'
        });
        setEmail('');
      } else {
        setMessage({
          text: result.message || 'Không thể gửi yêu cầu đặt lại mật khẩu',
          type: 'error'
        });
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      setMessage({
        text: 'Có lỗi xảy ra khi gửi yêu cầu',
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
          <FaKey />
        </motion.div>
        <h2 className="text-3xl font-extrabold text-gray-800 mb-2">Quên Mật Khẩu</h2>
        <p className="text-gray-600">Nhập email của bạn để nhận link đặt lại mật khẩu</p>
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
      
      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <FormInput
          id="email"
          name="email"
          type="email"
          label="Email"
          value={email}
          onChange={handleChange}
          placeholder="Nhập email đã đăng ký"
          error={error}
          icon={FaEnvelope}
          required
          className="bg-gray-50 border-0 rounded-lg shadow-sm"
        />
        
        <div className="mt-6">
          <SubmitButton 
            isLoading={isLoading} 
            text="Gửi yêu cầu"
            className="bg-gradient-to-r from-yellow-500 to-red-600 hover:from-yellow-600 hover:to-red-700 w-full py-3 rounded-lg shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] text-white font-medium"
          />
        </div>
        
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            <Link to="/login" className="font-medium text-yellow-600 hover:text-yellow-500 transition-colors">
              Quay lại đăng nhập
            </Link>
          </p>
        </div>
      </form>
    </motion.div>
  );
};

export default ForgotPasswordForm;