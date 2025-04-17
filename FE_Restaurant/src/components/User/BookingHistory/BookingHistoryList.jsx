// src/components/User/BookingHistory/BookingHistoryList.jsx
import React, { useState } from 'react';
import { FaCalendarAlt, FaClock, FaUtensils, FaMapMarkerAlt, FaUsers } from 'react-icons/fa';
import BookingPagination from './BookingPagination';

const BookingHistoryList = ({ orders }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Tính toán items cho trang hiện tại
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = orders.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      '0': { color: 'bg-yellow-100 text-yellow-800', text: 'Đang chờ xử lý' },
      'pending': { color: 'bg-yellow-100 text-yellow-800', text: 'Đang chờ xử lý' },
      '1': { color: 'bg-green-100 text-green-800', text: 'Đã xác nhận' },
      '2': { color: 'bg-red-100 text-red-800', text: 'Đã hủy' }
    };

    const config = statusConfig[status] || statusConfig['0'];
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Lịch Sử Đặt Tiệc</h2>
        <p className="text-gray-600">
          Tổng số đơn đặt: <span className="font-medium">{orders.length}</span>
        </p>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {currentOrders.map((order) => (
          <div 
            key={order.order_id}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300"
          >
            {/* Order Header */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Mã đơn: {order.order_id}
                  </h3>
                  <div className="mt-2 flex items-center text-gray-600">
                    <FaCalendarAlt className="mr-2 text-purple-500" />
                    {order.order_date}
                    <FaClock className="ml-4 mr-2 text-purple-500" />
                    {order.order_time}
                  </div>
                </div>
                {getStatusBadge(order.status)}
              </div>
            </div>

            {/* Order Details */}
            <div className="p-6 bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Thông tin tiệc */}
                <div className="space-y-3">
                  <div className="flex items-center text-gray-700">
                    <FaUsers className="mr-2 text-purple-500" />
                    <span>Loại tiệc: {order.style_tiec}</span>
                  </div>
                  {order.phone_number && (
                    <div className="flex items-center text-gray-700">
                      <FaMapMarkerAlt className="mr-2 text-purple-500" />
                      <span>Số điện thoại: {order.phone_number}</span>
                    </div>
                  )}
                </div>

                {/* Danh sách món */}
                <div>
                  <div className="flex items-center mb-3">
                    <FaUtensils className="mr-2 text-purple-500" />
                    <span className="font-medium text-gray-700">Món đã đặt</span>
                  </div>
                  <div className="bg-white rounded-lg p-3 space-y-2">
                    {order.order_items.map((item, index) => (
                      <div 
                        key={index}
                        className="flex justify-between items-center text-sm text-gray-600 hover:bg-purple-50 p-2 rounded-lg transition-colors"
                      >
                        <span>Món #{item.menu_item_id}</span>
                        <span className="font-medium">
                          Số lượng: {item.quantity}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <BookingPagination
        currentPage={currentPage}
        totalPages={Math.ceil(orders.length / itemsPerPage)}
        onPageChange={handlePageChange}
        totalItems={orders.length}
        itemsPerPage={itemsPerPage}
        displayedItems={currentOrders.length}
      />
    </div>
  );
};

export default BookingHistoryList;