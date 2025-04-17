<?php
class Payment {
    // Kết nối database
    private $conn;
    
    // Thuộc tính đối tượng
    public $id;
    public $user_id;
    public $order_id;
    public $transaction_id;
    public $payment_amount;
    public $currency;
    public $payment_status;
    public $payment_method;
    public $created_at;
    public $updated_at;
    
    // Constructor với kết nối database
    public function __construct($db) {
        $this->conn = $db;
    }
    
    // Tạo bản ghi thanh toán mới
    public function create() {
        // Tạo câu truy vấn
        $query = "INSERT INTO payments 
                SET user_id = ?, 
                    order_id = ?, 
                    transaction_id = ?, 
                    payment_amount = ?, 
                    currency = ?, 
                    payment_status = ?, 
                    payment_method = ?, 
                    created_at = NOW(), 
                    updated_at = NOW()";
        
        // Chuẩn bị câu lệnh
        $stmt = $this->conn->prepare($query);
        
        // Làm sạch dữ liệu
        $this->user_id = htmlspecialchars(strip_tags($this->user_id));
        $this->order_id = htmlspecialchars(strip_tags($this->order_id));
        $this->transaction_id = htmlspecialchars(strip_tags($this->transaction_id));
        $this->payment_amount = htmlspecialchars(strip_tags($this->payment_amount));
        $this->currency = htmlspecialchars(strip_tags($this->currency));
        $this->payment_status = htmlspecialchars(strip_tags($this->payment_status));
        $this->payment_method = htmlspecialchars(strip_tags($this->payment_method));
        
        // Gán các giá trị tham số
        $stmt->bind_param("sssdsss", 
            $this->user_id, 
            $this->order_id, 
            $this->transaction_id, 
            $this->payment_amount, 
            $this->currency, 
            $this->payment_status, 
            $this->payment_method
        );
        
        // Thực thi truy vấn
        if($stmt->execute()) {
            $this->id = $this->conn->insert_id;
            return true;
        }
        
        return false;
    }
    
    // Cập nhật trạng thái thanh toán
    public function updateStatus() {
        // Tạo câu truy vấn
        $query = "UPDATE payments 
                SET payment_status = ?, 
                    updated_at = NOW() 
                WHERE id = ?";
        
        // Chuẩn bị câu lệnh
        $stmt = $this->conn->prepare($query);
        
        // Làm sạch dữ liệu
        $this->payment_status = htmlspecialchars(strip_tags($this->payment_status));
        $this->id = htmlspecialchars(strip_tags($this->id));
        
        // Gán các giá trị tham số
        $stmt->bind_param("si", $this->payment_status, $this->id);
        
        // Thực thi truy vấn
        if($stmt->execute()) {
            return true;
        }
        
        return false;
    }
    
    // Lấy thông tin thanh toán theo ID
    public function readOne() {
        // Tạo câu truy vấn
        $query = "SELECT * FROM payments WHERE transaction_id = ? LIMIT 1";
        
        // Chuẩn bị câu lệnh
        $stmt = $this->conn->prepare($query);
        
        // Gán tham số
        $stmt->bind_param("s", $this->transaction_id);
        
        // Thực thi truy vấn
        $stmt->execute();
        $result = $stmt->get_result();
        
        if($result->num_rows > 0) {
            $row = $result->fetch_assoc();
            
            // Gán giá trị cho đối tượng
            $this->id = $row['id'];
            $this->user_id = $row['user_id'];
            $this->order_id = $row['order_id'];
            $this->transaction_id = $row['transaction_id'];
            $this->payment_amount = $row['payment_amount'];
            $this->currency = $row['currency'];
            $this->payment_status = $row['payment_status'];
            $this->payment_method = $row['payment_method'];
            $this->created_at = $row['created_at'];
            $this->updated_at = $row['updated_at'];
            
            return true;
        }
        
        return false;
    }
    
    // Lấy tất cả thanh toán của một người dùng
    public function readByUser() {
        // Tạo câu truy vấn
        $query = "SELECT * FROM payments WHERE user_id = ? ORDER BY created_at DESC";
        
        // Chuẩn bị câu lệnh
        $stmt = $this->conn->prepare($query);
        
        // Gán tham số
        $stmt->bind_param("s", $this->user_id);
        
        // Thực thi truy vấn
        $stmt->execute();
        
        return $stmt->get_result();
    }
    
    // Lấy thanh toán theo ID giao dịch PayPal
    public function readByTransactionId() {
        // Tạo câu truy vấn
        $query = "SELECT * FROM payments WHERE transaction_id = ? LIMIT 1";
        
        // Chuẩn bị câu lệnh
        $stmt = $this->conn->prepare($query);
        
        // Gán tham số
        $stmt->bind_param("s", $this->transaction_id);
        
        // Thực thi truy vấn
        $stmt->execute();
        $result = $stmt->get_result();
        
        if($result->num_rows > 0) {
            $row = $result->fetch_assoc();
            
            // Gán giá trị cho đối tượng
            $this->id = $row['id'];
            $this->user_id = $row['user_id'];
            $this->order_id = $row['order_id'];
            $this->transaction_id = $row['transaction_id'];
            $this->payment_amount = $row['payment_amount'];
            $this->currency = $row['currency'];
            $this->payment_status = $row['payment_status'];
            $this->payment_method = $row['payment_method'];
            $this->created_at = $row['created_at'];
            $this->updated_at = $row['updated_at'];
            
            return true;
        }
        
        return false;
    }
}
?>
