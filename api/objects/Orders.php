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
        $query = "INSERT INTO " . $this->table_name . " (user_id, items, total_price, num_people, special_request, customer_name, order_date, order_time) 
                  VALUES (:userId, :items, :totalPrice, :numPeople, :specialRequest, :customerName, :orderDate, :orderTime)";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":userId", $this->userId);
        $stmt->bindParam(":items", json_encode($this->items));
        $stmt->bindParam(":totalPrice", $this->totalPrice);
        $stmt->bindParam(":numPeople", $this->numPeople);
        $stmt->bindParam(":specialRequest", $this->specialRequest);
        $stmt->bindParam(":customerName", $this->customerName);
        $stmt->bindParam(":orderDate", $this->orderDate);
        $stmt->bindParam(":orderTime", $this->orderTime);

        return $stmt->execute();
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

    // Update an order
    public function update()
    {
        $query = "UPDATE " . $this->table_name . " SET user_id = :userId, items = :items, total_price = :totalPrice, num_people = :numPeople, 
                  special_request = :specialRequest, customer_name = :customerName, order_date = :orderDate, order_time = :orderTime
                  WHERE order_id = :orderId";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":orderId", $this->orderId);
        $stmt->bindParam(":userId", $this->userId);
        $stmt->bindParam(":items", json_encode($this->items));
        $stmt->bindParam(":totalPrice", $this->totalPrice);
        $stmt->bindParam(":numPeople", $this->numPeople);
        $stmt->bindParam(":specialRequest", $this->specialRequest);
        $stmt->bindParam(":customerName", $this->customerName);
        $stmt->bindParam(":orderDate", $this->orderDate);
        $stmt->bindParam(":orderTime", $this->orderTime);

        return $stmt->execute();
    }

    // Delete an order
    public function delete()
    {
        $query = "DELETE FROM " . $this->table_name . " WHERE order_id = :orderId";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":orderId", $this->orderId);
        return $stmt->execute();
    }
    // Read all orders with user details
    public function readAll()
    {
        $query = "SELECT o.id, o.user_id, u.username, u.email, o.total_price, o.num_people, 
                         o.special_request, o.customer_name, o.order_date, o.order_time
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
}
