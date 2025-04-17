
import { motion } from "framer-motion";

function TestimonialsSection() {
  const reviews = [
    {
      name: "Nguyễn Văn A",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      rating: 5,
      comment: "Không gian sang trọng, món ăn ngon và phục vụ chuyên nghiệp. Tôi rất hài lòng khi tổ chức tiệc cưới tại đây.",
      position: "Khách hàng tiệc cưới"
    },
    {
      name: "Trần Thị B",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      rating: 5,
      comment: "Đồ ăn ngon tuyệt vời, đặc biệt là các món fusion. Nhân viên phục vụ nhiệt tình và chu đáo.",
      position: "Khách hàng thường xuyên"
    },
    {
      name: "Lê Văn C",
      avatar: "https://randomuser.me/api/portraits/men/67.jpg",
      rating: 5,
      comment: "Tổ chức sinh nhật công ty tại đây là một lựa chọn tuyệt vời. Không gian rộng rãi, menu đa dạng và dịch vụ chuyên nghiệp.",
      position: "Giám đốc công ty XYZ"
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="mb-20 bg-gray-100 py-16 px-8 rounded-xl"
    >
      <h2 className="text-3xl font-bold text-center mb-12">Khách hàng nói gì về chúng tôi</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {reviews.map((review, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2, duration: 0.5 }}
            viewport={{ once: true }}
            className="bg-white p-6 rounded-lg shadow-lg"
          >
            <div className="flex items-center mb-4">
              <img src={review.avatar} alt={review.name} className="w-14 h-14 rounded-full mr-4" />
              <div>
                <h4 className="font-semibold text-lg">{review.name}</h4>
                <p className="text-gray-600 text-sm">{review.position}</p>
              </div>
            </div>
            <div className="flex text-yellow-400 mb-3">
              {[...Array(review.rating)].map((_, i) => (
                <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="text-gray-700 italic">"{review.comment}"</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

export default TestimonialsSection;

