import { useState, useEffect } from "react";
import { FaUser, FaUtensils, FaFileInvoice } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { createOrder, formatOrderData } from "../../services/OrderApi";

// Import components
import ReservationForm from "../../components/user/Reservation/ReservationForm";
import MenuSelection from "../../components/user/Reservation/MenuSelection";
import ConfirmationStep from "../../components/user/Reservation/ConfirmationStep";

function Reservation() {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedMenu = location.state?.selectedMenu;

  // States
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    date: "",
    time: "",
    guests: "",
    eventType: "Đặt bàn thường",
    request: "",
  });

  const [menuItems, setMenuItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState(
    selectedMenu ? [{ ...selectedMenu, quantity: 1 }] : []
  );
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cash");

  // Steps configuration
  const steps = [
    { step: 1, title: "Thông tin", icon: FaUser },
    { step: 2, title: "Chọn món", icon: FaUtensils },
    { step: 3, title: "Xác nhận", icon: FaFileInvoice },
  ];

  // Fetch menu items
  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost/restapirestaurant/products"
      );
      setMenuItems(response.data);
    } catch (error) {
      console.error("Lỗi khi tải menu:", error);
      toast.error("Không thể tải danh sách món ăn!");
    } finally {
      setLoading(false);
    }
  };

  // Form handlers
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setCurrentStep(2);
      toast.success("Thông tin đã được lưu!");
    }
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error("Vui lòng nhập họ tên!");
      return false;
    }
    if (!formData.phone.trim()) {
      toast.error("Vui lòng nhập số điện thoại!");
      return false;
    }
    if (!formData.date) {
      toast.error("Vui lòng chọn ngày đặt bàn!");
      return false;
    }
    if (!formData.time) {
      toast.error("Vui lòng chọn thời gian!");
      return false;
    }
    if (!formData.guests || formData.guests < 1) {
      toast.error("Vui lòng nhập số lượng khách hợp lệ!");
      return false;
    }
    return true;
  };

  // Menu selection handlers
  const handleItemSelect = (item) => {
    setSelectedItems((prev) => {
      const exists = prev.find((i) => i.id === item.id);
      if (exists) {
        // Nếu món đã tồn tại, tăng số lượng lên 1
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      // Nếu món chưa tồn tại, thêm vào danh sách với số lượng 1
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const handleQuantityChange = (item, change) => {
    setSelectedItems((prev) => {
      return prev
        .map((i) => {
          if (i.id === item.id) {
            const newQuantity = i.quantity + change;
            // Nếu số lượng nhỏ hơn 1, loại bỏ món khỏi danh sách
            if (newQuantity < 1) {
              return null;
            }
            return { ...i, quantity: newQuantity };
          }
          return i;
        })
        .filter(Boolean); // Loại bỏ các mục null
    });
  };

  // Hàm để lấy thông tin người dùng từ token JWT
  const getUserDataFromToken = () => {
    try {
      // Lấy token từ localStorage
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("Không tìm thấy token");
        return null;
      }

      // Giải mã token JWT (không sử dụng thư viện)
      // Token JWT có 3 phần: header.payload.signature
      const tokenParts = token.split(".");
      if (tokenParts.length !== 3) {
        console.error("Token không hợp lệ");
        return null;
      }

      // Giải mã phần payload (phần thứ 2 của token)
      const payload = tokenParts[1];
      const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );

      // Parse JSON để lấy dữ liệu
      const userData = JSON.parse(jsonPayload);
      console.log("Thông tin người dùng từ token:", userData);

      return {
        id: userData.user_id || userData.id || userData.sub,
        username: userData.username || userData.name,
        email: userData.email,
      };
    } catch (error) {
      console.error("Lỗi khi giải mã token:", error);
      return null;
    }
  };

  // Lấy thông tin người dùng từ localStorage với xử lý lỗi tốt hơn
  const getUserData = () => {
    // Thử lấy dữ liệu từ token trước
    const tokenData = getUserDataFromToken();
    if (tokenData) return tokenData;

    let userData = null;

    // Thử lấy từ userData
    try {
      const userDataStr = localStorage.getItem("userData");
      if (userDataStr) {
        userData = JSON.parse(userDataStr);
        if (userData && userData.id) return userData;
      }
    } catch (e) {
      console.error("Lỗi khi parse userData:", e);
    }

    // Thử lấy từ user
    try {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        userData = JSON.parse(userStr);
        if (userData && userData.id) return userData;
      }
    } catch (e) {
      console.error("Lỗi khi parse user:", e);
    }

    // Thử lấy từ các trường riêng lẻ
    const userId = localStorage.getItem("user_id");
    if (userId) {
      return {
        id: userId,
        username: localStorage.getItem("username") || "Khách",
        email: localStorage.getItem("email") || "",
      };
    }

    // Dữ liệu mặc định nếu không tìm thấy
    return {
      id: "guest_" + Date.now(),
      username: "Khách",
      email: "",
    };
  };

  // Final submission handler
  const handleConfirmation = async (paymentMethod) => {
    try {
      setLoading(true);

      // Kiểm tra formData có partyType không
      console.log("FormData trước khi gửi:", formData);

      if (!formData.partyType) {
        // Nếu không có partyType, gán giá trị mặc định
        setFormData((prev) => ({ ...prev, partyType: "normal" }));
      }

      // Lấy thông tin người dùng từ token và các nguồn khác
      const userData = getUserData();
      console.log("Thông tin người dùng:", userData);

      // Kiểm tra có user_id không
      if (!userData || !userData.id) {
        toast.error(
          "Không thể xác định thông tin người dùng. Vui lòng đăng nhập lại!"
        );
        setTimeout(() => navigate("/login"), 2000);
        return;
      }

      // Format dữ liệu đơn hàng
      const orderData = formatOrderData(formData, selectedItems, userData);
      console.log("OrderData sau khi format:", orderData);

      // Đảm bảo các trường quan trọng được điền đầy đủ
      if (!orderData.style_tiec) {
        orderData.style_tiec = formData.eventType || "Đặt bàn thường";
      }

      if (!orderData.user_id && userData.id) {
        orderData.user_id = userData.id;
      }
      //------------------------
      const responseServer = await createOrder(orderData);
      console.log("Phản hồi từ server:", responseServer);
      if (paymentMethod === "online") {
        try {
          // Hàm lấy tỷ giá
          const getLiveExchangeRate = async () => {
            const res = await fetch(
              "https://api.exchangerate-api.com/v4/latest/VND"
            );
            const data = await res.json();
            return data.rates.USD;
          };

          // Hàm chuyển đổi VND -> USD
          const convertVNDToUSD = (vndAmount, exchangeRate = 25000) => {
            const usd = vndAmount / exchangeRate;
            return usd.toFixed(2);
          };

          // Lấy tỷ giá thật
          const exchangeRate = await getLiveExchangeRate();

          const orderDataForPay = {
            amount: convertVNDToUSD(orderData.total_price, exchangeRate),
            currency: "USD",
            description: "Thanh toán đơn hàng",
            user_id: orderData.user_id,
            order_id: responseServer.order_id,
          };

          console.log("Dữ liệu gửi thanh toán:", orderDataForPay);
          const response = await axios.post(
            "http://localhost/restapirestaurant/payments/initiate",
            orderDataForPay,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json"
              }
            }
          );
          console.log("Phản hồi từ PayPal:", response);
          window.open(response.data.approval_url, "_blank");
        } catch (error) {
          console.error("Lỗi khi gửi dữ liệu:", error);
          toast.error("Có lỗi xảy ra khi xử lý đơn hàng. Vui lòng thử lại!");
        }
      }
      toast.success("Đặt bàn thành công! Cảm ơn quý khách!");
      setTimeout(() => navigate("/"), 1500);
    } catch (error) {
      console.error("Lỗi khi gửi dữ liệu:", error);
      toast.error("Có lỗi xảy ra khi xử lý đơn hàng. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  // Step progress renderer
  const renderStepProgress = () => (
    <div className="max-w-4xl mx-auto mb-8">
      <div className="flex justify-between items-center relative">
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 h-1 bg-gray-200 w-full -z-10" />
        <div
          className="absolute left-0 top-1/2 transform -translate-y-1/2 h-1 bg-yellow-500 transition-all duration-500"
          style={{
            width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
          }}
        />

        {steps.map((step) => (
          <div
            key={step.step}
            className={`flex flex-col items-center ${
              currentStep >= step.step ? "text-yellow-500" : "text-gray-400"
            }`}
          >
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center mb-2
                ${
                  currentStep >= step.step
                    ? "bg-yellow-500 text-white"
                    : "bg-gray-200"
                }
                transition-all duration-500 transform ${
                  currentStep === step.step ? "scale-110" : ""
                }
              `}
            >
              <step.icon
                className={`text-xl ${
                  currentStep === step.step ? "animate-bounce" : ""
                }`}
              />
            </div>
            <span className="text-sm font-medium">{step.title}</span>
          </div>
        ))}
      </div>
    </div>
  );

  // Step content renderer
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-6 animate-fadeIn">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">
                Thông tin đặt bàn
              </h2>
              <ReservationForm
                formData={formData}
                onChange={handleFormChange}
                onSubmit={handleFormSubmit}
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-6 animate-slideIn">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">
                Chọn món ăn
              </h2>
              <MenuSelection
                menuItems={menuItems}
                selectedItems={selectedItems}
                onItemSelect={handleItemSelect}
                onQuantityChange={handleQuantityChange}
                loading={loading}
              />
              <div className="flex justify-between mt-6 pt-6 border-t">
                <button
                  onClick={() =>
                    setCurrentStep((prev) => Math.max(prev - 1, 1))
                  }
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 
                           transition-colors duration-300"
                >
                  Quay lại
                </button>
                <button
                  onClick={() => setCurrentStep(3)}
                  className="px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 
                           transition-all duration-300 transform hover:scale-105"
                  disabled={loading}
                >
                  {loading ? "Đang xử lý..." : "Tiếp tục"}
                </button>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="animate-fadeIn">
            <ConfirmationStep
              formData={formData}
              selectedItems={selectedItems}
              onConfirm={handleConfirmation}
              loading={loading}
            />
            <div className="flex justify-between mt-6 pt-6 border-t">
              <button
                onClick={() => setCurrentStep((prev) => Math.max(prev - 1, 1))}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 
                         transition-colors duration-300"
              >
                Quay lại
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white py-12">
      <div className="container mx-auto px-4">
        <ToastContainer />
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          Đặt bàn trực tuyến
        </h1>

        {renderStepProgress()}
        {renderStepContent()}
      </div>
    </div>
  );
}

export default Reservation;
