import React from 'react';

const ReviewSummary = ({ reviews }) => {
  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0 
    ? (reviews.reduce((acc, review) => acc + review.rating, 0) / totalReviews).toFixed(1) 
    : 0;
    
  // Tính toán số lượng đánh giá theo sao
  const ratingCounts = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0
  };
  
  reviews.forEach(review => {
    if (ratingCounts[review.rating] !== undefined) {
      ratingCounts[review.rating]++;
    }
  });
  
  // Tính phần trăm cho từng số sao
  const calculatePercentage = (count) => {
    return totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      {/* Tổng quan đánh giá */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Tổng quan đánh giá</h2>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Tổng số đánh giá:</span>
            <span className="font-medium">{totalReviews}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Đánh giá trung bình:</span>
            <div className="flex items-center">
              <span className="font-medium mr-2">{averageRating}</span>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`${star <= Math.round(averageRating) ? 'text-yellow-400' : 'text-gray-300'}`}
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
            </div>
          </div>
        </div>
      </div>
      
      {/* Phân bố đánh giá theo sao */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Phân bố đánh giá</h2>
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((star) => (
            <div key={star} className="flex items-center gap-2">
              <div className="w-8 text-right">
                <span className="text-sm font-medium">{star}</span>
              </div>
              <div className="flex-1">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-yellow-400 h-2.5 rounded-full" 
                    style={{ width: `${calculatePercentage(ratingCounts[star])}%` }}
                  ></div>
                </div>
              </div>
              <div className="w-12 text-right">
                <span className="text-sm text-gray-500">{ratingCounts[star]}</span>
              </div>
              <div className="w-14 text-right">
                <span className="text-sm text-gray-500">
                  {calculatePercentage(ratingCounts[star])}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReviewSummary;