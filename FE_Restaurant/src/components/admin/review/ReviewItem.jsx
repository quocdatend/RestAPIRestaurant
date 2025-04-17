import React from 'react';

const ReviewItem = ({ review, onView }) => {
  const renderStars = (rating) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="w-4 h-4"
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path 
                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" 
              />
            </svg>
          </span>
        ))}
      </div>
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  return (
    <div className="border rounded p-4 mb-4 bg-white">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium">{review.title || 'Không có tiêu đề'}</h3>
        <span className="text-sm text-gray-500">{formatDate(review.date)}</span>
      </div>
      
      <div className="mb-2">{renderStars(review.rating)}</div>
      <p className="text-gray-700 mb-2">{review.content}</p>
      <p className="text-sm text-gray-500">Bởi: {review.customerName}</p>
      
      <div className="mt-4 flex justify-end">
        <button 
          onClick={() => onView(review)} 
          className="text-blue-500 hover:underline"
        >
          Xem chi tiết
        </button>
      </div>
    </div>
  );
};

export default ReviewItem;