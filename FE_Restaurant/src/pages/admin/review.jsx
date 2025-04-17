import React, { useState, useEffect } from 'react';
import adminReviewService from '../../services/adminReview';
import { toast } from 'react-toastify';
import { FaStar, FaEdit, FaTrash } from 'react-icons/fa';

const ReviewManagement = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedReview, setSelectedReview] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [filters, setFilters] = useState({
        rating: 'all',
        sortBy: 'newest'
    });
    const [errors, setErrors] = useState({});
    const [editingTitle, setEditingTitle] = useState('');

    // Lấy danh sách reviews
    const fetchReviews = async () => {
        try {
            setLoading(true);
            const result = await adminReviewService.getAllReviews();
            if (result.status) {
                setReviews(result.data);
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            toast.error('Không thể tải danh sách đánh giá');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    // Hàm validate form
    const validateForm = (reviewData) => {
        const newErrors = {};
        
        // Kiểm tra title
        if (!reviewData.title || reviewData.title.trim() === '') {
            newErrors.title = 'Tiêu đề không được để trống';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Xử lý cập nhật review
    const handleUpdateReview = async (reviewData) => {
        try {
            // Kiểm tra title trước khi gửi
            if (!reviewData.title || reviewData.title.trim() === '') {
                toast.error('Tiêu đề không được để trống');
                return;
            }

            const result = await adminReviewService.updateReview({
                ...reviewData,
                title: reviewData.title.trim() // Đảm bảo loại bỏ khoảng trắng thừa
            });

            if (result.status) {
                toast.success('Cập nhật đánh giá thành công');
                setShowEditModal(false);
                setSelectedReview(null);
                setEditingTitle(''); // Reset giá trị title
                fetchReviews(); // Tải lại danh sách
            } else {
                toast.error(result.message || 'Có lỗi xảy ra');
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('Lỗi khi cập nhật đánh giá');
        }
    };

    // Xử lý xóa review
    const handleDeleteReview = async (id) => {
        if (window.confirm('Bạn có chắc muốn xóa đánh giá này?')) {
            try {
                const result = await adminReviewService.deleteReview(id);
                if (result.status) {
                    toast.success('Xóa đánh giá thành công');
                    fetchReviews();
                } else {
                    toast.error(result.message);
                }
            } catch (error) {
                toast.error('Lỗi khi xóa đánh giá');
            }
        }
    };

    // Lọc và sắp xếp reviews
    const getFilteredReviews = () => {
        return [...reviews]
            .filter(review => {
                if (filters.rating === 'all') return true;
                return review.rating === parseInt(filters.rating);
            })
            .sort((a, b) => {
                switch (filters.sortBy) {
                    case 'newest':
                        return new Date(b.date) - new Date(a.date);
                    case 'oldest':
                        return new Date(a.date) - new Date(b.date);
                    case 'rating-high':
                        return b.rating - a.rating;
                    case 'rating-low':
                        return a.rating - b.rating;
                    default:
                        return 0;
                }
            });
    };

    const filteredReviews = getFilteredReviews();

    // Render stars
    const renderStars = (rating) => {
        return [...Array(5)].map((_, index) => (
            <FaStar 
                key={index}
                className={index < rating ? 'text-yellow-400' : 'text-gray-300'}
            />
        ));
    };

    // Cập nhật lại khi mở modal edit
    const handleEditClick = (review) => {
        setSelectedReview(review);
        setEditingTitle(review.title); // Set giá trị title ban đầu
        setShowEditModal(true);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">
                    Quản lý đánh giá món ăn
                </h1>
                <div className="text-sm text-gray-600">
                    Tổng số: {reviews.length} đánh giá
                </div>
            </div>

            {/* Bộ lọc */}
            <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <select
                        className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={filters.rating}
                        onChange={(e) => setFilters({...filters, rating: e.target.value})}
                    >
                        <option value="all">Tất cả đánh giá</option>
                        {[5,4,3,2,1].map(num => (
                            <option key={num} value={num}>{num} sao</option>
                        ))}
                    </select>
                    <select
                        className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={filters.sortBy}
                        onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
                    >
                        <option value="newest">Mới nhất</option>
                        <option value="oldest">Cũ nhất</option>
                        <option value="rating-high">Đánh giá cao nhất</option>
                        <option value="rating-low">Đánh giá thấp nhất</option>
                    </select>
                </div>
            </div>

            {/* Danh sách đánh giá */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Khách hàng
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Đánh giá
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Nội dung
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Ngày đánh giá
                                </th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Thao tác
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredReviews.map((review) => (
                                <tr key={review.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium text-gray-900">
                                            {review.customerName}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-1">
                                            {renderStars(review.rating)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium text-gray-900">
                                            {review.title}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {review.content}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-500">
                                            {new Date(review.date).toLocaleString('vi-VN')}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right text-sm font-medium">
                                        <button
                                            onClick={() => handleEditClick(review)}
                                            className="text-indigo-600 hover:text-indigo-900 mr-3"
                                        >
                                            <FaEdit className="inline-block" /> Sửa
                                        </button>
                                        <button
                                            onClick={() => handleDeleteReview(review.id)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            <FaTrash className="inline-block" /> Xóa
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal chỉnh sửa */}
            {showEditModal && selectedReview && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-lg mx-4">
                        <h2 className="text-xl font-bold mb-4">Chỉnh sửa đánh giá</h2>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            // Cập nhật review với title mới
                            handleUpdateReview({
                                ...selectedReview,
                                title: editingTitle || selectedReview.title // Sử dụng title mới hoặc giữ nguyên nếu không thay đổi
                            });
                        }}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Tên khách hàng
                                </label>
                                <input
                                    type="text"
                                    value={selectedReview.customerName}
                                    onChange={(e) => setSelectedReview({
                                        ...selectedReview,
                                        customerName: e.target.value
                                    })}
                                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Đánh giá
                                </label>
                                <select
                                    value={selectedReview.rating}
                                    onChange={(e) => setSelectedReview({
                                        ...selectedReview,
                                        rating: parseInt(e.target.value)
                                    })}
                                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    {[5,4,3,2,1].map(num => (
                                        <option key={num} value={num}>{num} sao</option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Tiêu đề đánh giá
                                </label>
                                <input
                                    type="text"
                                    value={editingTitle !== '' ? editingTitle : selectedReview.title}
                                    onChange={(e) => setEditingTitle(e.target.value)}
                                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Nhập tiêu đề đánh giá"
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nội dung
                                </label>
                                <textarea
                                    value={selectedReview.content}
                                    onChange={(e) => setSelectedReview({
                                        ...selectedReview,
                                        content: e.target.value
                                    })}
                                    rows="4"
                                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Ngày đánh giá
                                </label>
                                <input
                                    type="datetime-local"
                                    value={selectedReview.date ? new Date(selectedReview.date).toISOString().slice(0, 16) : ''}
                                    onChange={(e) => {
                                        const date = new Date(e.target.value);
                                        const formattedDate = date.getFullYear() + '-' +
                                            String(date.getMonth() + 1).padStart(2, '0') + '-' +
                                            String(date.getDate()).padStart(2, '0') + ' ' +
                                            String(date.getHours()).padStart(2, '0') + ':' +
                                            String(date.getMinutes()).padStart(2, '0') + ':' +
                                            String(date.getSeconds()).padStart(2, '0');
                                        
                                        setSelectedReview({
                                            ...selectedReview,
                                            date: formattedDate
                                        });
                                    }}
                                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowEditModal(false);
                                        setSelectedReview(null);
                                        setEditingTitle(''); // Reset giá trị title khi đóng modal
                                    }}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    Lưu thay đổi
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReviewManagement;