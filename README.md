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


<!-- huong dann restapi -->
# GET - Lấy thông tin đơn hàng theo ID
```
GET http://localhost/restapirestaurant/order/{id}
```
# GET - Lấy danh sách đơn hàng theo trạng thái
```
GET http://localhost/restapirestaurant/order/status/{status}
```
# GET - Lấy danh sách tất cả đơn hàng
```
GET http://localhost/restapirestaurant/order
```
# POST - Tạo đơn hàng mới
```
POST http://localhost/restapirestaurant/order
{
  "user_id": 7,
  "username": "quocdat",
  "email": "abc@gmail.com",
  "total_price": "89.99",
  "num_people": 4,
  "special_request": "No onions",
  "customer_name": "Jane Smith",
  "order_date": "2025-03-25",
  "order_time": "18:45:00",
  "status": 1,
  "order_items": [
    {
      "menu_item_id": 101,
      "status": "pending"
    },
    {
      "menu_item_id": 102,
      "status": "confirmed"
    }
  ]
}
```
# POST - Thêm sản phẩm vào đơn hàng
```
POST http://localhost/restapirestaurant/order/items/{id}
Content-Type: application/json
{
  "items": [
    {
      "menu_item_id": 103,
      "quantity": 2
    }
  ]
}
```
# PUT - Cập nhật trạng thái đơn hàng
```
PUT http://localhost/restapirestaurant/order/status/{id}
Content-Type: application/json
{
  "newStatus": "confirmed"
}
```
# PUT - Cập nhật thông tin đơn hàng
```
PUT http://localhost/restapirestaurant/order/{id}
Content-Type: application/json
{
  "items": [
    {
      "menu_item_id": 101,
      "quantity": 3
    }
  ]
}
```
# DELETE - Xóa một sản phẩm trong đơn hàng
```
DELETE http://localhost/restapirestaurant/order/item/{orderItemId}
```
# DELETE - Xóa toàn bộ đơn hàng
```
DELETE http://localhost/restapirestaurant/order/{id}
```
