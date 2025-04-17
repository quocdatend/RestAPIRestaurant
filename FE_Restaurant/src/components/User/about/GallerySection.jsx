import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ImageModal from './ImageModal';

const GallerySection = () => {
  const [selectedImage, setSelectedImage] = useState(null);

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
        {
          url: "https://images.unsplash.com/photo-1559339352-11d035aa65de",
          title: "Khu vực bar",
        },
      ],
    },
    {
      category: "Món ăn đặc sắc",
      images: [
        {
          url: "https://images.unsplash.com/photo-1544025162-d76694265947",
          title: "Món khai vị",
        },
        {
          url: "https://images.unsplash.com/photo-1559847844-5315695dadae",
          title: "Món chính",
        },
        {
          url: "https://images.unsplash.com/photo-1551024601-bec78aea704b",
          title: "Tráng miệng",
        },
      ],
    },
  ];

  return (
    <div className="mb-16">
      <h2 className="text-3xl font-bold text-center mb-12">Thư viện ảnh</h2>
      {galleries.map((gallery, galleryIndex) => (
        <div key={galleryIndex} className="mb-12">
          <h3 className="text-2xl font-semibold mb-6">
            {gallery.category}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gallery.images.map((image, imageIndex) => (
              <motion.div
                key={imageIndex}
                whileHover={{ scale: 1.05 }}
                className="relative cursor-pointer overflow-hidden rounded-lg"
                onClick={() => setSelectedImage(image)}
              >
                <img
                  src={image.url}
                  alt={image.title}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <h4 className="text-white text-xl font-semibold">
                    {image.title}
                  </h4>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ))}

      {selectedImage && (
        <ImageModal 
          image={selectedImage} 
          onClose={() => setSelectedImage(null)} 
        />
      )}
    </div>
  );
};

export default GallerySection;