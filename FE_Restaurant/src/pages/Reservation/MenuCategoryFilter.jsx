function MenuCategoryFilter({ categories, selectedCategory, onCategoryChange }) {
  return (
    <div className="flex justify-center mb-8">
      {categories.map((category) => (
        <button
          key={category}
          className={`px-4 py-2 mx-2 rounded-lg font-semibold ${
            selectedCategory === category
              ? 'bg-gray-800 text-white'
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          }`}
          onClick={() => onCategoryChange(category)}
        >
          {category}
        </button>
      ))}
    </div>
  );
  
  }
  
  export default MenuCategoryFilter;