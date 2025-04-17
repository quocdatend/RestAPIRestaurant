import { useState, useEffect } from 'react';
import { FaCalendar, FaClock, FaUsers, FaUser, FaPhone, FaGlassCheers } from 'react-icons/fa';

const ReservationForm = ({ formData, onChange, onSubmit }) => {
  const [focused, setFocused] = useState('');

  // State để lưu các time slots hợp lệ
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);

  const partyTypes = [
    {
      id: 'normal',
      name: 'Đặt bàn thường',
      icon: '🍽️'
    },
    {
      id: 'birthday',
      name: 'Tiệc sinh nhật',
      icon: '🎂'
    },
    {
      id: 'anniversary',
      name: 'Kỷ niệm',
      icon: '💑'
    },
    {
      id: 'family',
      name: 'Tiệc gia đình',
      icon: '👨‍👩‍👧‍👦'
    },
    {
      id: 'business',
      name: 'Hội họp',
      icon: '💼'
    },
    {
      id: 'other',
      name: 'Khác',
      icon: '✨'
    }
  ];

  // Hàm tạo time slots và kiểm tra điều kiện
  const generateTimeSlots = (selectedDate) => {
    const timeSlots = [
      { time: "11:00", period: "Trưa" },
      { time: "11:30", period: "Trưa" },
      { time: "12:00", period: "Trưa" },
      { time: "12:30", period: "Trưa" },
      { time: "13:00", period: "Trưa" },
      { time: "13:30", period: "Trưa" },
      { time: "17:30", period: "Tối" },
      { time: "18:00", period: "Tối" },
      { time: "18:30", period: "Tối" },
      { time: "19:00", period: "Tối" },
      { time: "19:30", period: "Tối" },
      { time: "20:00", period: "Tối" }
    ];

    const now = new Date();
    const selected = new Date(selectedDate);
    
    // Nếu là ngày hôm nay, lọc các time slots
    if (selected.toDateString() === now.toDateString()) {
      // Thêm 30 phút vào thời gian hiện tại
      const minTime = new Date(now.getTime() + 30 * 60000);
      
      return timeSlots.filter(slot => {
        const [hours, minutes] = slot.time.split(':');
        const slotTime = new Date(selected.setHours(Number(hours), Number(minutes)));
        return slotTime > minTime;
      });
    }
    
    // Nếu là ngày khác, trả về tất cả time slots
    return timeSlots;
  };

  // Cập nhật time slots khi ngày thay đổi
  useEffect(() => {
    if (formData.date) {
      const slots = generateTimeSlots(formData.date);
      setAvailableTimeSlots(slots);
      
      // Nếu time đã chọn không còn trong danh sách hợp lệ, reset time
      if (formData.time && !slots.find(slot => slot.time === formData.time)) {
        onChange({ target: { name: 'time', value: '' } });
      }
    }
  }, [formData.date]);

  // Xử lý khi thay đổi ngày
  const handleDateChange = (e) => {
    const newDate = e.target.value;
    onChange(e);
    
    // Reset time khi đổi ngày
    onChange({ target: { name: 'time', value: '' } });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Thông tin cá nhân */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Họ tên */}
        <div className="form-group">
          <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
            <FaUser className="mr-2 text-yellow-500" />
            Họ và tên *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={onChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 
                     focus:border-transparent transition-all duration-300"
            placeholder="Nhập họ tên của bạn"
            required
          />
        </div>

        {/* Số điện thoại */}
        <div className="form-group">
          <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
            <FaPhone className="mr-2 text-yellow-500" />
            Số điện thoại *
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={onChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 
                     focus:border-transparent transition-all duration-300"
            placeholder="Nhập số điện thoại"
            required
          />
        </div>
      </div>

      {/* Thông tin đặt bàn */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Ngày đặt */}
        <div className="form-group">
          <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
            <FaCalendar className="mr-2 text-yellow-500" />
            Ngày đặt bàn *
          </label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleDateChange}
            min={new Date().toISOString().split('T')[0]}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 
                     focus:border-transparent transition-all duration-300"
            required
          />
        </div>

        {/* Thời gian */}
        <div className="form-group">
          <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
            <FaClock className="mr-2 text-yellow-500" />
            Thời gian *
          </label>
          <select
            name="time"
            value={formData.time}
            onChange={onChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 
                     focus:border-transparent transition-all duration-300"
            required
            disabled={!formData.date}
          >
            <option value="">Chọn thời gian</option>
            {availableTimeSlots.length > 0 ? (
              <>
                <optgroup label="Buổi trưa">
                  {availableTimeSlots
                    .filter(slot => slot.period === "Trưa")
                    .map(slot => (
                      <option key={slot.time} value={slot.time}>
                        {slot.time}
                      </option>
                    ))}
                </optgroup>
                <optgroup label="Buổi tối">
                  {availableTimeSlots
                    .filter(slot => slot.period === "Tối")
                    .map(slot => (
                      <option key={slot.time} value={slot.time}>
                        {slot.time}
                      </option>
                    ))}
                </optgroup>
              </>
            ) : formData.date ? (
              <option value="" disabled>
                Không có khung giờ phù hợp
              </option>
            ) : (
              <option value="" disabled>
                Vui lòng chọn ngày trước
              </option>
            )}
          </select>
          {formData.date && availableTimeSlots.length === 0 && (
            <p className="text-red-500 text-sm mt-1">
              Đã hết giờ đặt bàn cho ngày hôm nay. Vui lòng chọn ngày khác.
            </p>
          )}
        </div>

        {/* Số khách */}
        <div className="form-group">
          <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
            <FaUsers className="mr-2 text-yellow-500" />
            Số khách *
          </label>
          <input
            type="number"
            name="guests"
            value={formData.guests}
            onChange={onChange}
            min="1"
            max="50"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 
                     focus:border-transparent transition-all duration-300"
            placeholder="Nhập số lượng khách"
            required
          />
        </div>
      </div>

      {/* Loại tiệc */}
      <div className="form-group">
        <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
          <FaGlassCheers className="mr-2 text-yellow-500" />
          Loại tiệc *
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {partyTypes.map((type) => (
            <label
              key={type.id}
              className={`flex flex-col items-center p-3 border rounded-lg cursor-pointer
                transition-all duration-300 hover:shadow-md
                ${formData.partyType === type.id 
                  ? 'border-yellow-500 bg-yellow-50 text-yellow-600' 
                  : 'border-gray-200 hover:border-yellow-200'
                }`}
            >
              <input
                type="radio"
                name="partyType"
                value={type.id}
                checked={formData.partyType === type.id}
                onChange={onChange}
                className="hidden"
                required
              />
              <span className="text-2xl mb-1">{type.icon}</span>
              <span className="text-sm text-center">{type.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Ghi chú */}
      <div className="form-group">
        <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
          Ghi chú thêm
        </label>
        <textarea
          name="request"
          value={formData.request}
          onChange={onChange}
          rows="3"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 
                   focus:border-transparent transition-all duration-300"
          placeholder="Nhập yêu cầu đặc biệt của bạn (nếu có)"
        />
      </div>

      {/* Nút submit */}
      <button
        type="submit"
        className="w-full py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 
                 transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
      >
        <span className="mr-2">Tiếp tục</span>
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </form>
  );
};

export default ReservationForm; 