import React, { useState, useEffect } from 'react';
import ReviewItem from './ReviewItem';
import ReviewFilter from './ReviewFilter';
import ReviewSummary from './ReviewSummary';
import ReviewPagination from './ReviewPagination';
import AddReviewForm from './AddReviewForm';
import Modal from '../../common/Modal';
import { reviewsMockData } from '../../../services/reviewService'; // Import dữ liệu mẫu

const ReviewList = ({ productId }) => {
  const [reviews, setReviews] = useState(reviewsMockData); // Sử dụng dữ liệu mẫu
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    rating: 0,
    sortBy: 'newest',
  });
  const [showAddReviewModal, setShowAddReviewModal] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      try {
        // Giả lập tải dữ liệu từ API
        setTimeout(() => {
          setReviews(reviewsMockData); // Cập nhật lại danh sách đánh giá
          setTotalPages(Math.ceil(reviewsMockData.length / 10)); // Giả lập số trang
          setLoading(false);
        }, 800);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchReviews();
  }, [productId, currentPage, filters]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset về trang đầu tiên khi thay đổi bộ lọc
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddReviewSuccess = (newReview) => {
    setReviews((prevReviews) => [...prevReviews, newReview]); // Thêm đánh giá mới vào danh sách
    setShowAddReviewModal(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Đánh giá từ khách hàng</h2>
        <button 
          onClick={() => setShowAddReviewModal(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200"
        >
          Viết đánh giá
        </button>
      </div>
      
      <ReviewSummary productId={productId} />
      
      <div className="my-6">
        <ReviewFilter filters={filters} onFilterChange={handleFilterChange} />
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="p-4 bg-red-50 text-red-600 rounded-md">
          <p>Đã xảy ra lỗi: {error}</p>
          <button 
            className="mt-2 text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md"
            onClick={() => window.location.reload()}
          >
            Thử lại
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border">
          {reviews.map((review) => (
            <ReviewItem key={review.id} review={review} />
          ))}
        </div>
      )}

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

export default ReviewList; 