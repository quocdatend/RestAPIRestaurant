import React from 'react';
import MenuCard from './MenuCard';

const MenuList = ({ items, onAddToCart, onShowDetail }) => {
  if (!items.length) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Không có món ăn nào trong danh mục này</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {items.map(item => (
        <MenuCard
          key={item.id}
          item={item}
          onAddToCart={onAddToCart}
          onShowDetail={onShowDetail}
        />
      ))}
    </div>
  );
};

export default MenuList; 