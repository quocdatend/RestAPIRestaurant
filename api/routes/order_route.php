<?php
require_once '../config/database.php';
require_once '../api/controllers/Order_Controller.php';

// Khởi tạo database và controller
$database = new Database();
$orderController = new OrderController($database);

header("Content-Type: application/json");

$method = $_SERVER['REQUEST_METHOD'];
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$uri_segments = explode('/', trim($uri, '/'));

// Lấy ID từ URL nếu có (ví dụ: /orders/1)
$id = isset($uri_segments[2]) ? intval($uri_segments[2]) : null;

switch ($method) {
    case 'GET':
        if ($id) {
            $orderController->getOrderById((object)["id" => $id]); // Lấy đơn hàng theo ID
        } else {
            $orderController->getOrders(); // Lấy danh sách đơn hàng
        }
        break;

    case 'POST':
        $data = json_decode(file_get_contents("php://input"), true);
        $orderController->createOrder($data); // Tạo đơn hàng mới
        break;

    case 'PUT':
        if ($id) {
            $data = json_decode(file_get_contents("php://input"), true);
            $orderController->updateOrder($id,$data);
            
        } else {
            echo json_encode(["message" => "Order ID required"]);
        }
        break;

    case 'DELETE':
        if ($id) {
            $orderController->deleteOrder((object)["id" => $id]); // Xóa đơn hàng
        } else {
            echo json_encode(["message" => "Order ID required"]);
        }
        break;

    default:
        echo json_encode(["message" => "Invalid request method"]);
        break;
}
