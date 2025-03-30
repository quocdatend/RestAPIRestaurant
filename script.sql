--
-- Cấu trúc bảng cho bảng `menu_items`
--

DROP TABLE IF EXISTS `menu_items`;
CREATE TABLE IF NOT EXISTS `menu_items` (
  `id` int NOT NULL,
  `name` varchar(255) NOT NULL COMMENT 'Tên món ăn',
  `price` decimal(10,2) NOT NULL COMMENT 'Giá món ăn',
  `description` text COMMENT 'Mô tả món ăn',
  `image` varchar(255) DEFAULT NULL COMMENT 'Đường dẫn hình ảnh của món ăn',
  `detail` text COMMENT 'Thông tin chi tiết của món ăn'
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `menu_items`
--

INSERT INTO `menu_items` (`id`, `name`, `price`, `description`, `image`, `detail`) VALUES
(101, 'Gỏi cuốn', 50000.00, 'Gỏi cuốn với tôm và rau củ', '/images/goi-cuon.jpg', 'Gỏi cuốn là món ăn truyền thống của Việt Nam, được làm từ bánh tráng cuốn với tôm tươi, thịt heo, rau sống và bún. Thường được chấm với nước mắm chua ngọt.'),
(102, 'Chả giò', 60000.00, 'Chả giò chiên với thịt heo', NULL, NULL),
(103, 'Súp cuafgggfgf', 70000.00, 'Súp cua với trứng sang', '', ''),
(105, 'Súp cuafgggfgf', 70000.00, 'Súp cua với trứng sang', '', '');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `orders`
--

DROP TABLE IF EXISTS `orders`;
CREATE TABLE IF NOT EXISTS `orders` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `total_price` decimal(10,2) NOT NULL,
  `num_people` int NOT NULL,
  `special_request` text,
  `customer_name` varchar(255) NOT NULL,
  `order_date` date NOT NULL,
  `order_time` time NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `orders`
--

INSERT INTO `orders` (`id`, `user_id`, `total_price`, `num_people`, `special_request`, `customer_name`, `order_date`, `order_time`) VALUES
(1, 7, 45.50, 2, 'Extra spicy', 'John Doe', '2025-03-26', '12:30:00'),
(2, 7, 89.99, 4, 'No onions', 'Jane Smith', '2025-03-25', '18:45:00'),
(3, 7, 45.50, 2, 'Extra spicy', 'John Doe', '2025-03-27', '05:31:26'),
(1, 7, 45.50, 2, 'Extra spicy', 'John Doe', '2025-03-26', '12:30:00'),
(2, 7, 89.99, 4, 'No onions', 'Jane Smith', '2025-03-25', '18:45:00'),
(3, 7, 45.50, 2, 'Extra spicy', 'John Doe', '2025-03-27', '05:31:26');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `order_items`
--

DROP TABLE IF EXISTS `order_items`;
CREATE TABLE IF NOT EXISTS `order_items` (
  `id` int NOT NULL,
  `order_id` int NOT NULL,
  `menu_item_id` int NOT NULL,
  `status` varchar(50) NOT NULL DEFAULT 'pending'
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `user`
--

DROP TABLE IF EXISTS `user`;
CREATE TABLE IF NOT EXISTS `user` (
  `id` varchar(17) NOT NULL,
  `username` varchar(45) NOT NULL,
  `password` varchar(64) NOT NULL,
  `email` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `user`
--

INSERT INTO `user` (`id`, `username`, `password`, `email`) VALUES
('Wp46dCAo32SNZytl', 'Quocdat@123', '6ca13d52ca70c883e0f0bb101e425a89e8624de51db2d2392593af6a84118090', 'abc1234@gmail.com'),
('3mcK8AG02ofkRXOq', 'Quocdat@1324', 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', 'abcc1234@gmail.com');
COMMIT;



--Table reviews
CREATE TABLE reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customerName VARCHAR(255) NOT NULL,
    rating INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    date DATETIME NOT NULL
);
INSERT INTO reviews (customerName, rating, title, content, date)
VALUES 
 ('Trần Thị B', 4, 'Dịch vụ tốt', 'Mặc dù có một số sự cố nhỏ trong quá trình tổ chức sự kiện, nhưng tổng thể dịch vụ khá tốt và chúng tôi hài lòng.', '2023-12-02 10:00:00'),
    ('Lê Quang C', 3, 'Cần cải thiện', 'Dịch vụ chưa thực sự như mong đợi. Nhân viên có phần thiếu chuyên nghiệp và có một số thiếu sót trong buổi tiệc.', '2023-12-03 14:30:00'),
    ('Nguyễn Hoàng D', 5, 'Hoàn hảo', 'Tôi rất ấn tượng với chất lượng dịch vụ tại nhà hàng. Mọi thứ đều rất tuyệt vời từ phục vụ đến món ăn.', '2023-12-04 09:45:00');