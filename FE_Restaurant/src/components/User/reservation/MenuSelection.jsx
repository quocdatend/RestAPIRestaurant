const MenuSelection = ({ 
  menuItems, 
  selectedItems, 
  onItemSelect, 
  onQuantityChange,
  loading 
}) => {
  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-yellow-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menuItems.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 
                     hover:shadow-xl hover:-translate-y-1"
          >
            <img
              src={item.image || '/default-food-image.jpg'}
              alt={item.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-2">{item.name}</h3>
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {item.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-yellow-600 font-bold">
                  {Number(item.price).toLocaleString()} VND
                </span>
                {selectedItems.find((selected) => selected.id === item.id) ? (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onQuantityChange(item, -1)}
                      className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center 
                               hover:bg-gray-200 transition-colors"
                    >
                      -
                    </button>
                    <span>
                      {selectedItems.find((selected) => selected.id === item.id).quantity}
                    </span>
                    <button
                      onClick={() => onQuantityChange(item, 1)}
                      className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center 
                               hover:bg-gray-200 transition-colors"
                    >
                      +
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => onItemSelect(item)}
                    className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 
                             transition-all duration-300 transform hover:scale-105"
                  >
                    Chọn món
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenuSelection; 