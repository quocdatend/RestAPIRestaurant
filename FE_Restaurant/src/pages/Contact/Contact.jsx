// src/pages/Contact/Contact.jsx
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock } from 'react-icons/fa';
import HeroSection from '../../components/User/Contact/HeroSection';
import ContactInfoCard from '../../components/User/Contact/ContactInfoCard';
import ContactForm from '../../components/User/Contact/ContactForm';
import MapSection from '../../components/User/Contact/MapSection';

function Contact() {
  const contactInfo = [
    {
      icon: FaMapMarkerAlt,
      title: 'Địa chỉ',
      content: '475 Điện Biên Phủ, Bình Thạnh, Hồ Chí Minh',
      link: 'https://maps.app.goo.gl/your-updated-link',
    },
    {
      icon: FaPhone,
      title: 'Điện thoại',
      content: '0909 123 456',
      link: 'tel:0909123456',
    },
    {
      icon: FaEnvelope,
      title: 'Email',
      content: 'contact@nhahangxyz.com',
      link: 'mailto:contact@nhahangxyz.com',
    },
    {
      icon: FaClock,
      title: 'Giờ mở cửa',
      content: 'T2-CN: 10:00 - 22:00',
    },
  ];

  const mapSrc =
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.326614422678!2d106.71166331474902!3d10.803917392319746!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317528d5f5e1e5b7%3A0x5e5e5e5e5e5e5e5e!2s475%20%C4%90i%E1%BB%87n%20Bi%C3%AAn%20Ph%E1%BB%A7%2C%20B%C3%ACnh%20Th%E1%BA%A1nh%2C%20H%E1%BB%93%20Ch%C3%AD%20Minh%2C%20Vi%E1%BB%87t%20Nam!5e0!3m2!1svi!2s!4v1698765432109';
  const mapLink = 'https://maps.app.goo.gl/your-updated-link';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <HeroSection
        title="Liên hệ với chúng tôi"
        subtitle="Chúng tôi luôn sẵn sàng hỗ trợ bạn!"
        backgroundImage="/src/assets/contact-bg.jpg"
      />

      <div className="container mx-auto p-6 -mt-20">
        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {contactInfo.map((info, index) => (
            <ContactInfoCard
              key={index}
              icon={info.icon}
              title={info.title}
              content={info.content}
              link={info.link}
            />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <ContactForm />

          {/* Map */}
          <MapSection mapSrc={mapSrc} mapLink={mapLink} />
        </div>
      </div>

      {/* ToastContainer */}
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        toastClassName="rounded-lg shadow-lg bg-white text-gray-800"
        progressClassName="bg-yellow-500"
      />
    </div>
  );
}

export default Contact;