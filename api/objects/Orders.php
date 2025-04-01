<?php

class Orders
{
    private $conn;
    private $table_name = "orders";

    public string $orderId;
    public string $userId; // Chuyển sang kiểu string
    public array $items;
    public float $totalPrice;
    public int $numPeople;
    public string $specialRequest;
    public string $customerName;
    public string $orderDate;
    public string $orderTime;

    public function __construct($db)
    {
        $this->conn = $db;
    }

    // Tạo đơn hàng
    public function create()
    {
        $query = "INSERT INTO " . $this->table_name . " (user_id, total_price, num_people, special_request, customer_name, order_date, order_time) 
                  VALUES (?, ?, ?, ?, ?, ?, ?)";

        $stmt = $this->conn->prepare($query);
        if ($stmt === false) {
            throw new Exception("Prepare failed: " . $this->conn->error);
        }

        // "s" cho user_id (string), "d" cho float, "i" cho int, còn lại là string
        $stmt->bind_param(
            "sdissss",
            $this->userId,
            $this->totalPrice,
            $this->numPeople,
            $this->specialRequest,
            $this->customerName,
            $this->orderDate,
            $this->orderTime
        );

        if (!$stmt->execute()) {
            throw new Exception("Execute failed: " . $stmt->error);
        }

        $stmt->close();
        return true;
    }

    // Lấy tất cả đơn hàng
    public function read()
    {
        $query = "SELECT * FROM " . $this->table_name;
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    }

    // Lấy đơn hàng theo ID
    public function readOne()
    {
        $query = "SELECT * FROM " . $this->table_name . " WHERE order_id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("s", $this->orderId);
        $stmt->execute();
        return $stmt->get_result()->fetch_assoc();
    }

    // Cập nhật đơn hàng
    public function update()
    {
        $query = "UPDATE " . $this->table_name . " 
                  SET user_id = ?, total_price = ?, num_people = ?, special_request = ?, customer_name = ?
                  WHERE id = ?";

        $stmt = $this->conn->prepare($query);
        if (!$stmt) {
            throw new Exception("Prepare failed: " . $this->conn->error);
        }

        $stmt->bind_param(
            "sdissi",
            $this->userId,
            $this->totalPrice,
            $this->numPeople,
            $this->specialRequest,
            $this->customerName,
            $this->orderId
        );

        if (!$stmt->execute()) {
            throw new Exception("Execute failed: " . $stmt->error);
        }

        $stmt->close();
        return true;
    }

    // Xóa đơn hàng
    public function delete()
    {
        $query = "DELETE FROM " . $this->table_name . " WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        if (!$stmt) {
            throw new Exception("Prepare failed: " . $this->conn->error);
        }

        $stmt->bind_param("s", $this->orderId);
        if (!$stmt->execute()) {
            throw new Exception("Execute failed: " . $stmt->error);
        }

        $stmt->close();
        return true;
    }

    // Lấy tất cả đơn hàng với thông tin người dùng
    public function readAll()
    {
        $query = "SELECT o.id, o.user_id, u.username, u.email, o.total_price, o.num_people, 
                         o.special_request, o.customer_name, o.order_date, o.order_time, o.status
                  FROM " . $this->table_name . " o
                  JOIN user u ON o.user_id = u.id";

        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    }

    // Lấy đơn hàng theo ID với thông tin người dùng
    public function readById($orderId)
    {
        $query = "SELECT o.id, o.user_id, u.username, u.email, o.total_price, o.num_people, 
                         o.special_request, o.customer_name, o.order_date, o.order_time
                  FROM orders o
                  JOIN user u ON o.user_id = u.id
                  WHERE o.id = ?";

        $stmt = $this->conn->prepare($query);
        if (!$stmt) {
            throw new Exception("Lỗi chuẩn bị truy vấn: " . $this->conn->error);
        }

        $stmt->bind_param("s", $orderId);
        $stmt->execute();
        return $stmt->get_result()->fetch_assoc();
    }

    // Thay đổi trạng thái đơn hàng
    public function changeStatus($orderId, $newStatus)
    {
        $query = "UPDATE " . $this->table_name . " SET status = ? WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        if (!$stmt) {
            throw new Exception("Prepare failed: " . $this->conn->error);
        }

        $stmt->bind_param("is", $newStatus, $orderId);
        if (!$stmt->execute()) {
            throw new Exception("Execute failed: " . $stmt->error);
        }

        return true;
    }
    
}
