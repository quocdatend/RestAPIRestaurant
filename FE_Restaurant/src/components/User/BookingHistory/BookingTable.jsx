// src/components/User/BookingHistory/BookingTable.jsx
import React from 'react';
import { FaEye, FaClock, FaCalendarAlt, FaUtensils, FaGlassCheers } from 'react-icons/fa';

const StatusBadge = ({ status }) => {
  const getStatusStyle = (status) => {
    switch(status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusStyle(status)}`}>
      {status === 'pending' ? 'Đang chờ xử lý' : 
       status === 'completed' ? 'Đã xác nhận' : 
       'Đã hủy'}
    </span>
  );
};

const BookingTable = ({ orders, onViewDetails }) => (
  <div className="bg-white rounded-lg shadow-lg overflow-hidden">
    {/* Header */}
    <div className="p-6 border-b border-gray-200">
      <h2 className="text-xl font-semibold text-gray-800">Danh Sách Đơn Đặt</h2>
      <p className="text-sm text-gray-600 mt-1">
        Tổng số đơn: {orders.length} đơn
      </p>
    </div>

    {/* Table */}
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Thông tin đơn
            </th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Thời gian
            </th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Chi tiết tiệc
            </th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Trạng thái
            </th>
            <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Thao tác
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {orders.map((order) => (
            <tr 
              key={order.order_id} 
              className="hover:bg-gray-50 transition-colors duration-200"
            >
              {/* Thông tin đơn */}
              <td className="px-6 py-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <FaUtensils className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      #{order.order_id}
                    </div>
                    <div className="text-sm text-gray-500">
                      {order.order_items.length} món
                    </div>
                  </div>
                </div>
              </td>

              {/* Thời gian */}
              <td className="px-6 py-4">
                <div className="space-y-1">
                  <div className="flex items-center text-sm text-gray-900">
                    <FaCalendarAlt className="h-4 w-4 text-gray-400 mr-2" />
                    {order.order_date}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <FaClock className="h-4 w-4 text-gray-400 mr-2" />
                    {order.order_time}
                  </div>
                </div>
              </td>

              {/* Chi tiết tiệc */}
              <td className="px-6 py-4">
                <div className="flex items-center">
                  <FaGlassCheers className="h-4 w-4 text-gray-400 mr-2" />
                  <div className="text-sm text-gray-900">{order.style_tiec}</div>
                </div>
              </td>

              {/* Trạng thái */}
              <td className="px-6 py-4">
                <StatusBadge status={order.status === 0 ? 'pending' : 'completed'} />
              </td>

              {/* Thao tác */}
              <td className="px-6 py-4 text-center">
                <button
                  onClick={() => onViewDetails(order)}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-600 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                >
                  <FaEye className="h-4 w-4 mr-1" />
                  Chi tiết
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    {/* Footer */}
    {orders.length === 0 && (
      <div className="p-6 text-center text-gray-500">
        <FaUtensils className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p className="text-lg font-medium">Chưa có đơn đặt nào</p>
        <p className="mt-1">Các đơn đặt của bạn sẽ xuất hiện ở đây</p>
      </div>
    )}
  </div>
);

export default BookingTable;