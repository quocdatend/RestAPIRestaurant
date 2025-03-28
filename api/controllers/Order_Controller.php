<?php
require_once '../api/objects/Orders.php';
require_once '../api/objects/OrderItem.php'; // Thêm dòng này để include OrderItem class

class OrderController
{
    private $db;
    private $order;
    private $orderItem; // Thêm biến này để xử lý order items

    public function __construct($database)
    {
        $this->db = $database->getConnection();
        $this->order = new Orders($this->db);
        $this->orderItem = new OrderItem($this->db); // Khởi tạo OrderItem
    }

    public function getOrders()
    {
        try {
            // Lấy tất cả orders
            $orders = $this->order->readAll();

            if ($orders && !empty($orders)) {
                $orders_array = [];

                foreach ($orders as $order) {
                    if (!isset($order['id'])) {
                        continue;
                    }

                    // Chuẩn bị query cho order items với MySQLi
                    $query = "SELECT oi.id, oi.order_id, oi.menu_item_id, oi.status 
                             FROM order_items oi 
                             WHERE oi.order_id = ?";

                    $stmt = $this->db->prepare($query);

                    if ($stmt === false) {
                        throw new Exception("Failed to prepare statement: " . $this->db->error);
                    }

                    // Bind parameter với MySQLi
                    $stmt->bind_param("i", $order['id']);
                    $stmt->execute();

                    // Lấy kết quả với MySQLi
                    $result = $stmt->get_result();
                    $order_items = $result->fetch_all(MYSQLI_ASSOC);

                    // Thêm order items vào dữ liệu order
                    $order['order_items'] = $order_items ? $order_items : [];
                    $orders_array[] = $order;

                    $stmt->close();
                }

                http_response_code(200);
                echo json_encode($orders_array);
            } else {
                http_response_code(404);
                echo json_encode(["message" => "Không tìm thấy đơn hàng."]);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                "message" => "Lỗi khi lấy dữ liệu đơn hàng",
                "error" => $e->getMessage()
            ]);
        }
    }

    // Các phương thức khác giữ nguyên
    public function getOrderById($orderId)
    {
        $result = $this->order->readById($orderId);
        if ($result) {
            http_response_code(200);
            echo json_encode($result);
        } else {
            http_response_code(404);
            echo json_encode(["message" => "Đơn hàng không tồn tại."]);
        }
    }
    public function createOrder($data)
    {
        try {
            if (!is_array($data) || !isset($data['user_id'])) {
                throw new Exception("Dữ liệu đầu vào không hợp lệ: user_id là bắt buộc.");
            }

            $this->order->userId = (int) ($data['user_id'] ?? 0);
            $this->order->totalPrice = (float) ($data['total_price'] ?? 0.00);
            $this->order->numPeople = (int) ($data['num_people'] ?? 1);
            $this->order->specialRequest = $data['special_request'] ?? "";
            $this->order->customerName = $data['customer_name'] ?? "Khách hàng";
            $this->order->orderDate = date("Y-m-d");
            $this->order->orderTime = date("H:i:s");

            $this->db->begin_transaction();

            if ($this->order->create()) {
                $orderId = $this->db->insert_id;

                if (!empty($data['items']) && is_array($data['items'])) {
                    foreach ($data['items'] as $item) {
                        if (!isset($item['menu_item_id'])) {
                            throw new Exception("Dữ liệu item không hợp lệ: menu_item_id là bắt buộc.");
                        }
                        $this->orderItem->orderId = $orderId;
                        $this->orderItem->menuItemId = (int) $item['menu_item_id'];
                        $this->orderItem->status = $item['status'] ?? 'pending';

                        if (!$this->orderItem->create()) {
                            throw new Exception("Không thể tạo order item cho menu_item_id: " . $item['menu_item_id']);
                        }
                    }
                }

                $this->db->commit();
                http_response_code(201);
                echo json_encode([
                    "message" => "Đơn hàng đã được tạo.",
                    "order_id" => $orderId
                ]);
            } else {
                throw new Exception("Không thể tạo đơn hàng.");
            }
        } catch (Exception $e) {
            $this->db->rollback();
            http_response_code(503);
            echo json_encode([
                "message" => "Không thể tạo đơn hàng.",
                "error" => $e->getMessage()
            ]);
        }
    }
    public function updateOrder($orderId, $data)
    {
        try {
            if (!is_array($data) || !isset($data['user_id'])) {
                throw new Exception("Dữ liệu đầu vào không hợp lệ: user_id là bắt buộc.");
            }

            // Gán giá trị cho đối tượng order
            $this->order->orderId = (int) $orderId;
            $this->order->userId = (int) ($data['user_id'] ?? $this->order->userId);
            $this->order->totalPrice = (float) ($data['total_price'] ?? $this->order->totalPrice);
            $this->order->numPeople = (int) ($data['num_people'] ?? $this->order->numPeople);
            $this->order->specialRequest = $data['special_request'] ?? $this->order->specialRequest;
            $this->order->customerName = $data['customer_name'] ?? $this->order->customerName;

            // Bắt đầu transaction
            $this->db->begin_transaction();

            // Cập nhật đơn hàng (orders)
            if ($this->order->update()) {
                // Nếu có danh sách order_items, tiến hành cập nhật từng item
                if (!empty($data['order_items']) && is_array($data['order_items'])) {
                    foreach ($data['order_items'] as $item) {
                        if (!isset($item['menu_item_id'])) {
                            throw new Exception("Dữ liệu order_items không hợp lệ: menu_item_id là bắt buộc.");
                        }

                        $orderItemId = $item['id'] ?? null;
                        $menuItemId = (int) $item['menu_item_id'];
                        $status = $item['status'] ?? 'pending';

                        if ($orderItemId) {
                            // Nếu item đã có ID, tiến hành cập nhật
                            $this->orderItem->id = $orderItemId;
                            $this->orderItem->orderId = $orderId;
                            $this->orderItem->menuItemId = $menuItemId;
                            $this->orderItem->status = $status;

                            if (!$this->orderItem->update()) {
                                throw new Exception("Không thể cập nhật order item ID: " . $orderItemId);
                            }
                        } else {
                            // Nếu item chưa có ID, thêm mới vào database
                            $this->orderItem->orderId = $orderId;
                            $this->orderItem->menuItemId = $menuItemId;
                            $this->orderItem->status = $status;

                            if (!$this->orderItem->create()) {
                                throw new Exception("Không thể tạo order item cho menu_item_id: " . $menuItemId);
                            }
                        }
                    }
                }

                $this->db->commit();
                http_response_code(200);
                echo json_encode([
                    "message" => "Đơn hàng và order_items đã được cập nhật.",
                    "order_id" => $orderId
                ]);
            } else {
                throw new Exception("Cập nhật đơn hàng thất bại trong database.");
            }
        } catch (Exception $e) {
            $this->db->rollback();
            http_response_code(503);
            echo json_encode([
                "message" => "Không thể cập nhật đơn hàng.",
                "error" => $e->getMessage()
            ]);
        }
    }

    public function deleteOrder($orderId)
    {
        if (is_object($orderId) && isset($orderId->orderId)) {
            $orderIdValue = $orderId->orderId;
        } else {
            $orderIdValue = $orderId;
        }

        if (!is_numeric($orderIdValue)) {
            http_response_code(400);
            echo json_encode(["message" => "ID đơn hàng không hợp lệ."]);
            return;
        }
        $this->order->orderId = (int) $orderIdValue;
        if ($this->order->delete()) {
            http_response_code(200);
            echo json_encode(["message" => "Đơn hàng đã được xoá."]);
        } else {
            http_response_code(503);
            echo json_encode(["message" => "Không thể xoá đơn hàng."]);
        }
    }
    public function deleteOrderItem($orderItemId)
    {
        try {
            if (!$this->orderItem->deleteByOrderItemId($orderItemId)) {
                throw new Exception("Không thể xóa order_item.");
            }

            http_response_code(200);
            echo json_encode(["message" => "Order item đã được xóa.", "order_item_id" => $orderItemId]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(["message" => "Lỗi khi xóa order item.", "error" => $e->getMessage()]);
        }
    }
    public function updateOrderStatus($orderId, $newStatus)
    {
        try {
            if ($this->order->changeStatus($orderId, $newStatus)) {
                http_response_code(200);
                echo json_encode([
                    "message" => "Trạng thái đơn hàng đã được cập nhật thành công."
                ]);
            } else {
                throw new Exception("Cập nhật trạng thái đơn hàng thất bại.");
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                "message" => "Lỗi khi cập nhật trạng thái đơn hàng.",
                "error"   => $e->getMessage()
            ]);
        }
    }
    public function getOrdersByStatus($status)
    {
        try {
            if (!in_array($status, [0, 1, 2, 3])) {
                http_response_code(400);
                echo json_encode(["message" => "Trạng thái không hợp lệ."]);
                return;
            }
            $orders = $this->order->readByStatus($status);
            if ($orders && !empty($orders)) {
                $orders_array = [];
                foreach ($orders as $order) {
                    if (!isset($order['id'])) {
                        continue;
                    }
                    $query = "SELECT oi.id, oi.order_id, oi.menu_item_id, oi.status 
                          FROM order_items oi 
                          WHERE oi.order_id = ?";
                    $stmt = $this->db->prepare($query);
                    if ($stmt === false) {
                        throw new Exception("Lỗi chuẩn bị truy vấn: " . $this->db->error);
                    }
                    $stmt->bind_param("i", $order['id']);
                    $stmt->execute();
                    $result = $stmt->get_result();
                    $order_items = $result->fetch_all(MYSQLI_ASSOC);
                    $stmt->close();
                    $order['order_items'] = $order_items ? $order_items : [];
                    $orders_array[] = $order;
                }

                http_response_code(200);
                echo json_encode($orders_array);
            } else {
                http_response_code(404);
                echo json_encode(["message" => "Không tìm thấy đơn hàng với trạng thái này."]);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                "message" => "Lỗi khi lấy dữ liệu đơn hàng.",
                "error"   => $e->getMessage()
            ]);
        }
    }
    public function addOrderItems($orderId, $data)
    {
        try {
            if (!is_numeric($orderId) || $orderId <= 0) {
                throw new Exception("ID đơn hàng không hợp lệ.");
            }

            if (!isset($data['items']) || !is_array($data['items'])) {
                throw new Exception("Dữ liệu đầu vào không hợp lệ: items là bắt buộc.");
            }

            $this->db->begin_transaction();

            foreach ($data['items'] as $item) {
                if (!isset($item['menu_item_id']) || !isset($item['status'])) {
                    throw new Exception("Dữ liệu item không hợp lệ: menu_item_id và status là bắt buộc.");
                }

                $this->orderItem->orderId = $orderId;
                $this->orderItem->menuItemId = (int) $item['menu_item_id'];
                $this->orderItem->status = $item['status'];

                if (!$this->orderItem->create()) {
                    throw new Exception("Không thể thêm order item cho menu_item_id: " . $item['menu_item_id']);
                }
            }

            $this->db->commit();
            http_response_code(201);
            echo json_encode([
                "message" => "Đã thêm order items vào đơn hàng.",
                "order_id" => $orderId
            ]);
        } catch (Exception $e) {
            $this->db->rollback();
            http_response_code(400);
            echo json_encode([
                "message" => "Không thể thêm order items.",
                "error" => $e->getMessage()
            ]);
        }
    }
}
