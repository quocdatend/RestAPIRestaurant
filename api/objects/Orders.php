<?php

class Orders
{
    private $conn;
    private $table_name = "orders";

    public int $orderId;
    public int $userId;
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
    public function create()
    {
        $query = "INSERT INTO " . $this->table_name . " (user_id, total_price, num_people, special_request, customer_name, order_date, order_time) 
                  VALUES (?, ?, ?, ?, ?, ?, ?)";

        $stmt = $this->conn->prepare($query);
        if ($stmt === false) {
            throw new Exception("Prepare failed: " . $this->conn->error);
        }

        $stmt->bind_param(
            "idissss",
            $this->userId,
            $this->totalPrice,
            $this->numPeople,
            $this->specialRequest,
            $this->customerName,
            $this->orderDate,
            $this->orderTime
        );

        $result = $stmt->execute();
        if ($result === false) {
            throw new Exception("Execute failed: " . $stmt->error);
        }

        $stmt->close();
        return $result;
    }

    // Read all orders
    public function read()
    {
        $query = "SELECT * FROM " . $this->table_name;
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    // Read a single order by ID
    public function readOne()
    {
        $query = "SELECT * FROM " . $this->table_name . " WHERE order_id = :orderId";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":orderId", $this->orderId);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function update()
    {
        $query = "UPDATE " . $this->table_name . " 
                  SET user_id = ?, total_price = ?, num_people = ?, special_request = ?, customer_name = ?
                  WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        if ($stmt === false) {
            error_log("Prepare failed: " . $this->conn->error);
            return false;
        }
        $stmt->bind_param("idissi", $this->userId, $this->totalPrice, $this->numPeople, $this->specialRequest, $this->customerName, $this->orderId);
        $result = $stmt->execute();
        $stmt->close();
        return $result;
    }

    public function delete()
    {
        $query = "DELETE FROM " . $this->table_name . " WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        if ($stmt === false) {
            error_log("Prepare failed: " . $this->conn->error);
            return false;
        }
        $this->orderId = (int) $this->orderId;
        $stmt->bind_param("i", $this->orderId);
        $result = $stmt->execute();
        $stmt->close();
        return $result;
    }

    public function readAll()
    {
        $query = "SELECT o.id, o.user_id, u.username, u.email, o.total_price, o.num_people, 
                         o.special_request, o.customer_name, o.order_date, o.order_time , o.status
                  FROM " . $this->table_name . " o
                  JOIN user u ON o.user_id = u.id";

        $stmt = $this->conn->prepare($query);
        $stmt->execute();

        $result = $stmt->get_result(); // Lấy dữ liệu
        $data = $result->fetch_all(MYSQLI_ASSOC); // Chuyển thành mảng kết quả

        return $data;
    }

    // Read an order by ID with user details
    public function readById($orderId)
    {
        $query = "SELECT o.id, o.user_id, u.username, u.email, o.total_price, o.num_people, 
                     o.special_request, o.customer_name, o.order_date, o.order_time
              FROM " . $this->table_name . " o
              JOIN user u ON o.user_id = u.id
              WHERE o.id = :orderId";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":orderId", $orderId, PDO::PARAM_INT);
        $stmt->execute();

        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
    public function changeStatus($orderId, $newStatus)
    {
        $query = "UPDATE " . $this->table_name . " SET status = ? WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        if ($stmt === false) {
            throw new Exception("Prepare failed: " . $this->conn->error);
        }

        // Bind các tham số: "ii" nghĩa là 2 tham số kiểu integer
        $stmt->bind_param("ii", $newStatus, $orderId);

        if ($stmt->execute()) {
            return true;
        }

        throw new Exception("Execute failed: " . $stmt->error);
    }
    public function readAllByStatus()
    {
        $query = "SELECT * FROM " . $this->table_name . " ORDER BY status ASC";
        $stmt = $this->conn->prepare($query);
        if ($stmt === false) {
            throw new Exception("Prepare failed: " . $this->conn->error);
        }
        if (!$stmt->execute()) {
            throw new Exception("Execute failed: " . $stmt->error);
        }
        $result = $stmt->get_result();
        $orders = $result->fetch_all(MYSQLI_ASSOC);
        $stmt->close();
        return $orders;
    }
    public function readByStatus($status)
    {
        $query = "SELECT * FROM orders WHERE status = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("i", $status);
        $stmt->execute();
        $result = $stmt->get_result();
        return $result->fetch_all(MYSQLI_ASSOC);
    }
}
