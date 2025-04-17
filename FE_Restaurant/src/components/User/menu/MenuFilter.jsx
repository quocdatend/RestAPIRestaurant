import React from 'react';

const MenuFilter = ({ categories, selectedCategory, onSelectCategory }) => {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Danh mục món ăn</h2>
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onSelectCategory(category)}
            className={`px-4 py-2 rounded-full transition-colors duration-300
              ${selectedCategory === category
                ? "bg-yellow-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MenuFilter; 