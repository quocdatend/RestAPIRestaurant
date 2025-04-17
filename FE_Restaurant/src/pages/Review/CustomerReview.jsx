import { useState, useEffect } from 'react';
import { getReviews } from '../../services/reviewService';
import { FaStar } from 'react-icons/fa';
import ReviewForm from '../../components/User/Review/AddReviewForm';

const CustomerReview = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  
  // Lấy danh sách đánh giá khi component mount
  useEffect(() => {
    fetchReviews();
  }, []);
  
  // Hàm lấy danh sách đánh giá
  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getReviews();
      setReviews(data || []);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách đánh giá:', error);
      setError('Không thể tải danh sách đánh giá. Vui lòng thử lại sau.');
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };
  
  const handleReviewSuccess = () => {
    setShowReviewForm(false);
    fetchReviews(); // Tải lại danh sách đánh giá
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">Đánh giá từ khách hàng</h1>
      
      {showReviewForm ? (
        <div className="max-w-2xl mx-auto mb-10">
          <ReviewForm 
            onSuccess={handleReviewSuccess}
            onClose={() => setShowReviewForm(false)}
          />
        </div>
      ) : (
        <div className="text-center mb-10">
          <button
            onClick={() => setShowReviewForm(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Viết đánh giá mới
          </button>
        </div>
      )}
      
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Đánh giá gần đây</h2>
        
        {loading ? (
          <div className="text-center py-8">Đang tải đánh giá...</div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">
            {error}
            <button 
              onClick={fetchReviews}
              className="block mx-auto mt-4 text-blue-500 underline"
            >
              Thử lại
            </button>
          </div>
        ) : reviews.length > 0 ? (
          <div className="space-y-6">
            {reviews.map((review, index) => (
              <div 
                key={review.id || index} 
                className="bg-white rounded-lg shadow-md p-6 border-l-4 border-amber-500"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-semibold">
                    {review.title || review.tieude || review.Title || "Không có tiêu đề"}
                  </h3>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <FaStar 
                        key={i}
                        className={i < review.rating ? "text-amber-500" : "text-gray-300"} 
                      />
                    ))}
                  </div>
                </div>
                <p className="text-gray-700 mb-4">{review.content}</p>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span className="font-medium">{review.customerName}</span>
                  <span>{review.created_at ? new Date(review.created_at).toLocaleDateString() : 'Gần đây'}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
            Chưa có đánh giá nào. Hãy là người đầu tiên đánh giá!
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerReview;