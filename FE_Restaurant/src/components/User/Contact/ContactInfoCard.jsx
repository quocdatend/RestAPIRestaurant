// src/pages/Contact/ContactInfoCard.jsx
import React from 'react';
import { motion } from 'framer-motion'; // Thêm nếu bạn đã cài framer-motion

function ContactInfoCard({ 
  icon: Icon, 
  title, 
  content, 
  link, 
  variant = 'default', // default, horizontal, compact
  color = 'amber', // amber, red, blue, green
  className = '',
  linkText = 'Xem chi tiết',
  showLinkButton = false
}) {
  // Định nghĩa các màu dựa vào prop color
  const colors = {
    amber: {
      bg: 'bg-amber-50',
      text: 'text-amber-600',
      hover: 'group-hover:bg-amber-600',
      border: 'border-amber-200',
      buttonBg: 'bg-amber-600 hover:bg-amber-700'
    },
    red: {
      bg: 'bg-red-50',
      text: 'text-red-600',
      hover: 'group-hover:bg-red-600',
      border: 'border-red-200',
      buttonBg: 'bg-red-600 hover:bg-red-700'
    },
    blue: {
      bg: 'bg-blue-50',
      text: 'text-blue-600',
      hover: 'group-hover:bg-blue-600',
      border: 'border-blue-200',
      buttonBg: 'bg-blue-600 hover:bg-blue-700'
    },
    green: {
      bg: 'bg-green-50',
      text: 'text-green-600',
      hover: 'group-hover:bg-green-600',
      border: 'border-green-200',
      buttonBg: 'bg-green-600 hover:bg-green-700'
    }
  };
  
  const selectedColor = colors[color] || colors.amber;
  
  // Xác định class dựa trên variant
  const getVariantClasses = () => {
    switch(variant) {
      case 'horizontal':
        return 'flex flex-row items-start text-left p-5';
      case 'compact':
        return 'flex flex-col items-center p-4 text-center';
      case 'bordered':
        return `flex flex-col items-center p-6 text-center border ${selectedColor.border} border-2`;
      default:
        return 'flex flex-col items-center p-6 text-center';
    }
  };
  
  const CardContent = () => (
    <div className={`
      ${getVariantClasses()} 
      bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 
      h-full group ${className}
      transform hover:-translate-y-1 hover:scale-[1.01]
    `}>
      {/* Icon container */}
      <div className={`
        ${variant === 'horizontal' ? 'mr-5' : 'mb-4'} 
        ${variant === 'compact' ? 'w-12 h-12' : 'w-16 h-16'} 
        ${selectedColor.bg} rounded-full flex items-center justify-center 
        ${selectedColor.text} ${selectedColor.hover} group-hover:text-white 
        transition-all duration-300 shadow-sm
      `}>
        <Icon className={variant === 'compact' ? 'w-5 h-5' : 'w-7 h-7'} />
      </div>
      
      {/* Content */}
      <div className={variant === 'horizontal' ? 'flex-1' : 'w-full'}>
        <h3 className={`
          ${variant === 'compact' ? 'text-base' : 'text-lg'} 
          font-semibold text-gray-800 ${variant === 'horizontal' ? 'mb-1' : 'mb-2'}
        `}>
          {title}
        </h3>
        
        <p className={`
          text-gray-600 
          ${variant === 'compact' ? 'text-sm' : ''}
          ${variant === 'horizontal' && content.length > 40 ? 'line-clamp-2' : ''}
        `}>
          {content}
        </p>
        
        {/* Link button */}
        {link && showLinkButton && (
          <div className={`
            ${variant === 'horizontal' ? 'mt-2' : 'mt-4'}
          `}>
            <span className={`
              inline-block text-sm font-medium px-3 py-1.5 rounded-lg
              ${selectedColor.buttonBg} text-white transition-colors duration-300
            `}>
              {linkText}
            </span>
          </div>
        )}
      </div>
    </div>
  );

  if (link) {
    return (
      <a href={link} className="block hover:no-underline" target={link.startsWith('http') ? '_blank' : '_self'} rel="noopener noreferrer">
        <CardContent />
      </a>
    );
  }

  return <CardContent />;
}

export default ContactInfoCard;