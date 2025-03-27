<?php
class MenuItem {
    private $conn;
    private $table_name = "menu_items";

    public $id;
    public $name;
    public $price;
    public $description;
    public $image;
    public $detail;

    public function __construct($db) {
        $this->conn = $db;
    }

    // Phương thức đọc tất cả món ăn
    public function readAll() {
        $query = "SELECT * FROM " . $this->table_name;
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    // Phương thức đọc phân trang
    public function read($page = 1, $limit = 10) {
        $offset = ($page - 1) * $limit;

        $query = "SELECT id, name, price, description, image, detail FROM {$this->table_name} ORDER BY id DESC LIMIT ?, ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param('ii', $offset, $limit);
        $stmt->execute();

        $result = $stmt->get_result();
        $menu_items = [];
        while ($row = $result->fetch_assoc()) {
            $menu_items[] = $row;
        }

        return $menu_items;
    }

    // Đếm tổng số món ăn
    public function count() {
        $query = "SELECT COUNT(*) as total FROM {$this->table_name}";
        $result = $this->conn->query($query);
        $row = $result->fetch_assoc();

        return (int)$row['total'];
    }

    // Đọc một món ăn theo ID
    public function readOne() {
        $query = "SELECT * FROM " . $this->table_name . " WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param('i', $this->id);
        $stmt->execute();
        $result = $stmt->get_result();
        return $result->fetch_assoc();
    }

    // Tạo một món ăn mới
    public function create() {
        $query = "INSERT INTO " . $this->table_name . " 
                  (name, price, description, image, detail) 
                  VALUES (?, ?, ?, ?, ?)";
    
        $stmt = $this->conn->prepare($query);
    
        // Làm sạch dữ liệu
        $this->name = htmlspecialchars(strip_tags($this->name));
        $this->price = htmlspecialchars(strip_tags($this->price));
        $this->description = htmlspecialchars(strip_tags($this->description));
        $this->image = htmlspecialchars(strip_tags($this->image));
        $this->detail = htmlspecialchars(strip_tags($this->detail));
    
        // Bind các giá trị (s = string, d = double)
        $stmt->bind_param("sdsss", $this->name, $this->price, $this->description, $this->image, $this->detail);
    
        return $stmt->execute() ? true : false;
    }

    // Cập nhật một món ăn
    public function update() {
        $query = "UPDATE " . $this->table_name . "
                  SET name = ?, 
                      price = ?, 
                      description = ?,
                      image = ?,
                      detail = ?
                  WHERE id = ?";
        
        $stmt = $this->conn->prepare($query);
        
        // Làm sạch dữ liệu
        $this->name = htmlspecialchars(strip_tags($this->name));
        $this->price = htmlspecialchars(strip_tags($this->price));
        $this->description = htmlspecialchars(strip_tags($this->description));
        $this->image = htmlspecialchars(strip_tags($this->image));
        $this->detail = htmlspecialchars(strip_tags($this->detail));
        $this->id = htmlspecialchars(strip_tags($this->id));
        
        // Bind các giá trị
        $stmt->bind_param("sdsssi", $this->name, $this->price, $this->description, $this->image, $this->detail, $this->id);
        
        return $stmt->execute() ? true : false;
    }

    // Xóa một món ăn
    public function delete() {
        $query = "DELETE FROM " . $this->table_name . " WHERE id = ?";
        
        $stmt = $this->conn->prepare($query);
        
        $this->id = htmlspecialchars(strip_tags($this->id));
        
        $stmt->bind_param('i', $this->id);
        
        return $stmt->execute() ? true : false;
    }

    // Tìm kiếm món ăn theo tên
    public function searchByName($keywords) {
        $query = "SELECT * FROM " . $this->table_name . " WHERE name LIKE ?";
        
        $stmt = $this->conn->prepare($query);
        
        $keywords = "%{$keywords}%";
        $stmt->bind_param('s', $keywords);
        
        $stmt->execute();
        return $stmt;
    }
}
?>