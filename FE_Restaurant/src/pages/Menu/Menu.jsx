import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';
import { FaUtensils, FaSearch, FaRegClock } from 'react-icons/fa';

// Import các components
import MenuFilter from "../../components/user/Menu/MenuFilter";
import MenuList from "../../components/user/Menu/MenuList";
import MenuDetail from "../../components/user/Menu/MenuDetail";

function Menu() {
  const navigate = useNavigate();
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState(["Tất cả"]);
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showDetail, setShowDetail] = useState(false);

  useEffect(() => {
    fetchMenuItems();
  }, []);

  useEffect(() => {
    if (menuItems.length > 0) {
      const uniqueCategories = [
        "Tất cả",
        ...new Set(menuItems.map((item) => item.category_name)),
      ];
      setCategories(uniqueCategories);
    }
  }, [menuItems]);

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost/restapirestaurant/products");
      setMenuItems(response.data);
    } catch (error) {
      console.error("Lỗi khi tải menu:", error);
      setError("Không thể tải danh sách món ăn. Vui lòng thử lại sau!");
      toast.error("Không thể tải danh sách món ăn!");
    } finally {
      setLoading(false);
    }
  };

  const filteredMenu = menuItems.filter((item) =>
    selectedCategory === "Tất cả" ? true : item.category_name === selectedCategory
  );

  const handleReservation = (item) => {
    navigate('/reservation', { state: { selectedMenu: item } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      <div className="container mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            <FaUtensils className="inline-block mr-3 text-yellow-600" />
            Thực Đơn Của Chúng Tôi
          </h1>
          <p className="text-gray-600 text-lg">Khám phá hương vị độc đáo từ nhà hàng</p>
        </div>

        {/* Filter Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <MenuFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </div>

        {/* Menu Section */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-yellow-500 border-t-transparent"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="text-red-500 text-lg">{error}</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredMenu.map((item) => (
              <div key={item.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div 
                  className="relative cursor-pointer group"
                  onClick={() => setSelectedItem(item)}
                >
                  <img
                    src={item.image || '/default-food-image.jpg'}
                    alt={item.name}
                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <FaSearch className="text-white text-2xl" />
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{item.name}</h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-yellow-600 font-bold text-lg">
                      {Number(item.price).toLocaleString()} VND
                    </span>
                    <button
                      onClick={() => handleReservation(item)}
                      className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition-colors duration-300"
                    >
                      <FaRegClock className="text-lg" />
                      Đặt món
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Detail Modal */}
        {selectedItem && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-bold text-gray-800">{selectedItem.name}</h3>
                  <button 
                    onClick={() => setSelectedItem(null)}
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <img 
                  src={selectedItem.image || '/default-food-image.jpg'} 
                  alt={selectedItem.name}
                  className="w-full h-72 object-cover rounded-lg mb-6"
                />

                <div className="space-y-4">
                  <p className="text-2xl font-semibold text-yellow-600">
                    {Number(selectedItem.price).toLocaleString()} VND
                  </p>
                  
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Mô tả</h4>
                    <p className="text-gray-600">{selectedItem.description || "Chưa có mô tả"}</p>
                  </div>

                  {selectedItem.detail && (
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Chi tiết</h4>
                      <p className="text-gray-600">{selectedItem.detail}</p>
                    </div>
                  )}

                  <button
                    onClick={() => {
                      handleReservation(selectedItem);
                      setSelectedItem(null);
                    }}
                    className="w-full py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 
                             transition-colors duration-300 flex items-center justify-center gap-2"
                  >
                    <FaRegClock className="text-lg" />
                    Đặt món này
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Menu;