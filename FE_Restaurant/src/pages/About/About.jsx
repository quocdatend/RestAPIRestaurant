import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

// Import tất cả các components
import HeroSection from "../../components/User/about/HeroSection";
import FeaturesSection from "../../components/User/about/FeaturesSection";
import GallerySection from "../../components/User/about/GallerySection";
import FAQSection from "../../components/User/about/FAQSection";
import ContactSection from "../../components/User/about/ContactSection";

// Tạm thời bỏ các import này
// import GallerySection from "../../components/about/GallerySection";
// import AboutSection from "../../components/about/AboutSection";
// import TestimonialsSection from "../../components/about/TestimonialsSection";
// import FAQSection from "../../components/about/FAQSection";
// import ImageModal from "../../components/about/ImageModal";

function About() {
  const [selectedImage, setSelectedImage] = useState(null);
  const navigate = useNavigate();

  const galleries = [
    {
      category: "Nhà hàng",
      images: [
        {
          url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4",
          title: "Không gian sang trọng",
        },
        {
          url: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0",
          title: "Phòng VIP",
        },
      ],
    },
    // ... các gallery khác
  ];

  const handleReservationClick = () => {
    navigate("/reservation");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <HeroSection />

      <div className="container mx-auto px-4 py-16">
        <FeaturesSection />
        
        <GallerySection />
        
        {/* About Section - inline */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-center mb-12">Về HaDiDi Restaurant</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <img 
                src="https://images.unsplash.com/photo-1552566626-52f8b828add9" 
                alt="Đầu bếp HaDiDi" 
                className="rounded-lg shadow-xl w-full h-[400px] object-cover"
              />
            </div>
            <div className="space-y-6">
              <p className="text-lg text-gray-700 leading-relaxed">
                HaDiDi Restaurant được thành lập từ năm 2010, là điểm đến lý tưởng cho những ai yêu thích ẩm thực tinh tế và không gian sang trọng.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                Với đội ngũ đầu bếp giàu kinh nghiệm, chúng tôi tự hào mang đến những trải nghiệm ẩm thực độc đáo, kết hợp giữa hương vị truyền thống và sáng tạo hiện đại.
              </p>
            </div>
          </div>
        </motion.div>
        
        <FAQSection />
        
        <ContactSection />
      </div>

      {/* Modal - inline */}
      {selectedImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <motion.div
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            className="relative max-w-4xl w-full"
          >
            <img
              src={selectedImage.url}
              alt={selectedImage.title}
              className="w-full rounded-lg"
            />
            <button
              className="absolute top-4 right-4 text-white text-2xl hover:text-gray-300"
              onClick={() => setSelectedImage(null)}
            >
              ×
            </button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

export default About;