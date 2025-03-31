-- --------------------------------------------------------
-- Cấu trúc bảng `user`
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
  `id` INT(11) NOT NULL AUTO_INCREMENT,
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
(1, 'Wp46dCAo32SNZytl', 45.50, 2, 'Extra spicy', 'John Doe', 0, '2025-03-26', '12:30:00'),
(2, 'Wp46dCAo32SNZytl', 89.99, 4, 'No onions', 'Jane Smith', 1, '2025-03-25', '18:45:00'),
(3, 'Wp46dCAo32SNZytl', 45.50, 2, 'Extra spicy', 'John Doe', 0, '2025-03-27', '05:31:26');

-- --------------------------------------------------------
-- Cấu trúc bảng `order_items`
-- --------------------------------------------------------
CREATE TABLE `order_items` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `order_id` INT(11) NOT NULL,
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
