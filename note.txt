<?php
// Cấu hình headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Autoload
require_once '../config/database.php';
require_once '../api/objects/user.php';
require_once '../api/controllers/user_controller.php';

// Khởi tạo kết nối database
$database = new Database();

// Xử lý request
$method = $_SERVER['REQUEST_METHOD'];
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

$user_controller = new UserController($database);

// Router
switch($method) {
    case 'GET':
        if ($uri === '/users') {
            $user_controller->getUsers();
        } elseif (preg_match('/^\/users\/(\d+)$/', $uri, $matches)) {
            // $user_controller->getProductById($matches[1]);
        } elseif (isset($_GET['search'])) {
            // $user_controller->searchProducts($_GET['search']);
        }
        break;
    
    case 'POST':
        if ($uri === '/users') {
            $data = json_decode(file_get_contents("php://input"));
            $user_controller->createUser($data);
        }
        break;
    
    case 'PUT':
        if (preg_match('/^\/users\/(\d+)$/', $uri, $matches)) {
            $data = json_decode(file_get_contents("php://input"));
            // $user_controller->updateUser($matches[1], $data);
        }
        break;
    
    case 'DELETE':
        if (preg_match('/^\/users\/(\d+)$/', $uri, $matches)) {
            // $user_controller->deleteUser($matches[1]);
        }
        break;
    
    default:
        APIResponse::error("Phương thức không được hỗ trợ", 405);
        break;
}
?>