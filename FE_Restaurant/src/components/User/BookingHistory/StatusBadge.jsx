import React from 'react';

const StatusBadge = ({ status }) => {
  const statusConfig = {
    pending: {
      text: 'Đang chờ',
      class: 'bg-yellow-100 text-yellow-800',
    },
    completed: {
      text: 'Hoàn thành',
      class: 'bg-green-100 text-green-800',
    },
    cancelled: {
      text: 'Đã hủy',
      class: 'bg-red-100 text-red-800',
    },
  };

  const config = statusConfig[status] || {
    text: status,
    class: 'bg-gray-100 text-gray-800',
  };

  return (
    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${config.class}`}>
      {config.text}
    </span>
  );
};

export default StatusBadge;