import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/layout/AdminLayout';
import { toast } from 'react-toastify';
import { 
  MdAttachMoney, 
  MdRestaurant, 
  MdPeople, 
  MdRestaurantMenu,
  MdDownload,
  MdTrendingUp,
  MdMoreVert
} from 'react-icons/md';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  
  // Dữ liệu mẫu động cho thống kê
  const [stats, setStats] = useState([
    {
      title: 'Tổng doanh thu',
      value: new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
      }).format(12500000),
      increase: '+12%',
      icon: <MdAttachMoney size={24} />,
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600'
    },
    {
      title: 'Đơn đặt bàn hôm nay',
      value: '25',
      increase: '+5%',
      icon: <MdRestaurant size={24} />,
      bgColor: 'bg-green-100',
      textColor: 'text-green-600'
    },
    {
      title: 'Khách hàng mới',
      value: '48',
      increase: '+8%',
      icon: <MdPeople size={24} />,
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-600'
    },
    {
      title: 'Tổng số món ăn',
      value: '156',
      increase: '+3%',
      icon: <MdRestaurantMenu size={24} />,
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-600'
    }
  ]);

  // Dữ liệu mẫu động cho đơn đặt bàn
  const [recentReservations, setRecentReservations] = useState([
    {
      id: 'DH001',
      customer: 'Nguyễn Văn A',
      date: new Date().toLocaleDateString('vi-VN'),
      time: '19:00',
      people: 4,
      status: 'confirmed',
      phone: '0123456789',
      note: 'Cần bàn view đẹp'
    },
    {
      id: 'DH002',
      customer: 'Trần Thị B',
      date: new Date().toLocaleDateString('vi-VN'),
      time: '20:00',
      people: 2,
      status: 'pending',
      phone: '0987654321',
      note: 'Đặt bàn sinh nhật'
    },
    {
      id: 'DH003',
      customer: 'Lê Văn C',
      date: new Date(Date.now() + 86400000).toLocaleDateString('vi-VN'),
      time: '18:30',
      people: 6,
      status: 'confirmed',
      phone: '0369852147',
      note: 'Cần bàn yên tĩnh'
    }
  ]);

  // Dữ liệu mẫu động cho món ăn phổ biến
  const [popularDishes, setPopularDishes] = useState([
    {
      id: 1,
      name: 'Há Cảo',
      orderCount: 150,
      price: 55000,
      image: 'https://example.com/ha-cao.jpg',
      category: 'Món khai vị',
      rating: 4.8
    },
    {
      id: 2,
      name: 'Sườn Nướng',
      orderCount: 120,
      price: 150000,
      image: 'https://example.com/suon-nuong.jpg',
      category: 'Món chính',
      rating: 4.9
    },
    {
      id: 3,
      name: 'Gỏi Cuốn',
      orderCount: 100,
      price: 45000,
      image: 'https://example.com/goi-cuon.jpg',
      category: 'Món khai vị',
      rating: 4.7
    },
    {
      id: 4,
      name: 'Cơm Chiên Hải Sản',
      orderCount: 95,
      price: 120000,
      image: 'https://example.com/com-chien.jpg',
      category: 'Món chính',
      rating: 4.6
    }
  ]);

  // Giả lập loading data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Giả lập delay API
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Cập nhật số liệu thống kê ngẫu nhiên
        setStats(prevStats => prevStats.map(stat => ({
          ...stat,
          increase: `${(Math.random() * 20 - 10).toFixed(1)}%`
        })));

        // Thêm đơn đặt bàn mới
        const newReservation = {
          id: `DH00${recentReservations.length + 1}`,
          customer: 'Khách hàng mới',
          date: new Date().toLocaleDateString('vi-VN'),
          time: '21:00',
          people: Math.floor(Math.random() * 6) + 1,
          status: Math.random() > 0.5 ? 'confirmed' : 'pending',
          phone: '0912345678',
          note: 'Đơn đặt bàn mới'
        };
        setRecentReservations(prev => [newReservation, ...prev.slice(0, -1)]);

        // Cập nhật số lượt đặt món ngẫu nhiên
        setPopularDishes(prev => prev.map(dish => ({
          ...dish,
          orderCount: dish.orderCount + Math.floor(Math.random() * 5)
        })));

      } catch (error) {
        toast.error('Có lỗi khi tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // Cập nhật dữ liệu mỗi 30 giây
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-6 p-6 bg-gray-50">
        {/* Tiêu đề trang */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Tổng quan</h1>
              <p className="text-gray-500 mt-1">
                Cập nhật lần cuối: {new Date().toLocaleString('vi-VN')}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center transition duration-200">
                <MdDownload className="mr-2" size={20} />
                Tải báo cáo
              </button>
            </div>
          </div>
        </div>

        {/* Thống kê */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow duration-200">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-500 text-sm">{stat.title}</p>
                  <h3 className="text-2xl font-bold mt-2">{stat.value}</h3>
                  <div className="flex items-center mt-2">
                    <MdTrendingUp className={parseFloat(stat.increase) >= 0 ? 'text-green-500' : 'text-red-500'} />
                    <p className={parseFloat(stat.increase) >= 0 ? 'text-green-500 text-sm' : 'text-red-500 text-sm'}>
                      {stat.increase} so với tháng trước
                    </p>
                  </div>
                </div>
                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                  <div className={stat.textColor}>{stat.icon}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Đơn đặt bàn gần đây */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Đơn đặt bàn gần đây</h2>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">
                {recentReservations.length} đơn mới
              </span>
              <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                Xem tất cả
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mã đơn
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Khách hàng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ngày
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Giờ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Số người
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentReservations.map((reservation) => (
                  <tr key={reservation.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-blue-600">
                        {reservation.id}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        <div className="font-medium text-gray-900">{reservation.customer}</div>
                        <div className="text-gray-500">{reservation.phone}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {reservation.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {reservation.time}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {reservation.people} người
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        reservation.status === 'confirmed' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {reservation.status === 'confirmed' ? 'Đã xác nhận' : 'Chờ xác nhận'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Món ăn phổ biến */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Món ăn phổ biến</h2>
            <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
              Xem tất cả
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularDishes.map((dish) => (
              <div key={dish.id} className="flex items-center space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden">
                  <img 
                    src={dish.image} 
                    alt={dish.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/150';
                    }}
                  />
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">{dish.name}</h3>
                  <p className="text-sm text-gray-500">Đã đặt: {dish.orderCount} lần</p>
                  <p className="text-sm font-medium text-green-600">
                    {new Intl.NumberFormat('vi-VN', {
                      style: 'currency',
                      currency: 'VND'
                    }).format(dish.price)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;