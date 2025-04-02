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
-- Table structure for table `orders`
--

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `user_id`, `total_price`, `num_people`, `special_request`, `customer_name`, `status`, `order_date`, `order_time`) VALUES
(1, 7, 45.50, 2, 'Extra spicy', 'John Doe', 0, '2025-03-26', '12:30:00'),
(2, 7, 89.99, 4, 'No onions', 'Jane Smith', 1, '2025-03-25', '18:45:00'),
(3, 7, 45.50, 2, 'Extra spicy', 'John Doe', 0, '2025-03-27', '05:31:26');

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `menu_item_id` int(11) NOT NULL,
  `status` varchar(50) NOT NULL DEFAULT 'pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `order_items`
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


-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

CREATE TABLE `reviews` (
  `id` int(11) NOT NULL,
  `customerName` varchar(255) NOT NULL,
  `rating` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `date` datetime NOT NULL
) ;

--
-- Dumping data for table `reviews`
--

INSERT INTO `reviews` (`id`, `customerName`, `rating`, `title`, `content`, `date`) VALUES
(3, 'John Doe', 4, '0', 'The food was good and service was friendly.', '2023-12-04 09:45:00'),
(4, 'Nguyễn Văn A', 5, 'Món ăn rất ngon', 'Món ăn rất ngon, phục vụ nhanh chóng!', '2025-03-30 15:45:54'),
(5, 'Nguyễn Văn B', 5, 'Món ăn rất ngon', 'Món ăn rất ngon, phục vụ nhanh chóng!', '2025-03-31 09:21:45'),
(6, 'Nguyễn Văn C', 5, 'Món ăn rất ngon', 'Món ăn rất ngon, phục vụ nhanh chóng!', '2025-03-31 09:21:51'),
(7, 'Nguyễn Văn A', 5, '0', 'Món ăn rất ngon, phục vụ nhanh chóng!', '2025-03-31 09:58:27'),
(8, 'Nguyễn Hoàng', 5, '0', 'Món ăn rất ngon, phục vụ nhanh chóng!', '2025-03-31 10:03:28');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `reviews`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;


-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL COMMENT 'Tên danh mục'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `categories`
--

INSERT INTO `categories` (`id`, `name`) VALUES
(1, 'Món khai vị'),
(2, 'Món chính'),
(3, 'Món tráng miệng'),
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
  `category_id` int(11) DEFAULT NULL COMMENT 'ID danh mục món ăn',
  `status` tinyint(1) NOT NULL DEFAULT 1 COMMENT 'Trạng thái món ăn: true (còn), false (hết)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `menu_items`
--

INSERT INTO `menu_items` (`id`, `name`, `price`, `description`, `image`, `detail`, `category_id`, `status`) VALUES
(101, 'Gỏi cuốn', 50000.00, 'Gỏi cuốn với tôm và rau củ', '/images/goi-cuon.jpg', 'Gỏi cuốn là món ăn truyền thống của Việt Nam, được làm từ bánh tráng cuốn với tôm tươi, thịt heo, rau sống và bún. Thường được chấm với nước mắm chua ngọt.', 1, 1),
(107, 'Chả Giò', 45000.00, 'Chả giò giòn rụm với nhân thịt heo và rau củ', '/images/kv_chagio.jpg', 'Chả giò là món khai vị phổ biến trong ẩm thực Việt Nam, với vỏ bánh tráng vàng giòn bọc nhân thịt heo xay, mộc nhĩ, miến và rau củ. Thường ăn kèm rau sống và chấm nước mắm chua ngọt hoặc tương ớt.', 1, 1),
(108, 'Chân Gà Sả Ớt', 35000.00, 'Chân gà giòn sần sật, ướp sả ớt đậm đà', '/images/kv_changa.jpg', 'Chân gà được làm sạch, luộc giòn, ướp cùng sả băm, ớt xiêm, tỏi và gia vị đặc trưng. Món ăn có vị chua cay mặn ngọt hài hòa, thường dùng làm món nhậu hoặc khai vị. Ăn kèm rau răm và đậu phộng rang.', 1, 0),
(109, 'Há Cảo', 55000.00, 'Há cảo hấp với nhân tôm và thịt', '/images/kv_hacao.jpg', 'Há cảo là món ăn có nguồn gốc từ ẩm thực Quảng Đông, được làm từ vỏ bột mỏng bọc nhân tôm và thịt heo xay, hấp chín. Thường được dùng kèm nước tương pha chút dầu mè và ớt.', 1, 1),
(110, 'Trứng Chiên', 25000.00, 'Trứng gà chiên vàng thơm', '/images/kv_trung.jpg', 'Trứng gà tươi chiên với hành lá, gia vị vừa ăn, vàng đều hai mặt. Có thể thêm tùy chọn: trứng ốp la hoặc trứng cháy cạnh.', 1, 1),
(111, 'Bánh Mì Thịt', 30000.00, 'Bánh mì giòn tan với nhân thịt nguội và pate', '/images/mc_banhmi.jpg', 'Bánh mì Việt Nam truyền thống với vỏ giòn rụm, nhân gồm thịt nguội, pate tự làm, đồ chua (cà rốt, củ cải), rau mùi và sốt đặc biệt. Có thể thêm ớt tươi theo yêu cầu.', 2, 1),
(112, 'Bò Lúc Lắc', 120000.00, 'Thịt bò xào lúc lắc với hành tây, tiêu đen', '/images/mc_bo.jpg', 'Thịt bò thăn cao cấp được cắt vuông, ướp gia vị và xào cùng hành tây, tiêu đen nguyên hạt. Món ăn có độ mềm vừa phải, vị đậm đà, thường dùng với cơm trắng hoặc bánh mì.', 2, 1),
(113, 'Bò Nướng', 110000.00, 'Thịt bò băm nướng thơm trong lá lốt', '/images/mc_bonuong.jpg', 'Thịt bò xay ướp gia vị cùng sả, tỏi, nước mắm, gói trong lá lốt tươi và nướng trên than hồng. Món ăn có mùi thơm đặc trưng của lá lốt, ăn kèm bánh tráng, rau sống và nước chấm chua ngọt.', 2, 1),
(114, 'Bò Tiêu Đen', 125000.00, 'Thịt bò mềm xào với tiêu đen nguyên hạt thơm nồng', '/images/mc_botieu.jpg', 'Thịt bò thăn cao cấp cắt lát mỏng, xào nhanh với tiêu đen nguyên hạt, hành tây và nước sốt đặc biệt. Món ăn có vị cay ấm từ tiêu, thịt bò mềm và thơm. Thường dùng với cơm trắng nóng hoặc mì xào.', 2, 1),
(115, 'Hamburger Gà Giòn', 75000.00, 'Hamburger gà chiên giòn với sốt mayonnaise', '/images/mc_hamber.jpg', 'Bánh hamburger kẹp thịt gà phi lê tẩm bột chiên giòn, sốt mayonnaise tự làm, kèm bắp cải tím, dưa leo và cà rốt ngâm chua ngọt. Thích hợp cho trẻ em và người thích vị thanh nhẹ.', 2, 1),
(116, 'Nghêu Hấp Sả', 90000.00, 'Nghêu tươi hấp sả thơm lừng, nước dùng ngọt tự nhiên', '/images/mc_ngheu.jpg', 'Nghêu Bến Tre tươi sống được hấp cùng sả tươi, ớt, gừng và gia vị. Món ăn có vị ngọt tự nhiên từ nghêu, thơm mùi sả, dùng nóng cùng nước chấm muối tiêu chanh hoặc nước mắm gừng. Có thể ăn kèm bánh mì để chấm nước hấp.', 2, 1),
(117, 'Phở Bò', 65000.00, 'Phở truyền thống với nước dùng bò hầm thơm ngon', '/images/mc_pho.jpg', 'Phở bò Hà Nội với nước dùng được ninh từ xương bò hầm trong 12 tiếng, kèm thịt bò tái hoặc chín, bánh phở mềm. Ăn kèm giá đỗ, rau thơm, chanh và ớt tươi. Có thể thêm quẩy hoặc trứng chần theo yêu cầu.', 2, 1),
(118, 'Pizza Bò Bằm', 120000.00, 'Pizza lớp vỏ giòn tan với nhân bò bằm sốt cà chua', '/images/mc_pizza.jpg', 'Pizza kiểu Ý với đế bánh mỏng giòn, phủ sốt cà chua tự làm, thịt bò bằm xào gia vị, hành tây, ớt chuông và phô mai Mozzarella béo ngậy. Nướng trong lò đá đạt nhiệt độ 220°C cho đến khi phô mai chảy vàng. Kích thước 25cm, đủ cho 1-2 người.', 2, 1),
(119, 'Tôm Sốt Thái', 145000.00, 'Tôm sú tươi sốt Thái chua cay hấp dẫn', '/images/mc_tom.jpg', 'Tôm sú loại 1 nguyên con được chiên giòn, rưới sốt Thái tự làm từ ớt, tỏi, sả, chanh leo và nước cốt dừa. Vị chua cay hài hòa, thơm mùi sả và lá chanh. Ăn kèm bánh mì hoặc cơm trắng.', 2, 1),
(120, 'Tiramisu', 55000.00, 'Bánh tiramisu lớp bánh quy cà phê thấm vị', '/images/tm_banh.jpg', 'Bánh tiramisu Ý với các lớp bánh quy Savoiardi thấm cà phê espresso, xen kẽ kem mascarpone phủ bột cacao nguyên chất. Vị đắng nhẹ của cà phê hài hòa với vị béo ngậy của kem. Bảo quản lạnh trước khi dùng.', 3, 1),
(121, 'Salad Cá Ngừ', 75000.00, 'Salad tươi với cá ngừ đại dương và rau trộn', '/images/tm_salad.jpg', 'Salad gồm cá ngừ tươi, xà lách rocket, cà chua bi, dưa leo, hành tây đỏ và ô liu. Trộn cùng sốt mè rang và dầu olive nguyên chất. Món ăn giàu dinh dưỡng, phù hợp cho chế độ ăn lành mạnh.', 3, 1),
(122, 'Coca Cola', 25000.00, 'Nước ngọt Coca Cola chính hãng', '/images/n_cocacola.jpg', 'Nước giải khát Coca Cola chính hãng, đóng chai 330ml. Có thể dùng lạnh hoặc kèm đá tùy theo yêu cầu của khách hàng.', 4, 1);

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `menu_items`
--
ALTER TABLE `menu_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_menu_items_category` (`category_id`);


--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT cho bảng `menu_items`
--
ALTER TABLE `menu_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=123;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `menu_items`
--
ALTER TABLE `menu_items`
  ADD CONSTRAINT `fk_menu_items_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL;