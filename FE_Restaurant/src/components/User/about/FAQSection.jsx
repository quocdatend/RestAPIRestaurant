import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronDown } from 'react-icons/fa';

const FAQSection = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      question: "Nhà hàng có nhận đặt tiệc không?",
      answer: "Có, chúng tôi nhận đặt tiệc cho mọi dịp đặc biệt như sinh nhật, kỷ niệm, họp mặt công ty. Vui lòng liên hệ trước ít nhất 3 ngày để chúng tôi chuẩn bị chu đáo nhất."
    },
    {
      question: "Nhà hàng có chỗ đậu xe không?",
      answer: "Có, chúng tôi có bãi đậu xe riêng miễn phí cho khách hàng. Ngoài ra còn có dịch vụ giữ xe với mức phí hợp lý."
    },
    {
      question: "Có cần đặt bàn trước không?",
      answer: "Chúng tôi khuyến khích quý khách đặt bàn trước để đảm bảo có chỗ ngồi, đặc biệt vào cuối tuần và các dịp lễ. Bạn có thể đặt bàn qua điện thoại hoặc trên website của chúng tôi."
    },
    {
      question: "Nhà hàng có phục vụ thực đơn chay không?",
      answer: "Có, chúng tôi có thực đơn chay đa dạng. Vui lòng thông báo trước khi đặt bàn để chúng tôi chuẩn bị tốt nhất."
    },
    {
      question: "Nhà hàng có giao hàng tận nơi không?",
      answer: "Có, chúng tôi có dịch vụ giao hàng trong phạm vi 10km. Đơn hàng trên 500.000đ sẽ được miễn phí giao hàng."
    }
  ];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="mb-16">
      <h2 className="text-3xl font-bold text-center mb-12">Câu hỏi thường gặp</h2>
      <div className="max-w-3xl mx-auto">
        {faqs.map((faq, index) => (
          <div 
            key={index} 
            className="mb-4 border border-gray-200 rounded-lg overflow-hidden"
          >
            <button
              className="w-full text-left p-4 bg-white flex justify-between items-center hover:bg-gray-50 transition-colors"
              onClick={() => toggleFAQ(index)}
            >
              <span className="font-medium text-lg">{faq.question}</span>
              <motion.div
                animate={{ rotate: activeIndex === index ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <FaChevronDown className="text-gray-500" />
              </motion.div>
            </button>
            
            <AnimatePresence>
              {activeIndex === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 bg-gray-50 border-t border-gray-200">
                    <p className="text-gray-700">{faq.answer}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQSection;