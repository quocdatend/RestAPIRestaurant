import React from 'react';

const StatsCard = ({ title, value, icon, trend, color }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-500 text-sm">{title}</p>
          <h3 className="text-2xl font-bold mt-2">{value}</h3>
          <p className={`text-sm mt-2 ${trend.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
            {trend} so với tháng trước
          </p>
        </div>
        <div className={`${color} p-3 rounded-full`}>
          <span className="material-icons text-white">{icon}</span>
        </div>
      </div>
    </div>
  );
};

export default StatsCard; 