// src/components/User/auth/SubmitButton.jsx
import { motion } from 'framer-motion';
import React from 'react';
import { FaPaperPlane } from 'react-icons/fa';

const SubmitButton = ({ isLoading, text, loadingText = "Đang xử lý...", icon = <FaPaperPlane className="h-5 w-5" /> }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      type="submit"
      disabled={isLoading}
      className={`w-full flex justify-center py-3 px-6 border border-transparent text-base font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 shadow-md transition-colors duration-300 ${
        isLoading ? "opacity-70 cursor-not-allowed" : ""
      }`}
    >
      {isLoading ? (
        <div className="flex items-center space-x-2">
          <FaPaperPlane className="animate-spin h-5 w-5" />
          {loadingText}
        </div>
      ) : (
        <div className="flex items-center space-x-2">
          <span className="relative">
            {icon}
          </span>
          {text}
        </div>
      )}
    </motion.button>
  );
};

export default SubmitButton;