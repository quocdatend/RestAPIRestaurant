import axios from 'axios';

const BASE_URL = 'http://localhost/RestAPIRestaurant';

const adminReviewService = {
    // Lấy tất cả reviews
    getAllReviews: async () => {
        try {
            const response = await axios.get(`${BASE_URL}/reviews`);
            return {
                status: true,
                data: response.data.map(review => ({
                    ...review,
                    rating: parseInt(review.rating)
                }))
            };
        } catch (error) {
            console.error('Lỗi khi lấy reviews:', error);
            return {
                status: false,
                message: error.response?.data?.message || 'Không thể kết nối đến server'
            };
        }
    },

    // Lấy chi tiết một review
    getReviewById: async (id) => {
        try {
            const response = await axios.get(`${BASE_URL}/reviews/${id}`);
            return {
                status: true,
                data: {
                    ...response.data,
                    rating: parseInt(response.data.rating)
                }
            };
        } catch (error) {
            console.error('Lỗi khi lấy chi tiết review:', error);
            return {
                status: false,
                message: error.response?.data?.message || 'Không thể kết nối đến server'
            };
        }
    },

    // Cập nhật review
    updateReview: async (reviewData) => {
        try {
            const response = await axios.put(`${BASE_URL}/reviews/update/${reviewData.id}`, {
                id: reviewData.id,
                customerName: reviewData.customerName,
                rating: reviewData.rating.toString(), // Chuyển rating về string theo format JSON
                title: reviewData.title,
                content: reviewData.content,
                date: reviewData.date // Sử dụng trường date thay vì created_at
            });
            
            return {
                status: true,
                message: 'Cập nhật đánh giá thành công',
                data: response.data
            };
        } catch (error) {
            console.error('Lỗi khi cập nhật review:', error);
            return {
                status: false,
                message: error.response?.data?.message || 'Không thể kết nối đến server'
            };
        }
    },

    // Xóa review
    deleteReview: async (id) => {
        try {
            const response = await axios.delete(`${BASE_URL}/reviews/delete/${id}`);
            return {
                status: true,
                message: 'Xóa đánh giá thành công',
                data: response.data
            };
        } catch (error) {
            console.error('Lỗi khi xóa review:', error);
            return {
                status: false,
                message: error.response?.data?.message || 'Không thể kết nối đến server'
            };
        }
    }
};

export default adminReviewService;