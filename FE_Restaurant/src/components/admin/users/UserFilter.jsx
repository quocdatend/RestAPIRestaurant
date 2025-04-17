import React from 'react';

const UserFilter = () => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <input
            type="text"
            placeholder="Tìm kiếm theo tên..."
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
        
        <div>
          <select className="w-full px-3 py-2 border rounded-md">
            <option value="">Tất cả vai trò</option>
            <option value="customer">Khách hàng</option>
            <option value="staff">Nhân viên</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        
        <div>
          <select className="w-full px-3 py-2 border rounded-md">
            <option value="">Tất cả trạng thái</option>
            <option value="active">Hoạt động</option>
            <option value="inactive">Khóa</option>
          </select>
        </div>
        
        <div>
          <button className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">
            Đặt lại bộ lọc
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserFilter; 