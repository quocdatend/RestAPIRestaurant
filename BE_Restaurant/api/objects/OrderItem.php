<?php

class OrderItem {
    private $conn;
    private $table_name = "order_items";

    public int $id;
    public string $orderId;
    public int $menuItemId;
    public string $status;
    public int $quantity = 1;
    public function __construct($db) {
        $this->conn = $db;
    }

    // Create new order item
    public function create() {
        $query = "INSERT INTO " . $this->table_name . " (order_id, menu_item_id, status, quantity) VALUES (?, ?, ?, ?)";
        $stmt = $this->conn->prepare($query);
        
        if ($stmt === false) {
            throw new Exception("Prepare failed: " . $this->conn->error);
        }
        
        $stmt->bind_param("sisi", $this->orderId, $this->menuItemId, $this->status, $this->quantity);
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
        
        if ($stmt === false) {
            throw new Exception("Prepare failed: " . $this->conn->error);
        }

        $stmt->execute();
        return $stmt;
    }

    // Delete an order item by class property ID
    public function delete() {
        $query = "DELETE FROM " . $this->table_name . " WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        
        if ($stmt === false) {
            throw new Exception("Prepare failed: " . $this->conn->error);
        }

        $stmt->bind_param("i", $this->id);
        return $stmt->execute();
    }

    // Delete order items by order ID
    public function deleteByOrderId($orderId) {
        $query = "DELETE FROM " . $this->table_name . " WHERE order_id = ?";
        $stmt = $this->conn->prepare($query);
        
        if ($stmt === false) {
            error_log("Prepare failed: " . $this->conn->error);
            return false;
        }

        $stmt->bind_param("s", $orderId);
        $result = $stmt->execute();
        $stmt->close();
        return $result;
    }

    // Delete an order item by ID
    public function deleteByOrderItemId($orderItemId) {
        $query = "DELETE FROM " . $this->table_name . " WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        
        if ($stmt === false) {
            error_log("Prepare failed: " . $this->conn->error);
            return false;
        }
    
        $stmt->bind_param("i", $orderItemId);
        $result = $stmt->execute();
        $stmt->close();
        
        return $result;
    }

    // Update an order item
    public function update() {
        $query = "UPDATE " . $this->table_name . " 
                  SET menu_item_id = ?, status = ?, quantity = ?
                  WHERE id = ? AND order_id = ?";
        $stmt = $this->conn->prepare($query);
        
        if ($stmt === false) {
            error_log("Prepare failed: " . $this->conn->error);
            return false;
        }

        $stmt->bind_param("isiss", $this->menuItemId, $this->status, $this->quantity, $this->id, $this->orderId);
        $result = $stmt->execute();
        $stmt->close();
        return $result;
    }
}
?>
