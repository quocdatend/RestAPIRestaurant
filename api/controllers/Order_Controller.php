<?php
require_once '../api/objects/Orders.php';

class OrderController {
    private $db;
    private $order;

    public function __construct($database) {
        $this->db = $database->getConnection();
        $this->order = new Orders($this->db);
    }

    // Get all orders
    public function getOrders() {
        $stmt = $this->order->readAll();
        if ($stmt) {
            http_response_code(200);
            echo json_encode($stmt);
        } else {
            http_response_code(404);
            echo json_encode(["message" => "Không tìm thấy đơn hàng."]);
        }
    }

    // Get order by ID
    public function getOrderById($orderId) {
        $result = $this->order->readById($orderId);
        if ($result) {
            http_response_code(200);
            echo json_encode($result);
        } else {
            http_response_code(404);
            echo json_encode(["message" => "Đơn hàng không tồn tại."]);
        }
    }

    // Create new order
    public function createOrder($data) {
        $this->order->userId = $data->user_id;
        $this->order->items = $data->items;
        $this->order->totalPrice = $data->total_price;
        $this->order->numPeople = $data->num_people ?? 1; // Default 1 person
        $this->order->specialRequest = $data->special_request ?? "";
        $this->order->customerName = $data->customer_name ?? "Khách hàng";
        $this->order->orderDate = date("Y-m-d");
        $this->order->orderTime = date("H:i:s");

        if ($this->order->create()) {
            http_response_code(201);
            echo json_encode(["message" => "Đơn hàng đã được tạo."]);
        } else {
            http_response_code(503);
            echo json_encode(["message" => "Không thể tạo đơn hàng."]);
        }
    }

    // Update order
    public function updateOrder($orderId, $data) {
        $this->order->orderId = $orderId;
        $this->order->userId = $data->user_id;
        $this->order->items = $data->items;
        $this->order->totalPrice = $data->total_price;
        $this->order->numPeople = $data->num_people ?? 1;
        $this->order->specialRequest = $data->special_request ?? "";
        $this->order->customerName = $data->customer_name ?? "Khách hàng";
        $this->order->orderDate = date("Y-m-d");
        $this->order->orderTime = date("H:i:s");

        if ($this->order->update()) {
            http_response_code(200);
            echo json_encode(["message" => "Đơn hàng đã được cập nhật."]);
        } else {
            http_response_code(503);
            echo json_encode(["message" => "Không thể cập nhật đơn hàng."]);
        }
    }

    // Delete order
    public function deleteOrder($orderId) {
        $this->order->orderId = $orderId;

        if ($this->order->delete()) {
            http_response_code(200);
            echo json_encode(["message" => "Đơn hàng đã được xoá."]);
        } else {
            http_response_code(503);
            echo json_encode(["message" => "Không thể xoá đơn hàng."]);
        }
    }
}
?>
