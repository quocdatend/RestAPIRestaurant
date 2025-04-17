import axios from 'axios';

// URL gốc của API
const API_URL = 'http://localhost/RestAPIRestaurant';

// Hàm tạo đánh giá mới
export const createReview = async (reviewData) => {
  try {
    console.log('Dữ liệu gửi đi:', reviewData);
    
    // Sử dụng fetch với mode cors
    const response = await fetch(`${API_URL}/reviews/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(reviewData)
    });
    
    // Kiểm tra response
    if (!response.ok) {
      throw new Error(`Lỗi API: ${response.status} ${response.statusText}`);
    }
    
    // Parse JSON response
    try {
      const data = await response.json();
      return data;
    } catch (e) {
      // Nếu không thể parse JSON, trả về text
      const text = await response.text();
      console.log('Phản hồi text:', text);
      return { success: true, message: 'Đánh giá đã được gửi' };
    }
  } catch (error) {
    console.error('Lỗi chi tiết khi tạo review:', error);
    
    // Thử phương pháp FormData
    try {
      const formData = new FormData();
      Object.keys(reviewData).forEach(key => {
        formData.append(key, reviewData[key]);
      });
      
      // Gửi dưới dạng form data
      const response = await fetch(`${API_URL}/reviews/create`, {
        method: 'POST',
        body: formData
      });
      
      try {
        const data = await response.json();
        return data;
      } catch (e) {
        const text = await response.text();
        console.log('Phản hồi text (phương pháp FormData):', text);
        return { success: true, message: 'Đánh giá đã được gửi' };
      }
    } catch (formError) {
      console.error('Lỗi với phương pháp FormData:', formError);
      throw new Error('Không thể gửi đánh giá. Vui lòng thử lại sau.');
    }
  }
};

// Hàm lấy danh sách đánh giá
export const getReviews = async () => {
  try {
    const response = await fetch(`${API_URL}/reviews`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Lỗi API: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Lỗi khi lấy reviews:', error);
    throw error; // Không trả về dữ liệu mock nữa, để component xử lý lỗi
  }
};

// Hàm thêm review (giữ cho tương thích với AddReviewForm)
export const addReview = async (reviewData) => {
  return createReview(reviewData);
};

export default {
  createReview,
  getReviews,
  addReview
};