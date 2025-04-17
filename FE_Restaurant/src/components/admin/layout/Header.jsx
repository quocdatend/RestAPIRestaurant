import React, { useState } from 'react';
import { MdSearch, MdNotifications, MdMenu, MdPerson, MdLogout, MdSettings, MdKeyboardArrowDown } from 'react-icons/md';

const Header = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <header className="bg-white shadow-md">
      <div className="flex justify-between items-center px-6 py-4">
        <div className="flex items-center">
          <button className="md:hidden mr-4">
            <MdMenu size={24} />
          </button>
          <div className="relative">
            <input
              type="search"
              placeholder="Tìm kiếm..."
              className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <MdSearch className="absolute left-3 top-2.5 text-gray-400" size={20} />
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="relative p-2 hover:bg-gray-100 rounded-full">
            <MdNotifications size={20} />
            <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
              3
            </span>
          </button>
          
          <div className="relative">
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <div className="relative">
                <img
                  src="/avatar-placeholder.png"
                  alt="Admin"
                  className="w-8 h-8 rounded-full"
                />
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-gray-700">Admin Name</p>
                <p className="text-xs text-gray-500">Super Admin</p>
              </div>
              <MdKeyboardArrowDown 
                className={`transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} 
                size={20}
              />
            </button>

            {/* Dropdown Menu */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50">
                <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                  <MdPerson className="mr-2" size={18} />
                  Thông tin cá nhân
                </button>
                <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                  <MdSettings className="mr-2" size={18} />
                  Cài đặt
                </button>
                <hr className="my-1" />
                <button className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100 flex items-center">
                  <MdLogout className="mr-2" size={18} />
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;