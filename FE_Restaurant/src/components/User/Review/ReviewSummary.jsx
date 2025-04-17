import React, { useState, useEffect } from 'react';
import StarRating from './StarRating';
import Modal from './Modal';
import AddReviewForm from './AddReviewForm';

const ReviewSummary = ({ productId }) => {
  const [summary, setSummary] = useState({
    averageRating: 0,
    totalReviews: 0,
    ratingCounts: {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0
    }
  });
  const [loading, setLoading] = useState(true);
  const [showAddReviewModal, setShowAddReviewModal] = useState(false);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await fetch(`/api/products/${productId}/reviews/summary`);
        const data = await response.json();
        
        setSummary(data);
        setLoading(false);
      } catch (error) {
        console.error("Lỗi khi tải tổng quan đánh giá:", error);
        setLoading(false);
      }
    };

    fetchSummary();
  }, [productId]);
  
  const calculatePercentage = (count) => {
    return summary.totalReviews > 0 
      ? Math.round((count / summary.totalReviews) * 100) 
      : 0;
  };
  
  const handleOpenReviewForm = () => {
    console.log("Mở form đánh giá");
    setShowAddReviewModal(true);
  };
  
  if (loading) {
    return (
      <div className="p-4 flex justify-center">
        <div className="animate-pulse h-24 w-full bg-gray-200 rounded"></div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Đánh giá từ khách hàng</h2>
        <button 
          onClick={() => setShowAddReviewModal(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200"
        >
          Viết đánh giá
        </button>
      </div>
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/4 text-center mb-6 md:mb-0">
          <div className="text-4xl font-bold text-gray-900">{summary.averageRating.toFixed(1)}</div>
          <div className="mt-2">
            <StarRating rating={Math.round(summary.averageRating)} readOnly={true} />
          </div>
          <p className="mt-2 text-sm text-gray-500">{summary.totalReviews} đánh giá</p>
        </div>
        
        <div className="md:w-3/4 md:pl-8">
          {[5, 4, 3, 2, 1].map((star) => (
            <div key={star} className="flex items-center mb-2">
              <div className="w-12 text-right mr-4">
                <span className="text-sm font-medium">{star} sao</span>
              </div>
              <div className="flex-grow">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-yellow-400 h-2 rounded-full" 
                    style={{ width: `${calculatePercentage(summary.ratingCounts[star])}%` }}
                  ></div>
                </div>
              </div>
              <div className="w-12 ml-4">
                <span className="text-sm text-gray-500">{summary.ratingCounts[star]}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Modal 
        isOpen={showAddReviewModal} 
        onClose={() => setShowAddReviewModal(false)}
      >
        <AddReviewForm 
          productId={productId} 
          onSuccess={handleAddReviewSuccess}
          onClose={() => setShowAddReviewModal(false)}
        />
      </Modal>
    </div>
  );
};

export default ReviewSummary; 