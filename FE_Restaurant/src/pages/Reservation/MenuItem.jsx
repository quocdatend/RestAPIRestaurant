function MenuItem({ item, handleItemIncrement, handleItemDecrement, quantity }) {
  return (
    <div className="flex justify-between items-center border-b pb-2">
      <div>
        <h3 className="text-lg font-semibold">{item.name}</h3>
        <p className="text-gray-600">{item.price.toLocaleString()} VND</p>
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={() => handleItemDecrement(item)}
          className="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600"
        >
          -
        </button>
        <span>{quantity}</span>
        <button
          onClick={() => handleItemIncrement(item)}
          className="bg-blue-500 text-white px-2 py-1 rounded-md hover:bg-blue-600"
        >
          +
        </button>
      </div>
    </div>
  );
}

export default MenuItem;