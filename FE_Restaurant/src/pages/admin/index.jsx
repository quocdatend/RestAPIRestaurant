import React from 'react';
import AdminLayout from '../../components/admin/layout/AdminLayout';
import StatsCard from '../../components/admin/dashboard/StatsCard';
import RecentOrders from '../../components/admin/dashboard/RecentOrders';
import PopularItems from '../../components/admin/dashboard/PopularItems';
import RevenueChart from '../../components/admin/dashboard/RevenueChart';

const Dashboard = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold">Tổng quan</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Tổng doanh thu"
            value="12.5M VND"
            icon="payments"
            trend="+15%"
            color="bg-blue-500"
          />
          <StatsCard
            title="Đơn hàng mới"
            value="25"
            icon="shopping_cart"
            trend="+8%"
            color="bg-green-500"
          />
          <StatsCard
            title="Khách hàng"
            value="1,200"
            icon="people"
            trend="+12%"
            color="bg-purple-500"
          />
          <StatsCard
            title="Đặt bàn hôm nay"
            value="18"
            icon="event"
            trend="+5%"
            color="bg-yellow-500"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RevenueChart />
          <PopularItems />
        </div>

        <RecentOrders />
      </div>
    </AdminLayout>
  );
};

export default Dashboard; 