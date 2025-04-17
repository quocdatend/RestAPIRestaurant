import React, { useState, useEffect } from 'react';
import { FaSearch, FaEdit, FaTrash, FaPlus, FaUserShield, FaUser, FaFilter } from 'react-icons/fa';
import UserForm from './UserForm';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Mock data - thay thế bằng API call thực tế
  const mockUsers = [
    {
      id: 1,
      fullName: 'Nguyễn Văn Admin',
      username: 'admin',
      email: 'admin@example.com',
      phone: '0901234567',
      role: 'admin',
      status: 'active',
      lastLogin: '2023-05-22T08:30:00',
      createdAt: '2023-01-15T10:00:00'
    },
    {
      id: 2,
      fullName: 'Trần Thị Quản Lý',
      username: 'manager',
      email: 'manager@example.com',
      phone: '0912345678',
      role: 'manager',
      status: 'active',
      lastLogin: '2023-05-21T14:45:00',
      createdAt: '2023-02-20T09:15:00'
    },
    {
      id: 3,
      fullName: 'Lê Văn Nhân Viên',
      username: 'staff1',
      email: 'staff1@example.com',
      phone: '0987654321',
      role: 'staff',
      status: 'active',
      lastLogin: '2023-05-22T10:20:00',
      createdAt: '2023-03-10T11:30:00'
    },
    {
      id: 4,
      fullName: 'Phạm Thị Bếp',
      username: 'kitchen1',
      email: 'kitchen1@example.com',
      phone: '0976543210',
      role: 'kitchen',
      status: 'active',
      lastLogin: '2023-05-22T07:15:00',
      createdAt: '2023-03-15T08:45:00'
    },
    {
      id: 5,
      fullName: 'Hoàng Văn Phục Vụ',
      username: 'waiter1',
      email: 'waiter1@example.com',
      phone: '0965432109',
      role: 'waiter',
      status: 'inactive',
      lastLogin: '2023-05-10T09:30:00',
      createdAt: '2023-04-05T10:20:00'
    },
  ];

  useEffect(() => {
    // Giả lập API call
    setTimeout(() => {
      setUsers(mockUsers);
      setFilteredUsers(mockUsers);
      setIsLoading(false);
    }, 800);
  }, []);

  useEffect(() => {
    // Lọc người dùng khi các bộ lọc thay đổi
    filterUsers();
  }, [searchTerm, roleFilter, statusFilter, users]);

  const filterUsers = () => {
    let result = [...users];

    // Tìm kiếm
    if (searchTerm) {
      result = result.filter(
        (user) =>
          user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (user.phone && user.phone.includes(searchTerm))
      );
    }

    // Lọc theo vai trò
    if (roleFilter) {
      result = result.filter((user) => user.role === roleFilter);
    }

    // Lọc theo trạng thái
    if (statusFilter) {
      result = result.filter((user) => user.status === statusFilter);
    }

    setFilteredUsers(result);
  };

  const handleAddUser = () => {
    setEditUser(null);
    setShowForm(true);
  };

  const handleEditUser = (user) => {
    setEditUser(user);
    setShowForm(true);
  };

  const handleSaveUser = (userData) => {
    if (userData.id) {
      // Cập nhật người dùng
      setUsers((prev) => prev.map((user) => (user.id === userData.id ? userData : user)));
    } else {
      // Thêm người dùng mới
      const newUser = {
        ...userData,
        id: Math.max(...users.map((user) => user.id), 0) + 1,
        createdAt: new Date().toISOString(),
        lastLogin: null,
      };
      setUsers((prev) => [...prev, newUser]);
    }
    setShowForm(false);
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
      setUsers((prev) => prev.filter((user) => user.id !== userId));
    }
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'admin':
        return { label: 'Quản trị viên', bgColor: 'bg-red-100 text-red-800' };
      case 'manager':
        return { label: 'Quản lý', bgColor: 'bg-blue-100 text-blue-800' };
      case 'staff':
        return { label: 'Nhân viên', bgColor: 'bg-green-100 text-green-800' };
      case 'kitchen':
        return { label: 'Bếp', bgColor: 'bg-yellow-100 text-yellow-800' };
      case 'waiter':
        return { label: 'Phục vụ', bgColor: 'bg-purple-100 text-purple-800' };
      default:
        return { label: role, bgColor: 'bg-gray-100 text-gray-800' };
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Chưa đăng nhập';
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-semibold text-gray-800">Quản lý người dùng</h1>
        <button
          onClick={handleAddUser}
          className="flex items-center px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
        >
          <FaPlus className="mr-2" />
          Thêm người dùng
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Tìm kiếm tên, email, số điện thoại..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
          <FaSearch className="absolute left-3 top-2.5 text-gray-400" />
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
          >
            <option value="">Tất cả vai trò</option>
            <option value="admin">Quản trị viên</option>
            <option value="manager">Quản lý</option>
            <option value="staff">Nhân viên</option>
            <option value="kitchen">Bếp</option>
            <option value="waiter">Phục vụ</option>
          </select>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="active">Đang hoạt động</option>
            <option value="inactive">Không hoạt động</option>
          </select>
          
          <button className="flex items-center px-3 py-2 border rounded-md text-sm hover:bg-gray-50">
            <FaFilter className="mr-2" />
            Lọc
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Người dùng
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thông tin liên hệ
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vai trò
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Đăng nhập cuối
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => {
                      const roleBadge = getRoleBadge(user.role);
                      return (
                        <tr key={user.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                                {user.role === 'admin' ? (
                                  <FaUserShield className="h-5 w-5 text-gray-500" />
                                ) : (
                                  <FaUser className="h-5 w-5 text-gray-500" />
                                )}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{user.fullName}</div>
                                <div className="text-sm text-gray-500">@{user.username}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{user.email}</div>
                            <div className="text-sm text-gray-500">{user.phone}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${roleBadge.bgColor}`}>
                              {roleBadge.label}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              user.status === 'active'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {user.status === 'active' ? 'Đang hoạt động' : 'Không hoạt động'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(user.lastLogin)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => handleEditUser(user)}
                              className="text-blue-600 hover:text-blue-900 mr-3"
                              title="Chỉnh sửa"
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user.id)}
                              className={`text-red-600 hover:text-red-900 ${
                                user.role === 'admin' ? 'opacity-50 cursor-not-allowed' : ''
                              }`}
                              disabled={user.role === 'admin'}
                              title={user.role === 'admin' ? 'Không thể xóa tài khoản Admin' : 'Xóa'}
                            >
                              <FaTrash />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                        Không tìm thấy người dùng nào phù hợp với tìm kiếm của bạn.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Hiển thị <span className="font-medium">1</span> đến{' '}
                    <span className="font-medium">{filteredUsers.length}</span> trong số{' '}
                    <span className="font-medium">{filteredUsers.length}</span> kết quả
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <a
                      href="#"
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    >
                      Trước
                    </a>
                    <a
                      href="#"
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      1
                    </a>
                    <a
                      href="#"
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    >
                      Sau
                    </a>
                  </nav>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* User Form Modal */}
      {showForm && (
        <UserForm
          user={editUser}
          onSave={handleSaveUser}
          onCancel={() => setShowForm(false)}
        />
      )}
    </div>
  );
};

export default UserList; 