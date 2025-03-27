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
            if (!is_array($data)) {
                http_response_code(400);
                echo json_encode(["message" => "Dữ liệu đầu vào không hợp lệ"]);
                break;
            }
            $orderController->updateOrder($id, $data);
        } else {
            http_response_code(400);
            echo json_encode(["message" => "Thiếu order_id trong URL"]);
        }
        break;
    case 'DELETE':
        if (isset($uri_segments[1]) && $uri_segments[1] === 'order' && isset($uri_segments[2])) {
            if ($uri_segments[2] === 'item' && isset($uri_segments[3])) {
                $orderItemId = intval($uri_segments[3]);
                $orderController->deleteOrderItem($orderItemId);
            } else {
                $orderId = intval($uri_segments[2]);
                $orderController->deleteOrder((object)["orderId" => $orderId]);
            }
        } else {
            http_response_code(400); // Bad Request
            echo json_encode(["message" => "Order ID or Item ID required"]);
        }
        break;
    default:
        echo json_encode(["message" => "Invalid request method"]);
        break;
}
