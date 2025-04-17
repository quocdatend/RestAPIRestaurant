import React, { useState } from 'react';
import axios from 'axios';
import StarRating from './StarRating';

const AddReviewForm = ({ productId, onSuccess, onClose }) => {
  const [formData, setFormData] = useState({
    rating: 0,
    title: '',
    content: '',
    customerName: '',
    email: '',
    isSubscribed: false
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleRatingChange = (newRating) => {
    setFormData({ ...formData, rating: newRating });
    if (errors.rating) {
      setErrors({ ...errors, rating: null });
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ 
      ...formData, 
      [name]: type === 'checkbox' ? checked : value 
    });
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (formData.rating === 0) {
      newErrors.rating = 'Vui lòng chọn số sao đánh giá';
    }
    
    if (!formData.title.trim()) {
      newErrors.title = 'Vui lòng nhập tiêu đề đánh giá';
    } else if (formData.title.length > 100) {
      newErrors.title = 'Tiêu đề không được vượt quá 100 ký tự';
    }
    
    if (!formData.content.trim()) {
      newErrors.content = 'Vui lòng nhập nội dung đánh giá';
    } else if (formData.content.length < 10) {
      newErrors.content = 'Nội dung đánh giá phải có ít nhất 10 ký tự';
    } else if (formData.content.length > 1000) {
      newErrors.content = 'Nội dung đánh giá không được vượt quá 1000 ký tự';
    }
    
    if (!formData.customerName.trim()) {
      newErrors.customerName = 'Vui lòng nhập tên của bạn';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setSuccessMessage('');
    
    try {
      const reviewData = {
        customerName: formData.customerName,
        rating: formData.rating,
        title: formData.title,
        content: formData.content
      };
      
      console.log('Dữ liệu gửi đi:', reviewData);
      
      // Sử dụng URL thông qua proxy
      const response = await axios.post('/api/reviews/create', reviewData, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      console.log('Response:', response.data);
      setSuccessMessage('Cảm ơn bạn đã gửi đánh giá!');
      setTimeout(() => onSuccess(), 2000);
    } catch (error) {
      console.error('Lỗi:', error);
      setErrors({
        ...errors,
        submit: error.response?.data?.message || 'Không thể gửi đánh giá. Vui lòng thử lại sau.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  
  const contentCharactersLeft = 1000 - (formData.content?.length || 0);
  const contentCharactersClass = contentCharactersLeft < 50 
    ? 'text-red-500' 
    : contentCharactersLeft < 100 
      ? 'text-yellow-500' 
      : 'text-gray-500';

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      {successMessage ? (
        <div className="text-center py-8">
          <div className="mb-4 text-green-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-2">Đánh giá đã được gửi!</h3>
          <p className="text-gray-600">{successMessage}</p>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Viết đánh giá của bạn</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
              aria-label="Đóng"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Đánh giá sao <span className="text-red-500">*</span></label>
              <StarRating 
                rating={formData.rating} 
                onRatingChange={handleRatingChange}
                size="large" 
              />
              {errors.rating && <p className="mt-1 text-red-500 text-sm">{errors.rating}</p>}
            </div>
            
            <div>
              <label htmlFor="title" className="block text-gray-700 font-medium mb-2">
                Tiêu đề đánh giá <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                placeholder="Tóm tắt trải nghiệm của bạn"
              />
              {errors.title && <p className="mt-1 text-red-500 text-sm">{errors.title}</p>}
            </div>
            
            <div>
              <label htmlFor="content" className="block text-gray-700 font-medium mb-2">
                Nội dung đánh giá <span className="text-red-500">*</span>
              </label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                rows="5"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                placeholder="Chia sẻ chi tiết về trải nghiệm của bạn với sản phẩm này"
              ></textarea>
              <div className="flex justify-between items-center mt-1">
                <p className={`text-sm ${contentCharactersClass}`}>
                  {contentCharactersLeft} ký tự còn lại
                </p>
                {errors.content && <p className="text-red-500 text-sm">{errors.content}</p>}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="customerName" className="block text-gray-700 font-medium mb-2">
                  Tên của bạn <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="customerName"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                  placeholder="Tên hiển thị công khai"
                />
                {errors.customerName && <p className="mt-1 text-red-500 text-sm">{errors.customerName}</p>}
              </div>
              
              <div>
                <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                  Email (không bắt buộc)
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                  placeholder="Email của bạn (không hiển thị công khai)"
                />
                {errors.email && <p className="mt-1 text-red-500 text-sm">{errors.email}</p>}
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="isSubscribed"
                  name="isSubscribed"
                  type="checkbox"
                  checked={formData.isSubscribed}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
              </div>
              <label htmlFor="isSubscribed" className="ml-3 block text-sm text-gray-700">
                Thông báo cho tôi khi có phản hồi cho đánh giá này
              </label>
            </div>
            
            {errors.submit && (
              <div className="p-3 bg-red-50 text-red-600 rounded-md">
                {errors.submit}
              </div>
            )}
            
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors duration-200"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${
                  isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Đang gửi...
                  </>
                ) : 'Gửi đánh giá'}
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default AddReviewForm;