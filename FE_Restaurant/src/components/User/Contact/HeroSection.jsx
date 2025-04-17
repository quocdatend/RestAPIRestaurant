// src/pages/Contact/HeroSection.jsx
import React from 'react';

function HeroSection({ title, subtitle, backgroundImage }) {
  return (
    <div 
      className="relative bg-gradient-to-r from-red-600 to-red-800 h-80 flex items-center justify-center"
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Overlay với hiệu ứng gradient */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      
      {/* Nội dung */}
      <div className="relative z-10 text-center px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">{title}</h1>
        <div className="w-24 h-1 bg-yellow-500 mx-auto mb-4"></div>
        <p className="text-white text-lg max-w-2xl mx-auto">{subtitle}</p>
      </div>
      
      {/* Hiệu ứng sóng ở dưới */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 100" className="w-full h-12 fill-current text-gray-50">
          <path d="M0,64L80,58.7C160,53,320,43,480,53.3C640,64,800,96,960,96C1120,96,1280,64,1360,48L1440,32L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path>
        </svg>
      </div>
    </div>
  );
}

export default HeroSection;