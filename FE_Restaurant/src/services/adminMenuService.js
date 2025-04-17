import axios from 'axios';

const BASE_URL = 'http://localhost/RestAPIRestaurant';

const adminMenuService = {
    // Lấy tất cả sản phẩm
    getAllProducts: async () => {
        try {
            const response = await axios.get(`${BASE_URL}/products`);
            return {
                status: true,
                data: response.data
            };
        } catch (error) {
            console.error('Lỗi khi lấy danh sách sản phẩm:', error);
            return {
                status: false,
                message: error.response?.data?.message || 'Không thể kết nối đến server'
            };
        }
    },

    // Lấy chi tiết sản phẩm
    getProductDetail: async (id) => {
        try {
            const response = await axios.get(`${BASE_URL}/products/${id}`);
            return {
                status: true,
                data: response.data
            };
        } catch (error) {
            console.error('Lỗi khi lấy chi tiết sản phẩm:', error);
            return {
                status: false,
                message: error.response?.data?.message || 'Không thể kết nối đến server'
            };
        }
    },

    // Cập nhật trạng thái món ăn theo endpoint mới
    updateStatus: async (productId, newStatus) => {
        try {
            const response = await axios.put(`${BASE_URL}/products/${productId}/status`, {
                status: newStatus
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            // Log để debug
            console.log('Update status response:', response.data);

            return {
                status: true,
                message: 'Cập nhật trạng thái thành công',
                data: response.data
            };
        } catch (error) {
            console.error('Error updating status:', error);
            return {
                status: false,
                message: error.response?.data?.message || 'Không thể cập nhật trạng thái'
            };
        }
    },

    // Upload ảnh
    uploadImage: async (id, imageFile) => {
        try {
            const formData = new FormData();
            formData.append('image', imageFile);

            const response = await axios.post(
                `${BASE_URL}/products/${id}/upload-image`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );
            return {
                status: true,
                message: 'Upload ảnh thành công',
                data: response.data
            };
        } catch (error) {
            console.error('Lỗi khi upload ảnh:', error);
            return {
                status: false,
                message: error.response?.data?.message || 'Không thể upload ảnh'
            };
        }
    },

    // Tạo sản phẩm mới
    createProduct: async (formData) => {
        try {
            const response = await axios.post(`${BASE_URL}/products/create`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error creating product:', error);
            throw error;
        }
    },

    // Cập nhật sản phẩm
    updateProduct: async (id, formData) => {
        try {
            const response = await axios.post(`${BASE_URL}/products/update/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error updating product:', error);
            throw error;
        }
    },

    // Thêm hàm mới để lấy trạng thái hiện tại của món
    getProductStatus: async (productId) => {
        try {
            const response = await axios.get(`${BASE_URL}/products/${productId}/status`);
            return {
                status: true,
                data: response.data.data
            };
        } catch (error) {
            console.error('Error getting product status:', error);
            return {
                status: false,
                message: 'Không thể lấy trạng thái món ăn'
            };
        }
    }
};

export default adminMenuService;