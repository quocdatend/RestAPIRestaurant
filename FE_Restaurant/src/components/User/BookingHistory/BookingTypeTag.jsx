import React from 'react';

const BookingTypeTag = ({ type }) => {
  let display, bgColorClass;
  
  switch(type) {
    case 'PARTY':
      display = 'Tiệc';
      bgColorClass = 'bg-purple-100 text-purple-800';
      break;
    case 'ROOM':
      display = 'Phòng';
      bgColorClass = 'bg-blue-100 text-blue-800';
      break;
    default:
      display = 'Khác';
      bgColorClass = 'bg-gray-100 text-gray-800';
  }
  
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${bgColorClass}`}>
      {display}
    </span>
  );
};

export default BookingTypeTag;