import React, { useState } from 'react';
import Table from '../common/Table';
import { MdEdit, MdDelete, MdVisibility, MdMoreVert } from 'react-icons/md';

const MenuList = () => {
  const [menuItems] = useState([
    {
      id: 1,
      name: 'Phở bò tái',
      category: 'Món chính',
      price: '55.000',
      status: 'available',
      image: '/images/pho.jpg'
    },
    {
      id: 2,
      name: 'Cơm gà xối mỡ',
      category: 'Món chính',
      price: '45.000',
      status: 'available',
      image: '/images/com-ga.jpg'
    },
    {
      id: 3,
      name: 'Bánh flan',
      category: 'Tráng miệng',
      price: '15.000',
      status: 'unavailable',
      image: '/images/flan.jpg'
    },
    {
      id: 4,
      name: 'Trà đào cam sả',
      category: 'Đồ uống',
      price: '25.000',
      status: 'available',
      image: '/images/tra-dao.jpg'
    }
  ]);

  const columns = [
    {
      header: 'Hình ảnh',
      accessor: 'image',
      cell: (value) => (
        <div className="w-16 h-16 relative rounded-lg overflow-hidden bg-gray-100">
          <img 
            src={value} 
            alt="" 
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/150?text=No+Image';
            }}
          />
        </div>
      )
    },
    { 
      header: 'Tên món', 
      accessor: 'name',
      cell: (value) => (
        <div className="font-medium text-gray-800">{value}</div>
      )
    },
    { 
      header: 'Danh mục', 
      accessor: 'category',
      cell: (value) => (
        <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
          {value}
        </span>
      )
    },
    { 
      header: 'Giá', 
      accessor: 'price',
      cell: (value) => (
        <div className="font-medium text-gray-800">
          {value} VNĐ
        </div>
      )
    },
    {
      header: 'Trạng thái',
      accessor: 'status',
      cell: (value) => (
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
          value === 'available' 
            ? 'bg-green-100 text-green-700' 
            : 'bg-red-100 text-red-700'
        }`}>
          {value === 'available' ? 'Còn món' : 'Hết món'}
        </span>
      )
    },
    {
      header: 'Thao tác',
      accessor: 'actions',
      cell: (_, row) => (
        <div className="flex items-center justify-end space-x-2">
          <button 
            className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors duration-200"
            title="Xem chi tiết"
          >
            <MdVisibility size={20} />
          </button>
          <button 
            className="p-1.5 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-full transition-colors duration-200"
            title="Chỉnh sửa"
          >
            <MdEdit size={20} />
          </button>
          <button 
            className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors duration-200"
            title="Xóa"
          >
            <MdDelete size={20} />
          </button>
          <button 
            className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors duration-200"
            title="Thêm"
          >
            <MdMoreVert size={20} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800">Danh sách món ăn</h3>
        <p className="text-sm text-gray-500 mt-1">Quản lý tất cả món ăn trong thực đơn</p>
      </div>
      
      <Table 
        data={menuItems}
        columns={columns}
        pagination={{
          totalItems: menuItems.length,
          itemsPerPage: 10,
          onPageChange: (page) => console.log(page)
        }}
      />
    </div>
  );
};

export default MenuList; 