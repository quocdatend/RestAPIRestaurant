<?php
class User
{
    private $conn;
    private $table_name = "user";

    private $id;
    private $username;
    private $password;
    private $email;

    public function __construct($db)
    {
        $this->conn = $db;
    }

    // Phương thức đọc tất cả sản phẩm
    public function readAll()
    {
        $query = "SELECT * FROM " . $this->table_name;
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    public function read($page = 1, $limit = 10)
    {
        $offset = ($page - 1) * $limit;

        $query = "SELECT id, username, password, email FROM {$this->table_name} ORDER BY id DESC LIMIT ?, ?";

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

    // public function read() {
    //     $query = "SELECT * FROM " . $this->table_name;
    //     $stmt = $this->conn->prepare($query);
    //     $stmt->execute();
    //     return $stmt;
    // }

    public function readOne()
    {
        $query = "SELECT * FROM " . $this->table_name . " WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->id);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function create($data) {
        $query = "INSERT INTO " . $this->table_name . " 
                  (id, username, password, email) 
                  VALUES (?, ?, ?, ?)";
    
        $stmt = $this->conn->prepare($query);
    
        // Assign values to temporary variables
        $username = isset($data['username']) ? $data['username'] : '';
        $password = isset($data['password']) ? $data['password'] : '';
        $email = isset($data['email']) ? $data['email'] : '';
    
        // Clean data
        $this->username = htmlspecialchars(strip_tags($username));
        $this->password = htmlspecialchars(strip_tags($password));
        $this->email = htmlspecialchars(strip_tags($email));
    
        $id = $this->generateRandomAlphaNumeric();
        $hashedPassword = $this->hashPassword($this->password);

        $stmt->bind_param("sssss", $id, $this->username, $hashedPassword, $this->email);
        
        return $stmt->execute() ? true : false;
    }

    public function update()
    {
        $query = "UPDATE " . $this->table_name . "
                  SET username = :username, 
                      password = :password, 
                      email = :email, 
                  WHERE id = :id";

        $stmt = $this->conn->prepare($query);

        // Làm sạch dữ liệu
        $this->username = htmlspecialchars(strip_tags($this->username));
        $this->password = htmlspecialchars(strip_tags($this->password));
        $this->email = htmlspecialchars(strip_tags($this->email));
        $this->id = htmlspecialchars(strip_tags($this->id));

        // Bind các giá trị
        $stmt->bindParam(":username", $this->username);
        $stmt->bindParam(":password", $this->password);
        $stmt->bindParam(":email", $this->email);
        $stmt->bindParam(':id', $this->id);

        return $stmt->execute() ? true : false;
    }

    public function delete()
    {
        $query = "DELETE FROM " . $this->table_name . " WHERE id = ?";

        $stmt = $this->conn->prepare($query);

        $this->id = htmlspecialchars(strip_tags($this->id));

        $stmt->bindParam(1, $this->id);

        return $stmt->execute() ? true : false;
    }

    public function login($keywords)
    {
        $query = "SELECT * FROM " . $this->table_name . " WHERE username LIKE ? OR password LIKE ?";

        $stmt = $this->conn->prepare($query);

        $keywords = "%{$keywords}%";
        $stmt->bindParam(1, $keywords);
        $stmt->bindParam(2, $keywords);

        $stmt->execute();
        return $stmt;
    }


    public function searchByUsername($data)
    {
        $query = "SELECT * FROM " . $this->table_name . " WHERE username = ?";

        $stmt = $this->conn->prepare($query);

        $username = isset($data) ? $data : '';
        $this->username = htmlspecialchars(strip_tags($username));
        // $keywords = "%{$keywords}%";
        $stmt->bind_param(1, $this->username);

        $stmt->execute();
        return $stmt;
    }

    public function searchByEmail($data)
    {
        $query = "SELECT * FROM " . $this->table_name . " WHERE email LIKE ?";

        $stmt = $this->conn->prepare($query);
        
        $email = isset($data) ? $data : '';
        $this->email = htmlspecialchars(strip_tags($email));

        $stmt->bind_param(1, $this->email);

        $stmt->execute();
        return $stmt;
    }

    // hass pass
    private function hashPassword($password)
    {
        return hash('sha256', $password); // Tạo hash 64 ký tự
    }

    // random id
    function generateRandomAlphaNumeric($length = 16)
    {
        return substr(str_shuffle("0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"), 0, $length);
    }
}
