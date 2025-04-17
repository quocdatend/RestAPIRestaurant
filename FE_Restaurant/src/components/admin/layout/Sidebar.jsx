import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MdDashboard, MdPeople, MdRestaurantMenu, MdEvent, MdShoppingCart, MdSettings } from 'react-icons/md';

const Sidebar = () => {
  const location = useLocation();
  
  const menuItems = [
    { 
      title: 'Tổng quan', 
      path: '/admin', 
      icon: <MdDashboard size={20} />
    },
    { 
      title: 'Quản lý người dùng', 
      path: '/admin/users', 
      icon: <MdPeople size={20} />
    },
    { 
      title: 'Quản lý thực đơn', 
      path: '/admin/menu', 
      icon: <MdRestaurantMenu size={20} />
    },
  
    { 
      title: 'Đơn hàng', 
      path: '/admin/orders', 
      icon: <MdShoppingCart size={20} />
    },
    { 
      title: 'Đánh Giá Người Dùng', 
      path: '/admin/review', 
      icon: <MdSettings size={20} />
    }
  ];

  return (
    <div className="w-64 min-h-screen bg-gray-900">
      <div className="p-4">
        <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
      </div>
      
      <nav className="mt-8">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center px-6 py-3 ${
              location.pathname === item.path 
                ? 'bg-gray-800 text-white' 
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
          >
            <div className="flex items-center space-x-3">
              {item.icon}
              <span>{item.title}</span>
            </div>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;