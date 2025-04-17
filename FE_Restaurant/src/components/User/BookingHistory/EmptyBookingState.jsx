import React from 'react';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaUtensils, FaGlassCheers } from 'react-icons/fa';

const EmptyBookingState = () => {
  return (
    <div className="min-h-[400px] flex items-center justify-center">
      <div className="max-w-lg w-full mx-auto text-center p-8 bg-white rounded-2xl shadow-lg">
        {/* Animated Icon Section */}
        <div className="relative mb-8">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="animate-ping h-16 w-16 rounded-full bg-purple-100 opacity-75"></div>
          </div>
          <div className="relative flex justify-center space-x-4">
            <FaCalendarAlt className="h-8 w-8 text-purple-500 transform -rotate-12" />
            <FaUtensils className="h-8 w-8 text-purple-600" />
            <FaGlassCheers className="h-8 w-8 text-purple-700 transform rotate-12" />
          </div>
        </div>

        {/* Content Section */}
        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-gray-900">
            Chưa Có Lịch Sử Đặt Tiệc
          </h3>
          <p className="text-gray-600 max-w-md mx-auto">
            Bạn chưa có đơn đặt tiệc nào. Hãy trải nghiệm dịch vụ của chúng tôi 
            với các món ăn đặc sắc và không gian sang trọng.
          </p>
        </div>

        {/* Features Section */}
        <div className="mt-8 grid grid-cols-3 gap-4 mb-8">
          <div className="p-4 rounded-lg bg-purple-50">
            <FaUtensils className="h-6 w-6 text-purple-500 mx-auto mb-2" />
            <p className="text-sm text-purple-700">Món ăn đặc sắc</p>
          </div>
          <div className="p-4 rounded-lg bg-purple-50">
            <FaGlassCheers className="h-6 w-6 text-purple-500 mx-auto mb-2" />
            <p className="text-sm text-purple-700">Không gian sang trọng</p>
          </div>
          <div className="p-4 rounded-lg bg-purple-50">
            <FaCalendarAlt className="h-6 w-6 text-purple-500 mx-auto mb-2" />
            <p className="text-sm text-purple-700">Đặt tiệc dễ dàng</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to="/reservation"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-full text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300 transform hover:scale-105"
          >
            <FaCalendarAlt className="mr-2" />
            Đặt Tiệc Ngay
          </Link>
          <Link
            to="/menu"
            className="inline-flex items-center justify-center px-6 py-3 border border-purple-600 text-base font-medium rounded-full text-purple-600 bg-white hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300"
          >
            <FaUtensils className="mr-2" />
            Xem Thực Đơn
          </Link>
        </div>

        {/* Bottom Info */}
        <div className="mt-8 text-sm text-gray-500">
          <p>Cần hỗ trợ? Liên hệ với chúng tôi qua hotline</p>
          <a 
            href="tel:1900xxxx" 
            className="font-medium text-purple-600 hover:text-purple-500 transition-colors"
          >
            1900 xxxx
          </a>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 -z-10">
          <div className="h-32 w-32 bg-purple-100 rounded-full opacity-20 transform -translate-x-1/2 -translate-y-1/2"></div>
        </div>
        <div className="absolute bottom-0 right-0 -z-10">
          <div className="h-24 w-24 bg-purple-100 rounded-full opacity-20 transform translate-x-1/2 translate-y-1/2"></div>
        </div>
      </div>
    </div>
  );
};

export default EmptyBookingState;