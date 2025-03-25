<?php
class User {
    private $conn;
    private $table_name = "user";

    public $id;
    public $username;
    public $password;
    public $email;
    public $phone;

    public function __construct($db)
    {
        $this->conn = $db;
    }

    // Phương thức đọc tất cả sản phẩm
    public function readAll() {
        $query = "SELECT * FROM " . $this->table_name;
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    public function read($page = 1, $limit = 10)
    {
        $offset = ($page - 1) * $limit;

        $query = "SELECT id, username, password, email, phone FROM {$this->table_name} ORDER BY id DESC LIMIT ?, ?";

        $stmt = $this->conn->prepare($query);
        $stmt->bind_param('ii', $offset, $limit);
        $stmt->execute();

        $result = $stmt->get_result();

        $users = [];
        while ($row = $result->fetch_assoc()) {
            $users[] = $row;
        }

        return $users;
    }

    public function count()
    {
        $query = "SELECT COUNT(*) as total FROM {$this->table_name}";
        $result = $this->conn->query($query);
        $row = $result->fetch_assoc();

        return (int)$row['total'];
    }

    public function readOne() {
        $query = "SELECT * FROM " . $this->table_name . " WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->id);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function create() {
        $query = "INSERT INTO " . $this->table_name . " 
                  (id, username, password, email, phone) 
                  VALUES (?, ?, ?, ?, ?)"; 
    
        $stmt = $this->conn->prepare($query);
    
        // Làm sạch dữ liệu
        $this->id = htmlspecialchars(strip_tags($this->id));
        $this->username = htmlspecialchars(strip_tags($this->username));
        $this->password = htmlspecialchars(strip_tags($this->password));
        $this->email = htmlspecialchars(strip_tags($this->email));
        $this->phone = htmlspecialchars(strip_tags($this->phone));
    
        // Bind các giá trị (s = string, i = integer)
        $stmt->bind_param("sssss", $this->id, $this->username, $this->password, $this->email, $this->phone);
    
        return $stmt->execute() ? true : false;
    }

    public function update() {
        $query = "UPDATE " . $this->table_name . "
                  SET username = :username, 
                      password = :password, 
                      email = :email, 
                      phone = :phone
                  WHERE id = :id";
        
        $stmt = $this->conn->prepare($query);
        
        // Làm sạch dữ liệu
        $this->username = htmlspecialchars(strip_tags($this->username));
        $this->password = htmlspecialchars(strip_tags($this->password));
        $this->email = htmlspecialchars(strip_tags($this->email));
        $this->phone = htmlspecialchars(strip_tags($this->phone));
        $this->id = htmlspecialchars(strip_tags($this->id));
        
        // Bind các giá trị
        $stmt->bindParam(":username", $this->username);
        $stmt->bindParam(":password", $this->password);
        $stmt->bindParam(":email", $this->email);
        $stmt->bindParam(":phone", $this->phone);
        $stmt->bindParam(':id', $this->id);
        
        return $stmt->execute() ? true : false;
    }

    public function delete() {
        $query = "DELETE FROM " . $this->table_name . " WHERE id = ?";
        
        $stmt = $this->conn->prepare($query);
        
        $this->id = htmlspecialchars(strip_tags($this->id));
        
        $stmt->bindParam(1, $this->id);
        
        return $stmt->execute() ? true : false;
    }

    public function login($keywords) {
        $query = "SELECT * FROM " . $this->table_name . " WHERE username LIKE ? OR password LIKE ?";
        
        $stmt = $this->conn->prepare($query);
        
        $keywords = "%{$keywords}%";
        $stmt->bindParam(1, $keywords);
        $stmt->bindParam(2, $keywords);
        
        $stmt->execute();
        return $stmt;
    }


    public function searchByUsername($keywords) {
        $query = "SELECT * FROM " . $this->table_name . " WHERE username LIKE ?";
        
        $stmt = $this->conn->prepare($query);
        
        $keywords = "%{$keywords}%";
        $stmt->bindParam(1, $keywords);
        
        $stmt->execute();
        return $stmt;
    }

    public function searchByEmail($keywords) {
        $query = "SELECT * FROM " . $this->table_name . " WHERE email LIKE ?";
        
        $stmt = $this->conn->prepare($query);
        
        $keywords = "%{$keywords}%";
        $stmt->bindParam(1, $keywords);
        
        $stmt->execute();
        return $stmt;
    }
}
?>