import React from 'react';

const MenuDetail = ({ item, onClose, onAddToCart }) => {
  if (!item) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-2xl font-bold text-gray-800">{item.name}</h3>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <img 
            src={item.image || '/default-food-image.jpg'} 
            alt={item.name}
            className="w-full h-72 object-cover rounded-lg mb-6"
          />

          <div className="space-y-4">
            <p className="text-2xl font-semibold text-yellow-600">
              {Number(item.price).toLocaleString()} VND
            </p>
            
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Mô tả</h4>
              <p className="text-gray-600">{item.description || "Chưa có mô tả"}</p>
            </div>

            {item.detail && (
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Chi tiết</h4>
                <p className="text-gray-600">{item.detail}</p>
              </div>
            )}

            <div className="pt-4">
              <button
                onClick={() => {
                  onAddToCart(item);
                  onClose();
                }}
                className="w-full py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 
                         transition-colors duration-300 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
                </svg>
                Thêm vào giỏ
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuDetail; 