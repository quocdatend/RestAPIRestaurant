<?php
$config = [
    'db_host' => 'localhost:3306',
    'db_user' => 'root',
    'db_pass' => 'Quocdat2112@',
    'db_name' => 'restaurant',
    // 'jwt_secret' => 'your_secure_jwt_secret_key'
];

// Database connection class
class Database {
    private $conn;
    
    public function __construct() {
        global $config;
        
        $this->conn = new mysqli(
            $config['db_host'],
            $config['db_user'],
            $config['db_pass'],
            $config['db_name']
        );
        
        if ($this->conn->connect_error) {
            die('Database connection failed: ' . $this->conn->connect_error);
        }
    }
    
    public function getConnection() {
        return $this->conn;
    }
}
?>