-- --------------------------------------------------------
--
-- Cấu trúc bảng cho bảng `user`
--

CREATE TABLE `user` (
  `id` varchar(17) NOT NULL,
  `username` varchar(45) NOT NULL,
  `password` varchar(64) NOT NULL,
  `email` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ;

--
-- Đang đổ dữ liệu cho bảng `user`
--

INSERT INTO `user` (`id`, `username`, `password`, `email`) VALUES
('Wp46dCAo32SNZytl', 'Quocdat@123', '6ca13d52ca70c883e0f0bb101e425a89e8624de51db2d2392593af6a84118090', 'abc1234@gmail.com'),
('3mcK8AG02ofkRXOq', 'Quocdat@1324', 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', 'abcc1234@gmail.com');

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL COMMENT 'Tên danh mục'
);

--
-- Đang đổ dữ liệu cho bảng `categories`
--

INSERT INTO `categories` (`id`, `name`) VALUES
(1, 'Món khai vị'),
(2, 'Món chính'),
(3, 'Tráng miệng'),
(4, 'Nước uống');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `menu_items`
--

CREATE TABLE `menu_items` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL COMMENT 'Tên món ăn',
  `price` decimal(10,2) NOT NULL COMMENT 'Giá món ăn',
  `description` text DEFAULT NULL COMMENT 'Mô tả món ăn',
  `image` varchar(255) DEFAULT NULL COMMENT 'Đường dẫn hình ảnh của món ăn',
  `detail` text DEFAULT NULL COMMENT 'Thông tin chi tiết của món ăn',
  `category_id` int(11) DEFAULT NULL COMMENT 'ID danh mục món ăn'
);

--
-- Đang đổ dữ liệu cho bảng `menu_items`
--

INSERT INTO `menu_items` (`id`, `name`, `price`, `description`, `image`, `detail`, `category_id`) VALUES
(101, 'Gỏi cuốn', 50000.00, 'Gỏi cuốn với tôm và rau củ', '/images/goi-cuon.jpg', 'Gỏi cuốn là món ăn truyền thống của Việt Nam, được làm từ bánh tráng cuốn với tôm tươi, thịt heo, rau sống và bún. Thường được chấm với nước mắm chua ngọt.', 2),
(102, 'Chả giò', 60000.00, 'Chả giò chiên với thịt heo huahuahfuhfhshs', '/images/cha-gio.jpg', '', 2),
(103, 'Súp cuafgggfgf', 70000.00, 'Súp cua với trứng sang', '', '', 3),
(108, 'Phở', 50000.00, 'Gỏi cuốn với tôm và rau củ', '/images/pho.jpg', 'Gỏi cuốn là món ăn truyền thống của Việt Nam, được làm từ bánh tráng cuốn với tôm tươi, thịt heo, rau sống và bún. Thường được chấm với nước mắm chua ngọt.', 1);


CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `total_price` decimal(10,2) NOT NULL,
  `num_people` int(11) NOT NULL,
  `special_request` text DEFAULT NULL,
  `customer_name` varchar(255) NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 0,
  `order_date` date NOT NULL,
  `order_time` time NOT NULL
) ;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `user_id`, `total_price`, `num_people`, `special_request`, `customer_name`, `status`, `order_date`, `order_time`) VALUES
(1, 7, 45.50, 2, 'Extra spicy', 'John Doe', 0, '2025-03-26', '12:30:00'),
(2, 7, 89.99, 4, 'No onions', 'Jane Smith', 1, '2025-03-25', '18:45:00'),
(3, 7, 45.50, 2, 'Extra spicy', 'John Doe', 0, '2025-03-27', '05:31:26');

-- --------------------------------------------------------
CREATE TABLE `user` (
  `id` VARCHAR(17) NOT NULL,
  `username` VARCHAR(45) NOT NULL,
  `password` VARCHAR(64) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`)
);

INSERT INTO `user` (`id`, `username`, `password`, `email`) VALUES
('Wp46dCAo32SNZytl', 'Quocdat@123', '6ca13d52ca70c883e0f0bb101e425a89e8624de51db2d2392593af6a84118090', 'abc1234@gmail.com'),
('3mcK8AG02ofkRXOq', 'Quocdat@1324', 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', 'abcc1234@gmail.com');

-- --------------------------------------------------------
-- Cấu trúc bảng `categories`
-- --------------------------------------------------------
CREATE TABLE `categories` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL COMMENT 'Tên danh mục',
  PRIMARY KEY (`id`)
);

INSERT INTO `categories` (`id`, `name`) VALUES
(1, 'Món khai vị'),
(2, 'Món chính'),
(3, 'Tráng miệng'),
(4, 'Nước uống');

-- --------------------------------------------------------
-- Cấu trúc bảng `menu_items`
-- --------------------------------------------------------
CREATE TABLE `menu_items` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL COMMENT 'Tên món ăn',
  `price` DECIMAL(10,2) NOT NULL COMMENT 'Giá món ăn',
  `description` TEXT DEFAULT NULL COMMENT 'Mô tả món ăn',
  `image` VARCHAR(255) DEFAULT NULL COMMENT 'Đường dẫn hình ảnh của món ăn',
  `detail` TEXT DEFAULT NULL COMMENT 'Thông tin chi tiết của món ăn',
  `category_id` INT(11) DEFAULT NULL COMMENT 'ID danh mục món ăn',
  PRIMARY KEY (`id`),
  FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE SET NULL
);

INSERT INTO `menu_items` (`id`, `name`, `price`, `description`, `image`, `detail`, `category_id`) VALUES
(101, 'Gỏi cuốn', 50000.00, 'Gỏi cuốn với tôm và rau củ', '/images/goi-cuon.jpg', 'Gỏi cuốn là món ăn truyền thống của Việt Nam.', 2),
(102, 'Chả giò', 60000.00, 'Chả giò chiên giòn', '/images/cha-gio.jpg', '', 2),
(103, 'Súp cua', 70000.00, 'Súp cua thơm ngon', '', '', 3),
(108, 'Phở', 50000.00, 'Phở bò đặc biệt', '/images/pho.jpg', 'Phở là món ăn đặc trưng của Việt Nam.', 1);

-- --------------------------------------------------------
-- Cấu trúc bảng `orders`
-- --------------------------------------------------------
CREATE TABLE `orders` (
  `id` VARCHAR(6)  NOT NULL,
  `user_id` VARCHAR(17) NOT NULL,
  `total_price` DECIMAL(10,2) NOT NULL,
  `num_people` INT(11) NOT NULL,
  `special_request` TEXT DEFAULT NULL,
  `customer_name` VARCHAR(255) NOT NULL,
  `status` TINYINT(1) NOT NULL DEFAULT 0,
  `order_date` DATE NOT NULL,
  `order_time` TIME NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE
);

INSERT INTO `orders` (`id`, `user_id`, `total_price`, `num_people`, `special_request`, `customer_name`, `status`, `order_date`, `order_time`) VALUES
('123456', 'Wp46dCAo32SNZytl', 45.50, 2, 'Extra spicy', 'John Doe', 0, '2025-03-26', '12:30:00'),
('789012', 'Wp46dCAo32SNZytl', 89.99, 4, 'No onions', 'Jane Smith', 1, '2025-03-25', '18:45:00'),
('345678', 'Wp46dCAo32SNZytl', 45.50, 2, 'Extra spicy', 'John Doe', 0, '2025-03-27', '05:31:26');

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
-- --------------------------------------------------------
-- Cấu trúc bảng `order_items`
-- --------------------------------------------------------
CREATE TABLE `order_items` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `order_id` VARCHAR(6) NOT NULL,
  `menu_item_id` INT(11) NOT NULL,
  `status` VARCHAR(50) NOT NULL DEFAULT 'pending',
  PRIMARY KEY (`id`),
  FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`menu_item_id`) REFERENCES `menu_items`(`id`) ON DELETE CASCADE
);


INSERT INTO `order_items` (`id`, `order_id`, `menu_item_id`, `status`) VALUES
(5, 3, 101, 'pending'),
(6, 2, 101, 'pending'),
(7, 2, 102, 'confirmed');
