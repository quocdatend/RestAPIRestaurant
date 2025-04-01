--
-- Cơ sở dữ liệu: `restaurant`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `admin`
--

CREATE TABLE `admin` (
  `id` varchar(17) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(64) NOT NULL,
  `role` varchar(10) NOT NULL DEFAULT 'ADMIN',
  PRIMARY KEY (`id`)
);

--
-- Đang đổ dữ liệu cho bảng `admin`
--

INSERT INTO `admin` (`id`, `email`, `password`, `role`) VALUES
('aB3dE5fG6hI7jK8', 'adminabc123@gmail.com', 'e86f78a8a3caf0b60d8e74e5942aa6d86dc150cd3c03338aef25b7d2d7e3acc7', 'ADMIN');


-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `categories`
--


CREATE TABLE `categories` (
  `id` int NOT NULL,
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
  `id` int NOT NULL,
  `name` varchar(255) NOT NULL COMMENT 'Tên món ăn',
  `price` decimal(10,2) NOT NULL COMMENT 'Giá món ăn',
  `description` text COMMENT 'Mô tả món ăn',
  `image` varchar(255) DEFAULT NULL COMMENT 'Đường dẫn hình ảnh của món ăn',
  `detail` text COMMENT 'Thông tin chi tiết của món ăn',
  `category_id` int DEFAULT NULL COMMENT 'ID danh mục món ăn'
);

--
-- Đang đổ dữ liệu cho bảng `menu_items`
--

INSERT INTO `menu_items` (`id`, `name`, `price`, `description`, `image`, `detail`, `category_id`) VALUES
(101, 'Gỏi cuốn', 50000.00, 'Gỏi cuốn với tôm và rau củ', '/images/goi-cuon.jpg', 'Gỏi cuốn là món ăn truyền thống của Việt Nam, được làm từ bánh tráng cuốn với tôm tươi, thịt heo, rau sống và bún. Thường được chấm với nước mắm chua ngọt.', 2),
(102, 'Chả giò', 60000.00, 'Chả giò chiên với thịt heo huahuahfuhfhshs', '/images/cha-gio.jpg', '', 2),
(103, 'Súp cuafgggfgf', 70000.00, 'Súp cua với trứng sang', '', '', 3),
(108, 'Phở', 50000.00, 'Gỏi cuốn với tôm và rau củ', '/images/pho.jpg', 'Gỏi cuốn là món ăn truyền thống của Việt Nam, được làm từ bánh tráng cuốn với tôm tươi, thịt heo, rau sống và bún. Thường được chấm với nước mắm chua ngọt.', 1);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `orders`
--


CREATE TABLE `orders` (
  `id` int NOT NULL,
  `user_id` varchar(17) COLLATE utf8mb4_general_ci NOT NULL,
  `total_price` decimal(10,2) NOT NULL,
  `num_people` int NOT NULL,
  `special_request` text COLLATE utf8mb4_general_ci,
  `customer_name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '0',
  `order_date` date NOT NULL,
  `order_time` time NOT NULL
);

--
-- Đang đổ dữ liệu cho bảng `orders`
--

INSERT INTO `orders` (`id`, `user_id`, `total_price`, `num_people`, `special_request`, `customer_name`, `status`, `order_date`, `order_time`) VALUES
(1, 'Wp46dCAo32SNZytl', 45.50, 2, 'Extra spicy', 'John Doe', 0, '2025-03-26', '12:30:00'),
(2, 'Wp46dCAo32SNZytl', 89.99, 4, 'No onions', 'Jane Smith', 1, '2025-03-25', '18:45:00'),
(3, 'Wp46dCAo32SNZytl', 45.50, 2, 'Extra spicy', 'John Doe', 0, '2025-03-27', '05:31:26');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `order_items`
--


CREATE TABLE `order_items` (
  `id` int NOT NULL,
  `order_id` int NOT NULL,
  `menu_item_id` int NOT NULL,
  `status` varchar(50) NOT NULL DEFAULT 'pending'
);

--
-- Đang đổ dữ liệu cho bảng `order_items`
--

INSERT INTO `order_items` (`id`, `order_id`, `menu_item_id`, `status`) VALUES
(5, 3, 101, 'pending'),
(6, 2, 101, 'pending'),
(7, 2, 102, 'confirmed');

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
);

--
-- Đang đổ dữ liệu cho bảng `user`
--

INSERT INTO `user` (`id`, `username`, `password`, `email`) VALUES
('Wp46dCAo32SNZytl', 'Quocdat@123', '6ca13d52ca70c883e0f0bb101e425a89e8624de51db2d2392593af6a84118090', 'abc1234@gmail.com'),
('3mcK8AG02ofkRXOq', 'Quocdat@1324', 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', 'abcc1234@gmail.com'),
('Z8XavUlcgwmbJWG6', 'Quocdat123@', '6ca13d52ca70c883e0f0bb101e425a89e8624de51db2d2392593af6a84118090', 'hngdat2003@gmail.com'),
('CJWyqPFOfiUbdMBR', 'testpass', 'e86f78a8a3caf0b60d8e74e5942aa6d86dc150cd3c03338aef25b7d2d7e3acc7', 'hnqdat2003@gmail.com');


