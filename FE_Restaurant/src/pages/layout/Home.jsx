import { Link } from "react-router-dom";
import video from "../../assets/restaurant-video.mp4"; 

function Home() {
  return (
    <div className="w-full min-h-[600px]">
      <div className="relative">
        {/* Video background */}
        <video autoPlay loop muted className="w-full h-[600px] object-cover">
          <source src={video} type="video/mp4" />
        </video>
        
        {/* Overlay với gradient nhẹ */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/30"></div>
        
        {/* Content chính */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center space-y-6 w-full max-w-3xl px-6 py-12 bg-white/70 backdrop-blur-sm rounded-xl shadow-lg">
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-amber-600">
              HaDiDi Restaurant
            </h1>
            
            <div className="h-1 w-32 bg-amber-500 mx-auto"></div>
            
            <p className="text-xl md:text-2xl text-red-800 font-medium">
              Hội Nghị - Tiệc Cưới - Sự Kiện
            </p>
            
            <p className="text-lg md:text-xl text-gray-700 font-bold max-w-2xl mx-auto">
              Nơi Tôn Vinh Sự Kiện Trọng Đại Của Bạn
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 mt-6 pt-2">
              <Link
                to="/reservation"
                className="bg-amber-500 hover:bg-amber-600 text-white py-3 px-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 font-medium"
              >
                Đặt lịch
              </Link>
              
              <Link
                to="/menu"
                className="bg-white hover:bg-gray-100 text-amber-600 border border-amber-500 py-3 px-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 font-medium"
              >
                Thực đơn
              </Link>
              
              <Link
                to="/contact"
                className="bg-amber-600 hover:bg-amber-700 text-white py-3 px-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 font-medium"
              >
                Liên hệ
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;