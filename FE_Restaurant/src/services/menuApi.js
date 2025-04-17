import axios from 'axios';

const BASE_URL = 'http://localhost/restapirestaurant';

export const menuApi = {
  // Lấy tất cả sản phẩm
  getAllProducts: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/products`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Lấy sản phẩm theo danh mục
  getProductsByCategory: async (category) => {
    try {
      const response = await axios.get(`${BASE_URL}/products`);
      return response.data.filter(item => item.category === category);
    } catch (error) {
      throw error;
    }
  }
};

// Lấy chi tiết một món
export const getMenuDetail = (id) => {
  return axios.get(`${BASE_URL}/products/${id}`);
};