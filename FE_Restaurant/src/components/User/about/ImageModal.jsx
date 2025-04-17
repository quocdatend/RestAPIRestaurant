import React from 'react';
import { motion } from "framer-motion";

const ImageModal = ({ image, onClose }) => {
  if (!image) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.5 }}
        animate={{ scale: 1 }}
        className="relative max-w-4xl w-full"
      >
        <img
          src={image.url}
          alt={image.title}
          className="w-full rounded-lg"
        />
        <button
          className="absolute top-4 right-4 text-white text-2xl hover:text-gray-300"
          onClick={onClose}
        >
          ×
        </button>
        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white p-4 rounded-b-lg">
          <h3 className="text-xl font-semibold">{image.title}</h3>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ImageModal;