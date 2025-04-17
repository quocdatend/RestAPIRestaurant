import React, { useState } from 'react';
import { toggleLikeReview } from '../../../services/reviewService';
import StarRating from './StarRating';

const ReviewItem = ({ review }) => {
  // Format ngày tháng
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric'
    });
  };
  
  // Thêm state để theo dõi nút thích
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(review.likes || 0);
  
  // Xử lý sự kiện nhấn nút thích
  const handleLike = async () => {
    try {
      const result = await toggleLikeReview(review.id);
      setLiked(result.liked);
      setLikeCount(result.likeCount);
    } catch (error) {
      console.error('Lỗi khi thích/bỏ thích:', error);
    }
  };

  return (
    <div className="p-6 border-b last:border-b-0 hover:bg-gray-100 transition-colors duration-200 bg-white">
      <div className="flex justify-between">
        <h3 className="text-lg font-medium text-gray-900">{review.title}</h3>
        <span className="text-gray-600 text-sm">{formatDate(review.date)}</span>
      </div>
      
      <div className="flex items-center mt-1">
        <StarRating rating={review.rating} readOnly={true} />
        <span className="ml-2 text-sm text-gray-600">{review.rating}/5</span>
      </div>
      
      <p className="mt-3 text-gray-700">{review.content}</p>
      
      <div className="mt-4 flex items-center justify-between">
        <p className="text-sm text-gray-600 font-medium">
          Đánh giá bởi: <span className="text-blue-600">{review.customerName}</span>
        </p>
        
        <button 
          onClick={handleLike}
          className={`flex items-center text-sm ${liked ? 'text-blue-600' : 'text-gray-500'} hover:text-blue-600 transition-colors`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
          </svg>
          {likeCount} Hữu ích
        </button>
      </div>
    </div>
  );
};

export default ReviewItem;