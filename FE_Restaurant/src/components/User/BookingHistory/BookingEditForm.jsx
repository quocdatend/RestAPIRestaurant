import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import { registerLocale } from 'react-datepicker';
import vi from 'date-fns/locale/vi';
import { FaCalendarAlt, FaClock, FaUsers, FaTimes, FaSave } from 'react-icons/fa';
import "react-datepicker/dist/react-datepicker.css";

registerLocale('vi', vi);

const BookingEditForm = ({ booking, onClose, onSave }) => {
  // Kiểm tra xem đặt chỗ có được chỉnh sửa không
  if (booking.status !== 'Đang chờ') {
    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
          <div className="flex items-center justify-center mb-4 text-red-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-center text-gray-800 mb-4">Không thể chỉnh sửa</h2>
          <p className="text-gray-600 text-center mb-6">
            Chỉ có thể chỉnh sửa đặt chỗ có trạng thái "Đang chờ".
            Đặt chỗ này có trạng thái "{booking.status}" nên không thể chỉnh sửa.
          </p>
          <div className="flex justify-center">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Đã hiểu
            </button>
          </div>
        </div>
      </div>
    );
  }

  const [formData, setFormData] = useState({
    bookingCode: booking.bookingCode,
    type: booking.type,
    status: booking.status,
    bookingDate: new Date(booking.bookingDate),
    guests: booking.guests,
    price: booking.price
  });

  const [errors, setErrors] = useState({});

  // Xử lý thay đổi ngày giờ
  const handleDateChange = (date) => {
    setFormData(prev => ({
      ...prev,
      bookingDate: date
    }));
    setErrors(prev => ({ ...prev, bookingDate: '' }));
  };

  // Xử lý thay đổi số lượng khách
  const handleGuestsChange = (e) => {
    const value = parseInt(e.target.value);
    if (value >= 1 && value <= 20) {
      setFormData(prev => ({
        ...prev,
        guests: value
      }));
      setErrors(prev => ({ ...prev, guests: '' }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    const selectedDate = new Date(formData.bookingDate);
    const now = new Date();
    const minDate = new Date();
    minDate.setDate(now.getDate() + 1);
    minDate.setHours(0, 0, 0, 0);

    const maxDate = new Date();
    maxDate.setDate(now.getDate() + 30);
    maxDate.setHours(23, 59, 59, 999);

    if (selectedDate < minDate) {
      newErrors.bookingDate = 'Chỉ được đặt từ ngày mai trở đi';
    }
    if (selectedDate > maxDate) {
      newErrors.bookingDate = 'Chỉ được đặt trước tối đa 30 ngày';
    }

    const hour = selectedDate.getHours();
    if (hour < 10 || hour >= 21) {
      newErrors.bookingDate = 'Giờ đặt phải từ 10:00 đến 21:00';
    }

    if (!formData.guests || formData.guests < 1 || formData.guests > 20) {
      newErrors.guests = 'Số lượng khách phải từ 1-20 người';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            Chỉnh sửa thông tin đặt chỗ
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Mã đặt chỗ - Readonly */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mã đặt chỗ
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.bookingCode}
                readOnly
                className="w-full px-4 py-2.5 bg-gray-100 border border-gray-300 rounded-lg text-gray-500 cursor-not-allowed"
              />
            </div>
          </div>

          {/* Trạng thái - Readonly */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Trạng thái
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.status}
                readOnly
                className="w-full px-4 py-2.5 bg-gray-100 border border-gray-300 rounded-lg text-gray-500 cursor-not-allowed"
              />
            </div>
          </div>

          {/* Ngày và giờ */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ngày và giờ <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <DatePicker
                selected={formData.bookingDate}
                onChange={handleDateChange}
                showTimeSelect
                dateFormat="dd/MM/yyyy HH:mm"
                timeFormat="HH:mm"
                timeIntervals={30}
                minDate={new Date(new Date().setDate(new Date().getDate() + 1))}
                maxDate={new Date(new Date().setDate(new Date().getDate() + 30))}
                minTime={new Date().setHours(10, 0)}
                maxTime={new Date().setHours(20, 30)}
                locale="vi"
                className={`w-full px-4 py-2.5 border rounded-lg ${
                  errors.bookingDate ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              <FaCalendarAlt className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
            {errors.bookingDate && (
              <p className="mt-1 text-sm text-red-500">{errors.bookingDate}</p>
            )}
          </div>

          {/* Số lượng khách */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Số lượng khách <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="number"
                value={formData.guests}
                onChange={handleGuestsChange}
                min="1"
                max="20"
                className={`w-full px-4 py-2.5 border rounded-lg ${
                  errors.guests ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              <FaUsers className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
            {errors.guests && (
              <p className="mt-1 text-sm text-red-500">{errors.guests}</p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-2"
            >
              <FaTimes className="w-4 h-4" />
              <span>Hủy</span>
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors flex items-center space-x-2"
            >
              <FaSave className="w-4 h-4" />
              <span>Lưu thay đổi</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingEditForm; 