import React, { useState } from 'react';
import ReviewItem from './ReviewItem';

const ReviewList = ({ reviews, onViewReview }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 10;

  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);
  const totalPages = Math.ceil(reviews.length / reviewsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {reviews.length === 0 ? (
        <div className="p-6 text-center">
          <p className="text-gray-500">Không có đánh giá nào</p>
        </div>
      ) : (
        <>
          <div className="p-4">
            {currentReviews.map((review) => (
              <ReviewItem
                key={review.id}
                review={review}
                onView={onViewReview}
              />
            ))}
          </div>
          
          {totalPages > 1 && (
            <div className="flex justify-center p-4 border-t">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded ${currentPage === 1 ? 'bg-gray-100 text-gray-400' : 'bg-white border text-gray-700'}`}
              >
                &lt;
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-1 mx-1 rounded ${
                    currentPage === page ? 'bg-blue-500 text-white' : 'bg-white border text-gray-700'
                  }`}
                >
                  {page}
                </button>
              ))}
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded ${currentPage === totalPages ? 'bg-gray-100 text-gray-400' : 'bg-white border text-gray-700'}`}
              >
                &gt;
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ReviewList;