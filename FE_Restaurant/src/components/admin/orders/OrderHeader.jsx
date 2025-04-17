import React from 'react';
import { MdFilterList } from 'react-icons/md';

const OrderHeader = ({ onToggleFilter }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Quản lý đơn hàng</h1>
          <p className="text-gray-500 mt-1">Quản lý và theo dõi tất cả đơn hàng</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button 
            onClick={onToggleFilter}
            className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 flex items-center"
          >
            <MdFilterList className="mr-2" size={20} />
            Bộ lọc
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderHeader;