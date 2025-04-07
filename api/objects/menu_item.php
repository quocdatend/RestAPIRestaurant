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
    public $category_id;
    public $status;

    public function __construct($db) {
        $this->conn = $db;
    }

    // Phương thức đọc tất cả món ăn
    public function readAll() {
        $query = "SELECT mi.*, c.name as category_name 
                  FROM " . $this->table_name . " mi 
                  LEFT JOIN categories c ON mi.category_id = c.id";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    // Phương thức đọc phân trang
    public function read($page = 1, $limit = 10) {
        $offset = ($page - 1) * $limit;

        $query = "SELECT mi.id, mi.name, mi.price, mi.description, mi.image, mi.detail, mi.category_id, mi.status, c.name as category_name 
                  FROM {$this->table_name} mi 
                  LEFT JOIN categories c ON mi.category_id = c.id 
                  ORDER BY mi.id DESC LIMIT ?, ?";
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
        $query = "SELECT mi.*, c.name as category_name 
                  FROM " . $this->table_name . " mi 
                  LEFT JOIN categories c ON mi.category_id = c.id 
                  WHERE mi.id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param('i', $this->id);
        $stmt->execute();
        $result = $stmt->get_result();
        return $result->fetch_assoc();
    }

    // Kiểm tra trạng thái món ăn theo ID
    public function checkStatus() {
        $query = "SELECT id, name, status 
                  FROM " . $this->table_name . " 
                  WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param('i', $this->id);
        $stmt->execute();
        $result = $stmt->get_result();
        return $result->fetch_assoc();
    }

    // Upload hình ảnh và cập nhật đường dẫn vào cơ sở dữ liệu
    public function uploadImage($file) {
        // Đường dẫn thư mục lưu trữ
        $target_dir = __DIR__ . "/../../public/images/";
        $file_name = basename($file["name"]);
        $target_file = $target_dir . $file_name;
        $imageFileType = strtolower(pathinfo($target_file, PATHINFO_EXTENSION));

        // Kiểm tra file có phải là hình ảnh
        $check = getimagesize($file["tmp_name"]);
        if ($check === false) {
            return ["success" => false, "message" => "File không phải là hình ảnh."];
        }

        // Kiểm tra kích thước file (giới hạn 5MB)
        if ($file["size"] > 5000000) {
            return ["success" => false, "message" => "File quá lớn. Kích thước tối đa là 5MB."];
        }

        // Chỉ cho phép các định dạng hình ảnh nhất định
        if (!in_array($imageFileType, ["jpg", "jpeg", "png", "gif"])) {
            return ["success" => false, "message" => "Chỉ cho phép các định dạng JPG, JPEG, PNG, GIF."];
        }

        // Kiểm tra file đã tồn tại
        if (file_exists($target_file)) {
            $file_name = pathinfo($file_name, PATHINFO_FILENAME) . "_" . time() . "." . $imageFileType;
            $target_file = $target_dir . $file_name;
        }

        // Kiểm tra thư mục có tồn tại và có quyền ghi không
        if (!is_dir($target_dir)) {
            return ["success" => false, "message" => "Thư mục lưu trữ không tồn tại: $target_dir"];
        }
        if (!is_writable($target_dir)) {
            return ["success" => false, "message" => "Thư mục không có quyền ghi: $target_dir"];
        }

        // Lấy đường dẫn hình ảnh cũ (nếu có) để xóa
        $old_image = null;
        $query = "SELECT image FROM " . $this->table_name . " WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("i", $this->id);
        $stmt->execute();
        $result = $stmt->get_result();
        if ($row = $result->fetch_assoc()) {
            $old_image = $row['image'];
        }

        // Thử upload file
        if (move_uploaded_file($file["tmp_name"], $target_file)) {
            // Cập nhật đường dẫn hình ảnh vào cơ sở dữ liệu
            $this->image = "/images/" . $file_name;
            $query = "UPDATE " . $this->table_name . " SET image = ? WHERE id = ?";
            $stmt = $this->conn->prepare($query);
            $stmt->bind_param("si", $this->image, $this->id);

            if ($stmt->execute()) {
                // Xóa hình ảnh cũ nếu tồn tại
                if ($old_image && file_exists(__DIR__ . "/../../public" . $old_image)) {
                    unlink(__DIR__ . "/../../public" . $old_image);
                }
                return ["success" => true, "message" => "Upload hình ảnh thành công.", "image_path" => $this->image];
            } else {
                return ["success" => false, "message" => "Lỗi khi cập nhật đường dẫn hình ảnh vào cơ sở dữ liệu."];
            }
        } else {
            // Ghi log lỗi chi tiết
            $error = error_get_last();
            $error_message = $error ? $error['message'] : "Không có thông tin lỗi cụ thể.";
            return ["success" => false, "message" => "Lỗi khi upload hình ảnh: $error_message"];
        }
    }

    // Tạo một món ăn mới
    public function create($file = null) {
        // Xử lý upload hình ảnh nếu có file
        if ($file && isset($file['image']) && $file['image']['error'] !== UPLOAD_ERR_NO_FILE) {
            $upload_result = $this->uploadImage($file['image']);
            if (!$upload_result['success']) {
                return $upload_result; // Trả về lỗi nếu upload thất bại
            }
            $this->image = $upload_result['image_path'];
        } else {
            $this->image = $this->image ?? null; // Nếu không có file, giữ nguyên giá trị image (có thể là null)
        }

        $query = "INSERT INTO " . $this->table_name . " 
                  (name, price, description, image, detail, category_id, status) 
                  VALUES (?, ?, ?, ?, ?, ?, ?)";
    
        $stmt = $this->conn->prepare($query);
    
        // Làm sạch dữ liệu
        $this->name = htmlspecialchars(strip_tags($this->name));
        $this->price = htmlspecialchars(strip_tags($this->price));
        $this->description = htmlspecialchars(strip_tags($this->description));
        $this->image = $this->image ? htmlspecialchars(strip_tags($this->image)) : null;
        $this->detail = htmlspecialchars(strip_tags($this->detail));
        $this->category_id = htmlspecialchars(strip_tags($this->category_id));
        $this->status = (bool)$this->status; // Đảm bảo status là boolean
    
        // Bind các giá trị (s = string, d = double, i = integer)
        $stmt->bind_param("sdsssii", $this->name, $this->price, $this->description, $this->image, $this->detail, $this->category_id, $this->status);
    
        if ($stmt->execute()) {
            return ["success" => true, "message" => "Món ăn được tạo thành công."];
        } else {
            return ["success" => false, "message" => "Không thể tạo món ăn."];
        }
    }

    // Cập nhật một món ăn
    public function update() {
        $query = "UPDATE " . $this->table_name . "
                  SET name = ?, 
                      price = ?, 
                      description = ?,
                      image = ?,
                      detail = ?,
                      category_id = ?,
                      status = ?
                  WHERE id = ?";
        
        $stmt = $this->conn->prepare($query);
        
        // Làm sạch dữ liệu
        $this->name = htmlspecialchars(strip_tags($this->name));
        $this->price = htmlspecialchars(strip_tags($this->price));
        $this->description = htmlspecialchars(strip_tags($this->description));
        $this->image = htmlspecialchars(strip_tags($this->image));
        $this->detail = htmlspecialchars(strip_tags($this->detail));
        $this->category_id = htmlspecialchars(strip_tags($this->category_id));
        $this->status = (bool)$this->status;
        $this->id = htmlspecialchars(strip_tags($this->id));
        
        // Bind các giá trị
        $stmt->bind_param("sdsssiii", $this->name, $this->price, $this->description, $this->image, $this->detail, $this->category_id, $this->status, $this->id);
        
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
        $query = "SELECT mi.*, c.name as category_name 
                  FROM " . $this->table_name . " mi 
                  LEFT JOIN categories c ON mi.category_id = c.id 
                  WHERE mi.name LIKE ?";
        
        $stmt = $this->conn->prepare($query);
        
        $keywords = "%{$keywords}%";
        $stmt->bind_param('s', $keywords);
        
        $stmt->execute();
        return $stmt;
    }
}
?>