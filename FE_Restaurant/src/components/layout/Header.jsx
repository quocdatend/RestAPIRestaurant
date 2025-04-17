import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaUser, FaBars, FaTimes, FaSignOutAlt, FaHistory } from "react-icons/fa";
import { toast } from "react-toastify";
import logo from "../../assets/logo.png";

// Tạo một hàm helper để kiểm tra token rõ ràng
function isUserLoggedIn() {
  const token = localStorage.getItem('token');
  return !!token; // Chuyển thành boolean
}

function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Thay vì state isLoggedIn, dùng trực tiếp hàm helper
  const [userData, setUserData] = useState(() => {
    try {
      const storedData = localStorage.getItem('userData');
      return storedData ? JSON.parse(storedData) : {};
    } catch {
      return {};
    }
  });
  
  // Kiểm tra trạng thái đăng nhập khi component mount
  useEffect(() => {
    checkLoginStatus();
    
    // Thêm sự kiện lắng nghe thay đổi localStorage
    window.addEventListener('storage', checkLoginStatus);
    
    // Thêm custom event listener cho đăng nhập/đăng xuất
    window.addEventListener('login', checkLoginStatus);
    window.addEventListener('logout', checkLoginStatus);
    
    return () => {
      window.removeEventListener('storage', checkLoginStatus);
      window.removeEventListener('login', checkLoginStatus);
      window.removeEventListener('logout', checkLoginStatus);
    };
  }, []);
  
  // Kiểm tra trạng thái đăng nhập
  const checkLoginStatus = (forceRefresh = false) => {
    try {
      const token = localStorage.getItem('token');
      console.log("Token hiện tại:", token);
      
      if (token) {
        const storedUserData = localStorage.getItem('userData');
        let userInfo = {};
        
        if (storedUserData) {
          try {
            userInfo = JSON.parse(storedUserData);
          } catch (e) {
            console.error("Lỗi parse userData:", e);
            userInfo = { username: "Người dùng" };
          }
        } else {
          // Nếu không có userData nhưng có token, gán giá trị mặc định
          userInfo = { username: "Người dùng" };
        }
        
        console.log("User data:", userInfo);
        setUserData(userInfo);
        
        // Nếu forceRefresh, làm mới component
        if (forceRefresh) {
          setDropdownOpen(false);
        }
      } else {
        setUserData({});
      }
    } catch (error) {
      console.error("Lỗi khi kiểm tra đăng nhập:", error);
      setUserData({});
    }
  };
  
  // Hàm xử lý đăng xuất
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    setDropdownOpen(false);
    toast.success("Đăng xuất thành công!");
    navigate('/login');
  };
  
  // Xử lý hiệu ứng scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  
  // Kiểm tra nếu link đang active
  const isActive = (path) => {
    return location.pathname === path;
  };
  
  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  // Toggle dropdown người dùng
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };
  
  // Tính toán chiều cao của header
  const headerHeight = isScrolled ? "h-16" : "h-20";
  
  return (
    <>
      {/* Phần tử tạo khoảng trống bằng chiều cao của header */}
      <div className={headerHeight}></div>
      
      <nav 
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled 
            ? "bg-white shadow-md py-2 text-gray-800 h-16" 
            : "bg-gradient-to-r from-amber-700/80 to-amber-900/80 backdrop-blur-sm py-4 text-white h-20"
        }`}
      >
        <div className="container mx-auto px-4 flex justify-between items-center h-full">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src={logo} 
              alt="HaDiDi Restaurant Logo" 
              className={`transition-all duration-300 ${isScrolled ? "h-10" : "h-12"}`} 
            />
            <span 
              className={`font-bold text-2xl tracking-tight transition-colors duration-300 ${
                isScrolled 
                  ? "text-amber-600" 
                  : "text-white"
              }`}
            >
              HaDiDi
            </span>
          </Link>
          
          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-1">
            <NavLink to="/" isActive={isActive("/")} isScrolled={isScrolled}>
              Trang chủ
            </NavLink>
            
            <NavLink to="/about" isActive={isActive("/about")} isScrolled={isScrolled}>
              Giới thiệu
            </NavLink>
            
            <NavLink to="/menu" isActive={isActive("/menu")} isScrolled={isScrolled}>
              Thực đơn
            </NavLink>
            
            <NavLink to="/reservation" isActive={isActive("/reservation")} isScrolled={isScrolled}>
              Đặt lịch
            </NavLink>
            
            <NavLink to="/BookingHistory" isActive={isActive("/BookingHistory")} isScrolled={isScrolled}>
              Tiệc Của Bạn
            </NavLink>
            
            <NavLink to="/CustomerReview" isActive={isActive("/CustomerReview")} isScrolled={isScrolled}>
              Đánh giá
            </NavLink>
            
            <NavLink to="/contact" isActive={isActive("/contact")} isScrolled={isScrolled}>
              Liên hệ
            </NavLink>
            
            {/* Hiển thị nút đăng nhập hoặc avatar người dùng */}
            {isUserLoggedIn() ? (
              <div className="relative ml-2">
                <button
                  onClick={toggleDropdown}
                  className={`px-3 py-2 rounded-full flex items-center transition-all duration-300 ${
                    isScrolled
                      ? "bg-amber-50 text-amber-700 hover:bg-amber-100"
                      : "bg-white/10 text-white hover:bg-white/20"
                  }`}
                >
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center ${
                    isScrolled ? "bg-amber-600 text-white" : "bg-white text-amber-700"
                  }`}>
                    <span className="text-sm font-bold">
                      {userData?.username ? userData.username[0].toUpperCase() : 'U'}
                    </span>
                  </div>
                  <span className="ml-2 hidden md:inline">
                    {userData?.username || 'Người dùng'}
                  </span>
                </button>
                
                {/* Dropdown menu */}
                {dropdownOpen && (
                  <div className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg z-50 overflow-hidden transition-all duration-200 ${
                    isScrolled ? "bg-white" : "bg-amber-800/95 backdrop-blur-sm"
                  }`}>
                    <div className="py-1">
                      <Link 
                        to="/BookingHistory" 
                        className={`flex items-center px-4 py-2 ${
                          isScrolled 
                            ? "text-gray-700 hover:bg-amber-50 hover:text-amber-700" 
                            : "text-white hover:bg-white/10"
                        }`}
                        onClick={() => setDropdownOpen(false)}
                      >
                        <FaHistory className="mr-2" />
                        Tiệc của bạn
                      </Link>
                      <button 
                        onClick={handleLogout} 
                        className={`flex items-center w-full text-left px-4 py-2 ${
                          isScrolled 
                            ? "text-red-600 hover:bg-red-50" 
                            : "text-red-300 hover:bg-white/10 hover:text-red-200"
                        }`}
                      >
                        <FaSignOutAlt className="mr-2" />
                        Đăng xuất
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link 
                to="/login" 
                className={`ml-2 px-4 py-2 rounded-full flex items-center transition-all duration-300 ${
                  isScrolled
                    ? "bg-amber-600 text-white hover:bg-amber-700"
                    : "bg-white text-amber-700 hover:bg-gray-100"
                }`}
              >
                <FaUser className="mr-2" />
                <span>Đăng nhập</span>
              </Link>
            )}
          </div>
          
          {/* Mobile menu button */}
          <button 
            className="lg:hidden text-2xl focus:outline-none"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white shadow-xl absolute w-full left-0 top-full z-50 overflow-hidden transition-all duration-300 max-h-screen">
            <div className="container mx-auto px-4 py-3">
              <div className="flex flex-col space-y-1">
                <MobileNavLink to="/" isActive={isActive("/")} onClick={toggleMobileMenu}>
                  Trang chủ
                </MobileNavLink>
                
                <MobileNavLink to="/about" isActive={isActive("/about")} onClick={toggleMobileMenu}>
                  Giới thiệu
                </MobileNavLink>
                
                <MobileNavLink to="/menu" isActive={isActive("/menu")} onClick={toggleMobileMenu}>
                  Thực đơn
                </MobileNavLink>
                
                <MobileNavLink to="/reservation" isActive={isActive("/reservation")} onClick={toggleMobileMenu}>
                  Đặt lịch
                </MobileNavLink>
                
                <MobileNavLink to="/BookingHistory" isActive={isActive("/BookingHistory")} onClick={toggleMobileMenu}>
                  Tiệc Của Bạn
                </MobileNavLink>
                
                <MobileNavLink to="/CustomerReview" isActive={isActive("/CustomerReview")} onClick={toggleMobileMenu}>
                  Đánh giá
                </MobileNavLink>
                
                <MobileNavLink to="/contact" isActive={isActive("/contact")} onClick={toggleMobileMenu}>
                  Liên hệ
                </MobileNavLink>
                
                {isUserLoggedIn() ? (
                  <>
                    <div className="flex items-center py-3 px-4 text-amber-700 bg-amber-50 rounded-lg mt-2">
                      <div className="w-8 h-8 rounded-full bg-amber-600 text-white flex items-center justify-center mr-3">
                        <span className="text-sm font-bold">{userData.username ? userData.username[0].toUpperCase() : 'U'}</span>
                      </div>
                      <span className="font-medium">{userData.username || 'Người dùng'}</span>
                    </div>
                    <button 
                      onClick={handleLogout}
                      className="flex items-center py-3 px-4 rounded-lg bg-red-100 text-red-600 mt-2"
                    >
                      <FaSignOutAlt className="mr-2" />
                      <span>Đăng xuất</span>
                    </button>
                  </>
                ) : (
                  <Link 
                    to="/login" 
                    className="flex items-center py-3 px-4 rounded-lg bg-amber-600 text-white mt-2"
                    onClick={toggleMobileMenu}
                  >
                    <FaUser className="mr-2" />
                    <span>Đăng nhập</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}

// NavLink component for desktop
function NavLink({ children, to, isActive, isScrolled }) {
  return (
    <Link
      to={to}
      className={`relative px-3 py-2 font-medium text-sm rounded-lg transition-all duration-300 ${
        isActive
          ? isScrolled
            ? "text-amber-600 bg-amber-50"
            : "text-white bg-amber-800/30"
          : isScrolled
            ? "text-gray-800 hover:bg-gray-100"
            : "text-white/90 hover:text-white hover:bg-white/10"
      }`}
    >
      {children}
      {isActive && (
        <span className={`absolute bottom-0 left-0 w-full h-0.5 ${
          isScrolled ? "bg-amber-500" : "bg-white"
        }`}>
        </span>
      )}
    </Link>
  );
}

// NavLink component for mobile
function MobileNavLink({ children, to, isActive, onClick }) {
  return (
    <Link
      to={to}
      className={`py-3 px-4 ${
        isActive
          ? "text-amber-600 bg-amber-50 font-medium rounded-lg"
          : "text-gray-700 hover:bg-gray-50 hover:text-amber-600"
      }`}
      onClick={onClick}
    >
      {children}
    </Link>
  );
}

export default Header;