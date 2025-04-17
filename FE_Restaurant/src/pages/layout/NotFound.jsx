// src/pages/NotFound.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const NotFound = () => {
  return (
    <div className="bg-white min-h-screen flex flex-col items-center justify-center px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md"
      >
        <h1 className="text-9xl font-extrabold text-red-600">404</h1>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <img 
            src="/images/404-illustration.png" 
            alt="Page not found" 
            className="mx-auto h-48 w-auto my-6"
            onError={(e) => {
              // Fallback nếu không tìm thấy hình ảnh
              e.target.onerror = null;
              e.target.style.display = 'none';
            }}
          />
        </motion.div>
        
        <h2 className="text-2xl font-bold text-gray-900 mt-4">Trang không tồn tại</h2>
        <p className="mt-2 text-gray-600 mb-8">
          Rất tiếc, trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển.
        </p>
        
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link 
            to="/"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Quay về trang chủ
          </Link>
        </motion.div>
        
        <div className="mt-8 border-t border-gray-200 pt-6">
          <p className="text-sm text-gray-500">
            Bạn cần hỗ trợ? <a href="/contact" className="text-red-600 hover:text-red-500">Liên hệ với chúng tôi</a>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;