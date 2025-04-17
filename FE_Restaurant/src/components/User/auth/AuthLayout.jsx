// src/components/User/auth/AuthLayout.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const AuthLayout = ({ children, title, subtitle, linkText, linkTo }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center">
            <Link to="/">
              <img
                className="mx-auto h-16 w-auto"
                src="/logo.png"  // Thay đổi đường dẫn logo nếu cần
                alt="Logo"
              />
            </Link>
            
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              {title}
            </h2>
            
            {subtitle && linkText && linkTo && (
              <p className="mt-2 text-center text-sm text-gray-600">
                {subtitle}{' '}
                <Link
                  to={linkTo}
                  className="font-medium text-red-600 hover:text-red-500"
                >
                  {linkText}
                </Link>
              </p>
            )}
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10"
        >
          {children}
        </motion.div>
        
        <div className="text-center mt-4 text-sm text-gray-500">
          <Link to="/" className="text-red-600 hover:text-red-500">
            « Quay lại trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;