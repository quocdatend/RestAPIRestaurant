import { motion } from "framer-motion";
import { FaAward, FaUsers, FaUtensils, FaClock } from "react-icons/fa";

function FeaturesSection() {
  const features = [
    {
      icon: <FaAward className="text-4xl text-yellow-500" />,
      title: "Chất lượng",
      description: "Đảm bảo chất lượng món ăn và dịch vụ tốt nhất",
    },
    {
      icon: <FaUsers className="text-4xl text-blue-500" />,
      title: "Phục vụ",
      description: "Đội ngũ nhân viên chuyên nghiệp, tận tâm",
    },
    {
      icon: <FaUtensils className="text-4xl text-red-500" />,
      title: "Ẩm thực",
      description: "Đa dạng món ăn từ Á đến Âu",
    },
    {
      icon: <FaClock className="text-4xl text-green-500" />,
      title: "Thời gian",
      description: "Phục vụ 24/7, đặt tiệc linh hoạt",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
      {features.map((feature, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.2 }}
          className="bg-white p-6 rounded-lg shadow-lg text-center"
        >
          <div className="mb-4">{feature.icon}</div>
          <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
          <p className="text-gray-600">{feature.description}</p>
        </motion.div>
      ))}
    </div>
  );
}

export default FeaturesSection;