import React from 'react';
import { 
  MdLocalShipping, 
  MdAccessTime,
  MdDoneAll,
  MdCancel 
} from 'react-icons/md';

const OrderStats = () => {
  const stats = [
    {
      title: 'Tổng đơn hàng',
      value: '1,234',
      icon: <MdLocalShipping size={24} />,
      color: 'blue'
    },
    {
      title: 'Đơn chờ xử lý',
      value: '15',
      icon: <MdAccessTime size={24} />,
      color: 'yellow'
    },
    {
      title: 'Đơn hoàn thành',
      value: '1,180',
      icon: <MdDoneAll size={24} />,
      color: 'green'
    },
    {
      title: 'Đơn hủy',
      value: '39',
      icon: <MdCancel size={24} />,
      color: 'red'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center">
            <div className={`p-3 bg-${stat.color}-100 rounded-lg`}>
              <div className={`text-${stat.color}-600`}>{stat.icon}</div>
            </div>
            <div className="ml-4">
              <p className="text-gray-500 text-sm">{stat.title}</p>
              <h3 className="text-xl font-bold text-gray-800">{stat.value}</h3>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderStats;