import React from 'react';

const RecentOrders = () => {
  const orders = [
    {
      id: '#123',
      customer: 'Nguyễn Văn A',
      date: '2024-01-20',
      amount: '250.000 VND',
      status: 'Hoàn thành'
    },
    // Thêm dữ liệu mẫu khác...
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Đơn hàng gần đây</h2>
        <button className="text-blue-500 hover:text-blue-700">Xem tất cả</button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-4">ID</th>
              <th className="text-left py-3 px-4">Khách hàng</th>
              <th className="text-left py-3 px-4">Ngày</th>
              <th className="text-left py-3 px-4">Số tiền</th>
              <th className="text-left py-3 px-4">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4">{order.id}</td>
                <td className="py-3 px-4">{order.customer}</td>
                <td className="py-3 px-4">{order.date}</td>
                <td className="py-3 px-4">{order.amount}</td>
                <td className="py-3 px-4">
                  <span className="px-2 py-1 rounded-full text-sm bg-green-100 text-green-800">
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentOrders; 