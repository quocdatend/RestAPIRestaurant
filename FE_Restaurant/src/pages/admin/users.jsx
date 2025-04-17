// src/pages/admin/UserManagement.jsx
import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/layout/AdminLayout';
import adminUserService from '../../services/adminUserService';
import { toast } from 'react-toastify';
import { 
  FaEdit, 
  FaTrash, 
  FaSearch, 
  FaUser, 
  FaEnvelope,
  FaUserShield,
  FaUsers,
  FaExclamationTriangle
} from 'react-icons/fa';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  // Form state chỉ cần email
  const [formData, setFormData] = useState({
    email: ''
  });

  // Fetch users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const result = await adminUserService.getAllUsers();
      if (result.status) {
        setUsers(result.data);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Không thể tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Xử lý cập nhật user
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!selectedUser) return;

    // Kiểm tra nếu email không thay đổi
    if (formData.email === selectedUser.email) {
      toast.info('Email không có thay đổi');
      return;
    }

    try {
      setIsUpdating(true);
      
      const result = await adminUserService.updateUser(selectedUser.id, {
        email: formData.email
      });
      
      if (result.status) {
        // Cập nhật state local
        setUsers(prevUsers => 
          prevUsers.map(user => 
            user.id === selectedUser.id 
              ? { ...user, email: formData.email }
              : user
          )
        );
        
        toast.success('Cập nhật thông tin thành công');
        
        // Fetch lại data để đảm bảo đồng bộ
        await fetchUsers();
        
        // Đóng modal
        setShowEditModal(false);
        setSelectedUser(null);
      }
      
    } catch (error) {
      console.error('Update error:', error);
      toast.error(error.message || 'Lỗi cập nhật thông tin');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <AdminLayout>
      <div className="p-6 bg-gray-50 min-h-screen">
        {/* Header với thống kê */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FaUsers className="text-blue-600 text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-gray-500 text-sm">Tổng số người dùng</p>
                <h3 className="text-xl font-bold text-gray-800">{users.length}</h3>
              </div>
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 flex items-center">
                <FaUserShield className="mr-2 text-blue-600" />
                Quản lý người dùng
              </h1>
              <p className="text-gray-500 mt-1">Quản lý tài khoản người dùng trong hệ thống</p>
            </div>
          </div>
        </div>

        {/* Search Box */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="relative max-w-md">
            <input
              type="text"
              placeholder="Tìm kiếm theo tên hoặc email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 transition duration-200"
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
        </div>

        {/* User List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            users.map((user) => (
              <div key={user.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition duration-200">
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        {user.username}
                      </h3>
                      <p className="text-gray-600 flex items-center mt-1">
                        <FaEnvelope className="mr-2" />
                        {user.email}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedUser(user);
                        setFormData({ email: user.email });
                        setShowEditModal(true);
                      }}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                    >
                      <FaEdit size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Edit Modal */}
        {showEditModal && selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg w-full max-w-md">
              <div className="p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center">
                  <FaEdit className="mr-2 text-blue-600" />
                  Cập nhật thông tin người dùng
                </h2>
                <form onSubmit={handleUpdate}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        <FaUser className="inline mr-2" />
                        Tên đăng nhập
                      </label>
                      <input
                        type="text"
                        value={selectedUser.username}
                        disabled
                        className="w-full border rounded-lg px-3 py-2 bg-gray-100"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        <FaEnvelope className="inline mr-2" />
                        Email
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500
                          ${formData.email === selectedUser.email ? 'border-yellow-500' : 'border-gray-300'}`}
                      />
                      {formData.email === selectedUser.email && (
                        <p className="mt-1 text-sm text-yellow-600">Email chưa được thay đổi</p>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 mt-6">
                    <button
                      type="button"
                      onClick={() => {
                        setShowEditModal(false);
                        setSelectedUser(null);
                      }}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800"
                      disabled={isUpdating}
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      disabled={isUpdating || formData.email === selectedUser.email}
                      className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center
                        ${(isUpdating || formData.email === selectedUser.email) ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {isUpdating ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      ) : (
                        <FaEdit className="mr-2" />
                      )}
                      Cập nhật
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default UserManagement;
