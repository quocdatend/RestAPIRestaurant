<?php
require_once '../config/database.php';
require_once '../api/controllers/user_controller.php';

// Khởi tạo database và controller
$database = new Database();
$user_controller = new UserController($database);

$method = $_SERVER['REQUEST_METHOD'];
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$uri_segments = explode('/', trim($uri, '/'));

// Lấy ID từ URL nếu có (ví dụ: /users/1)
$id = isset($uri_segments[2]) ? intval($uri_segments[2]) : null;

switch ($method) {
    case 'GET':
        if ($id) {
            // echo json_encode($user_controller->getUserById($id)); // Lấy user theo ID
        } else {
            $user_controller->getUsers(); // Lấy danh sách users
        }
        break;

    case 'POST':
        $data = json_decode(file_get_contents("php://input"), true);
        echo json_encode($user_controller->createUser($data)); // Tạo user mới
        break;

    case 'PUT':
        if ($id) {
            $data = json_decode(file_get_contents("php://input"), true);
            // echo json_encode($user_controller->updateUser($id, $data)); // Cập nhật user
        } else {
            echo json_encode(["message" => "User ID required"]);
        }
        break;

    case 'DELETE':
        if ($id) {
            // echo json_encode($user_controller->deleteUser($id)); // Xóa user
        } else {
            echo json_encode(["message" => "User ID required"]);
        }
        break;

    default:
        echo json_encode(["message" => "Invalid request method"]);
        break;
}
?>
