import React from 'react';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaFacebook, FaInstagram, FaTwitter, FaHeart } from 'react-icons/fa';
import facebookIcon from "../../assets/facebook.png";
import instagramIcon from "../../assets/instagram.png";
import logo from "../../assets/logo.png";

function Footer() {
  return (
    <footer className="relative overflow-hidden bg-gradient-to-r from-amber-50 to-yellow-50 text-gray-700 pt-16 pb-8">
      {/* Đường cong trang trí phía trên */}
      <div className="absolute top-0 left-0 right-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 48" className="w-full h-12 fill-current text-white">
          <path d="M0,0 C480,48 960,48 1440,0 L1440,0 L0,0 Z"></path>
        </svg>
      </div>

      {/* Hoa văn trang trí */}
      <div className="absolute top-0 right-0 opacity-5 pointer-events-none">
        <svg width="400" height="400" viewBox="0 0 100 100" className="text-yellow-500 fill-current">
          <circle cx="25" cy="25" r="20" />
          <circle cx="75" cy="75" r="20" />
          <circle cx="75" cy="25" r="10" />
          <circle cx="25" cy="75" r="10" />
        </svg>
      </div>

      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start gap-12">
          {/* Logo và Thông tin */}
          <div className="text-center md:text-left md:w-1/3">
            <div className="mb-6 transform transition-transform duration-500 hover:scale-105">
              <img src={logo} alt="HaDiDi Logo" className="h-16 mx-auto md:mx-0 drop-shadow-md" />
            </div>
            <p className="text-gray-600 font-light mb-4 leading-relaxed">
              Nhà hàng chúng tôi mang đến trải nghiệm ẩm thực độc đáo và phong cách phục vụ chuyên nghiệp.
            </p>
            <div className="inline-block bg-gradient-to-r from-yellow-400/80 to-amber-400/80 px-4 py-2 rounded-lg shadow-sm">
              <p className="text-white font-medium italic">
                "Hương vị tinh tế - Không gian sang trọng"
              </p>
            </div>
          </div>

          {/* Thông tin liên hệ */}
          <div className="text-center md:text-left md:w-1/3">
            <h2 className="text-xl font-bold mb-5 text-yellow-600 relative inline-block after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-12 after:h-1 after:bg-yellow-300 after:rounded-full">
              Liên hệ với chúng tôi
            </h2>
            <div className="space-y-4">
              <p className="flex items-center justify-center md:justify-start group">
                <span className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-500 mr-3 shadow-sm group-hover:bg-yellow-500 group-hover:text-white transition-colors duration-300">
                  <FaMapMarkerAlt />
                </span>
                <span className="text-gray-600 group-hover:text-gray-800 transition-colors duration-300">
                  475 Đường Điện Biên Phủ, Quận Bình Thạnh, TP.HCM
                </span>
              </p>
              
              <a href="tel:+84938315769" className="flex items-center justify-center md:justify-start group">
                <span className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-500 mr-3 shadow-sm group-hover:bg-yellow-500 group-hover:text-white transition-colors duration-300">
                  <FaPhone />
                </span>
                <span className="text-gray-600 group-hover:text-gray-800 transition-colors duration-300">
                  HotLine: +84 938315769
                </span>
              </a>
              
              <a href="mailto:nhannguyen311003@gmail.com" className="flex items-center justify-center md:justify-start group">
                <span className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-500 mr-3 shadow-sm group-hover:bg-yellow-500 group-hover:text-white transition-colors duration-300">
                  <FaEnvelope />
                </span>
                <span className="text-gray-600 group-hover:text-gray-800 transition-colors duration-300">
                  Nhannguyen311003@gmail.com
                </span>
              </a>
            </div>
          </div>

          {/* Mạng xã hội & Đăng ký nhận tin */}
          <div className="text-center md:text-left md:w-1/3">
            <h2 className="text-xl font-bold mb-5 text-yellow-600 relative inline-block after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-12 after:h-1 after:bg-yellow-300 after:rounded-full">
              Kết nối với chúng tôi
            </h2>
            
            <div className="mb-6">
              <p className="text-gray-600 mb-3">Theo dõi chúng tôi trên mạng xã hội để không bỏ lỡ các ưu đãi mới nhất</p>
              <div className="flex items-center justify-center md:justify-start space-x-4">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" 
                  className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-blue-500 hover:text-white text-blue-600 transition-all duration-300 transform hover:-translate-y-1">
                  <FaFacebook className="text-xl" />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-gradient-to-br hover:from-pink-500 hover:via-red-500 hover:to-yellow-500 hover:text-white text-pink-600 transition-all duration-300 transform hover:-translate-y-1">
                  <FaInstagram className="text-xl" />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-blue-400 hover:text-white text-blue-400 transition-all duration-300 transform hover:-translate-y-1">
                  <FaTwitter className="text-xl" />
                </a>
              </div>
            </div>
            
            {/* Form đăng ký nhận tin */}
            <div className="mt-4">
              <p className="text-gray-600 mb-2 text-sm">Đăng ký để nhận thông tin ưu đãi</p>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Email của bạn"
                  className="px-3 py-2 bg-white border border-yellow-200 focus:border-yellow-300 focus:ring-2 focus:ring-yellow-200 outline-none rounded-l-md w-full text-sm shadow-sm"
                />
                <button className="bg-gradient-to-r from-yellow-400 to-amber-500 text-white px-4 rounded-r-md hover:from-yellow-500 hover:to-amber-600 transition-colors duration-300 shadow-sm">
                  Gửi
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bản quyền */}
        <div className="border-t border-yellow-200 mt-12 pt-6 text-center">
          <p className="text-sm text-gray-500 flex items-center justify-center">
            ©2025 HaDiDi Restaurant. All rights reserved. Made with 
            <FaHeart className="mx-1 text-red-400" /> 
            by Event Team
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;