Request 
→ index.php 
→ Router 
→ Middleware 
→ Controller 
→ Model 
→ Database 
→ Response 
→ Client
```
project-restapi/
│
├── config/
│   ├── database.php           # Cấu hình kết nối database
│   └── core.php               # Các hằng số và cài đặt chung
│
├── api/
│   ├── objects/               # Các lớp đối tượng
│   │   ├── product.php        # Lớp xử lý đối tượng sản phẩm
│   │   └── user.php           # Lớp xử lý đối tượng người dùng
│   │
│   ├── controllers/           # Điều khiển logic xử lý
│   │   ├── product_controller.php
│   │   └── user_controller.php
│   │
│   └── routes/                # Định tuyến API
│       ├── product_routes.php
│       └── user_routes.php
│
├── utils/                     # Các tiện ích hỗ trợ
│   ├── jwt.php                # Xử lý JSON Web Token
│   ├── validator.php          # Kiểm tra và xác thực dữ liệu
│   └── response.php           # Định dạng phản hồi API
│
├── middlewares/               # Các lớp trung gian
│   ├── auth_middleware.php    # Kiểm tra xác thực
│   └── validate_middleware.php# Kiểm tra dữ liệu đầu vào
│
├── vendor/                    # Thư viện Composer
│
├── public/                    # Điểm vào của ứng dụng
│   └── index.php              # File khởi tạo và điều hướng chính
│
├── logs/                      # Thư mục lưu log
│
├── tests/                     # Thư mục chứa các test
│   ├── unit/
│   └── integration/
│
├── .htaccess                  # Cấu hình Apache Rewrite
├── composer.json              # Quản lý dependencies
└── README.md                  # Hướng dẫn sử dụng
```
---------menu-----------
http://localhost/RestAPIRestaurant/products

detail
http://localhost/RestAPIRestaurant/products/101