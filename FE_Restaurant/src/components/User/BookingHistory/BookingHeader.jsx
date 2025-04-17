import React from 'react';
import { Link } from 'react-router-dom';

const BookingHeader = () => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold text-gray-900">Lịch sử đặt chỗ</h1>
      <div className="flex space-x-4">
        <Link 
          to="/reservation" 
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
        >
          Đặt tiệc
        </Link>
      </div>
    </div>
  );
};

export default BookingHeader;