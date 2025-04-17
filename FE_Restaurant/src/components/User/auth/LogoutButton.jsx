// src/components/User/auth/LogoutButton.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSignOutAlt } from 'react-icons/fa';
import { logout } from '../../../services/authService';
import { motion } from 'framer-motion';

const LogoutButton = ({ className, variant = 'primary' }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    const response = logout();
    if (response.status) {
      navigate('/login');
    }
  };

  const getButtonStyles = () => {
    const baseStyles = "flex items-center justify-center rounded-lg focus:outline-none transition-all duration-200";

    if (variant === 'primary') {
      return `${baseStyles} bg-red-600 hover:bg-red-700 text-white px-4 py-2 shadow-md`;
    } else if (variant === 'secondary') {
      return `${baseStyles} bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1`;
    } else if (variant === 'icon') {
      return `${baseStyles} text-gray-500 hover:text-red-600 p-2 hover:bg-red-50 rounded-full`;
    } else if (variant === 'text') {
      return `${baseStyles} text-red-600 hover:text-red-700 hover:underline`;
    }

    return baseStyles;
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleLogout}
      className={className || getButtonStyles()}
      aria-label="Đăng xuất"
    >
      <FaSignOutAlt className={variant === 'icon' ? "h-5 w-5" : "h-4 w-4 mr-2"} />
      {variant !== 'icon' && <span>Đăng xuất</span>}
    </motion.button>
  );
};

export default LogoutButton;