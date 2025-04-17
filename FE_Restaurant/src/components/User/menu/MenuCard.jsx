import React from 'react';

const MenuCard = ({ item, onAddToCart, onShowDetail }) => {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
      <div 
        className="cursor-pointer"
        onClick={() => onShowDetail(item)}
      >
        <img 
          src={item.image || '/default-food-image.jpg'} 
          alt={item.name}
          className="w-full h-48 object-cover rounded-t-lg"
        />
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">{item.name}</h3>
          <p className="text-yellow-600 font-medium text-lg">
            {Number(item.price).toLocaleString()} VND
          </p>
          <p className="text-gray-600 text-sm mt-2 line-clamp-2">
            {item.description || "Chưa có mô tả"}
          </p>
        </div>
      </div>
      <div className="px-4 pb-4">
        <button
          onClick={() => onAddToCart(item)}
          className="w-full py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 
                   transition-colors duration-300 flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
          </svg>
          Thêm vào giỏ
        </button>
      </div>
    </div>
  );
};

export default MenuCard; 