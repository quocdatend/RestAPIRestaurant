<?php

class OrderItem {
    private $conn;
    private $table_name = "order_items";

    public int $id;
    public int $orderId;
    public int $menuItemId;
    public string $status;

    public function __construct($db) {
        $this->conn = $db;
    }

    
    public function create() {
    $query = "INSERT INTO " . $this->table_name . " (order_id, menu_item_id, status) VALUES (?, ?, ?)";
    $stmt = $this->conn->prepare($query);
    
    if ($stmt === false) {
        throw new Exception("Prepare failed: " . $this->conn->error);
    }
    
    $stmt->bind_param("iis", $this->orderId, $this->menuItemId, $this->status);
    $result = $stmt->execute();
    
    if ($result === false) {
        throw new Exception("Execute failed: " . $stmt->error);
    }
    
    $stmt->close();
    return $result;
}
    // Read all order items
    public function read() {
        $query = "SELECT * FROM " . $this->table_name;
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    // Update an order item
    public function update() {
        $query = "UPDATE " . $this->table_name . " SET status = :status WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":id", $this->id);
        $stmt->bindParam(":status", $this->status);
        return $stmt->execute();
    }

    // Delete an order item
    public function delete() {
        $query = "DELETE FROM " . $this->table_name . " WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":id", $this->id);
        return $stmt->execute();
    }  
}

?>
