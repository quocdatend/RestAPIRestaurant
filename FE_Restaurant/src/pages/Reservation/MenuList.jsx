import MenuItem from './MenuItem.jsx';

function MenuList({ menuItems, handleQuantityChange, selectedItems }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {menuItems.map((item) => (
        <div 
          key={item.id} 
          className="bg-white rounded-lg shadow border p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex flex-col h-full justify-between">
            <div>
              <h3 className="font-semibold text-lg text-gray-800">{item.name}</h3>
              <p className="text-gray-600 text-sm mt-1">
                {item.description || 'Không có mô tả'}
              </p>
            </div>
            
            <div className="mt-4">
              <div className="flex justify-between items-center">
                <span className="text-yellow-600 font-bold text-lg">
                  {parseInt(item.price).toLocaleString()}đ
                </span>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => handleQuantityChange(item, -1)}
                    className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600"
                    disabled={!selectedItems.find(i => i.id === item.id)}
                  >
                    -
                  </button>
                  <span className="w-8 text-center font-medium">
                    {selectedItems.find(i => i.id === item.id)?.quantity || 0}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(item, 1)}
                    className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default MenuList;