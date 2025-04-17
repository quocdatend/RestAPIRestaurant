// src/pages/Contact/MapSection.jsx
import { FaExternalLinkAlt } from 'react-icons/fa';

function MapSection({ mapSrc, mapLink }) {
  return (
    <div className="bg-white p-8 rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Vị trí của chúng tôi</h2>
      <div className="relative rounded-lg overflow-hidden shadow-lg group">
        <iframe
          src={mapSrc}
          width="100%"
          height="400"
          className="border-0 transition-transform duration-300 group-hover:scale-105"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Restaurant Location"
        ></iframe>
        <a
          href={mapLink}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-4 right-4 bg-yellow-500 text-white px-4 py-2 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-2"
        >
          Xem bản đồ lớn hơn <FaExternalLinkAlt />
        </a>
      </div>
    </div>
  );
}

export default MapSection;