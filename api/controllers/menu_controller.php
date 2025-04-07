<?php
require_once '../api/objects/menu_item.php';

class MenuController {
    private $db;
    private $menu_item;
    private $base_url = "http://localhost/RestAPIRestaurant/public"; // Domain của server

    public function __construct($database) {
        $this->db = $database->getConnection();
        $this->menu_item = new MenuItem($this->db);
    }

    // Lấy tất cả món ăn
    public function getMenuItems() {
        $stmt = $this->menu_item->readAll();
        $menu_items_arr = array();
        $result = $stmt->get_result();

        $menu_items = [];
        while ($row = $result->fetch_assoc()) {
            $menu_items[] = $row;
        }
        foreach ($menu_items as $row) {
            $menu_item = array(
                "id" => $row['id'],
                "name" => $row['name'],
                "price" => $row['price'],
                "description" => $row['description'],
                "image" => $row['image'] ? $this->base_url . $row['image'] : null, // Ghép domain với đường dẫn
                "detail" => $row['detail'],
                "category_id" => $row['category_id'],
                "category_name" => $row['category_name'],
                "status" => (bool)$row['status'],
            );
            array_push($menu_items_arr, $menu_item);
        }
    
        http_response_code(200);
        echo json_encode($menu_items_arr);
    }

    // Lấy một món ăn theo ID
    public function getMenuItemById($id) {
        $this->menu_item->id = $id;
        $result = $this->menu_item->readOne();

        if ($result) {
            $menu_item = array(
                "id" => $result['id'],
                "name" => $result['name'],
                "price" => $result['price'],
                "description" => $result['description'],
                "image" => $result['image'] ? $this->base_url . $result['image'] : null,
                "detail" => $result['detail'],
                "category_id" => $result['category_id'],
                "category_name" => $result['category_name'],
                "status" => (bool)$result['status'],
            );
            http_response_code(200);
            echo json_encode($menu_item);
        } else {
            http_response_code(404);
            echo json_encode(array("message" => "Không tìm thấy món ăn."));
        }
    }

    // Kiểm tra trạng thái món ăn theo ID
    public function checkMenuItemStatus($id) {
        $this->menu_item->id = $id;
        $result = $this->menu_item->checkStatus();

        if ($result) {
            $menu_item = array(
                "id" => $result['id'],
                "name" => $result['name'],
                "status" => (bool)$result['status'],
                "message" => (bool)$result['status'] ? "Món ăn còn hàng." : "Món ăn đã hết."
            );
            http_response_code(200);
            echo json_encode($menu_item);
        } else {
            http_response_code(404);
            echo json_encode(array("message" => "Không tìm thấy món ăn."));
        }
    }

    // Upload hình ảnh cho món ăn
    public function uploadMenuItemImage($id) {
        $this->menu_item->id = $id;

        // Kiểm tra món ăn có tồn tại không
        $result = $this->menu_item->readOne();
        if (!$result) {
            http_response_code(404);
            echo json_encode(array("message" => "Không tìm thấy món ăn."));
            return;
        }

        // Kiểm tra file hình ảnh
        if (!isset($_FILES['image']) || $_FILES['image']['error'] === UPLOAD_ERR_NO_FILE) {
            http_response_code(400);
            echo json_encode(array("message" => "Vui lòng chọn file hình ảnh để upload."));
            return;
        }

        // Xử lý upload
        $upload_result = $this->menu_item->uploadImage($_FILES['image']);
        if ($upload_result['success']) {
            http_response_code(200);
            echo json_encode(array(
                "message" => $upload_result['message'],
                "image_path" => $this->base_url . $upload_result['image_path']
            ));
        } else {
            http_response_code(400);
            echo json_encode(array("message" => $upload_result['message']));
        }
    }

    // Tạo một món ăn mới
    public function createMenuItem() {
        // Lấy dữ liệu từ form-data
        $this->menu_item->name = isset($_POST['name']) ? $_POST['name'] : null;
        $this->menu_item->price = isset($_POST['price']) ? $_POST['price'] : null;
        $this->menu_item->description = isset($_POST['description']) ? $_POST['description'] : null;
        $this->menu_item->image = isset($_POST['image']) ? $_POST['image'] : null;
        $this->menu_item->detail = isset($_POST['detail']) ? $_POST['detail'] : null;
        $this->menu_item->category_id = isset($_POST['category_id']) ? $_POST['category_id'] : null;
        $this->menu_item->status = isset($_POST['status']) ? filter_var($_POST['status'], FILTER_VALIDATE_BOOLEAN) : true;

        // Kiểm tra các trường bắt buộc
        if (empty($this->menu_item->name) || empty($this->menu_item->price)) {
            http_response_code(400);
            echo json_encode(array("message" => "Tên và giá món ăn là bắt buộc."));
            return;
        }

        // Xử lý upload hình ảnh nếu có
        $result = $this->menu_item->create($_FILES);
        if ($result['success']) {
            http_response_code(201);
            echo json_encode(array("message" => $result['message']));
        } else {
            http_response_code(503);
            echo json_encode(array("message" => $result['message']));
        }
    }

    // Cập nhật một món ăn
    public function updateMenuItem($id, $data) {
        $this->menu_item->id = $id;
        $this->menu_item->name = $data['name'];
        $this->menu_item->price = $data['price'];
        $this->menu_item->description = isset($data['description']) ? $data['description'] : null;
        $this->menu_item->image = isset($data['image']) ? $data['image'] : null;
        $this->menu_item->detail = isset($data['detail']) ? $data['detail'] : null;
        $this->menu_item->category_id = isset($data['category_id']) ? $data['category_id'] : null;
        $this->menu_item->status = isset($data['status']) ? $data['status'] : true;

        if ($this->menu_item->update()) {
            http_response_code(200);
            echo json_encode(array("message" => "Món ăn được cập nhật thành công."));
        } else {
            http_response_code(503);
            echo json_encode(array("message" => "Không thể cập nhật món ăn."));
        }
    }

    // Xóa một món ăn
    public function deleteMenuItem($id) {
        $this->menu_item->id = $id;

        if ($this->menu_item->delete()) {
            http_response_code(200);
            echo json_encode(array("message" => "Món ăn đã được xóa."));
        } else {
            http_response_code(503);
            echo json_encode(array("message" => "Không thể xóa món ăn."));
        }
    }

    // Tìm kiếm món ăn theo tên
    public function getMenuItemByName($data) {
        $result = $this->menu_item->searchByName($data['name']);

        if ($result) {
            $menu_items_arr = array();
            $result = $result->get_result();
            while ($row = $result->fetch_assoc()) {
                $menu_item = array(
                    "id" => $row['id'],
                    "name" => $row['name'],
                    "price" => $row['price'],
                    "description" => $row['description'],
                    "image" => $row['image'] ? $this->base_url . $row['image'] : null,
                    "detail" => $row['detail'],
                    "category_id" => $row['category_id'],
                    "category_name" => $row['category_name'],
                    "status" => (bool)$row['status'],
                );
                array_push($menu_items_arr, $menu_item);
            }
            http_response_code(200);
            echo json_encode($menu_items_arr);
        } else {
            http_response_code(404);
            echo json_encode(array("message" => "Không tìm thấy món ăn."));
        }
    }
}
?>