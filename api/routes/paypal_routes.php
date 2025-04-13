<?php
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../config/core.php';
require_once __DIR__ . '/../controllers/payment_controller.php';
require_once __DIR__ . '/../../middlewares/auth_middleware.php';

$database = new Database();
$db = $database->getConnection();
$paymentController = new PaymentController($db);

$request_uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$request_method = $_SERVER['REQUEST_METHOD'];

$uri_parts = explode('/', trim($request_uri, '/'));

$endpoint = $uri_parts[count($uri_parts) - 2] ?? '';
$action = $uri_parts[count($uri_parts) - 1] ?? '';

if ($endpoint !== 'payments') {
    echo json_encode([
        'status' => 'error',
        'message' => 'Endpoint không hợp lệ'
    ]);
    exit;
}
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
    header("HTTP/1.1 200 OK");
    exit;
}
AuthMiddleware::checkUser();

switch ($request_method) {
    case 'POST':
        $data = json_decode(file_get_contents("php://input"));

        switch($action) {
            case 'initiate':
                echo $paymentController->initiatePayment($data);
                break;
                
            case 'execute':
                // Thực hiện thanh toán sau khi người dùng xác nhận
                $paymentId = isset($data->payment_id) ? $data->payment_id : null;
                // echo $paymentController->executePayment($paymentId);
                break;
                
            case 'webhook':
                // Xử lý webhook từ PayPal
                $headers = getallheaders();
                $requestBody = file_get_contents("php://input");
                echo $paymentController->handleWebhook($requestBody, $headers);
                break;
                
            case 'refund':
                // Hoàn tiền cho giao dịch
                echo $paymentController->refundPayment($data);
                break;
                
            case 'status':
                // Kiểm tra trạng thái thanh toán
                echo $paymentController->checkStatus($data);
                break;
                
            default:
                // Hành động không được hỗ trợ
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Hành động không được hỗ trợ'
                ]);
                break;
        }
        break;

    case 'GET':
        switch($action) {
            case 'success':
                // Xử lý khi PayPal redirect về với trạng thái thành công
                $token = isset($_GET['token']) ? $_GET['token'] : null;
                $payerId = isset($_GET['PayerID']) ? $_GET['PayerID'] : null;
                
                if ($token && $payerId) {
                    echo $paymentController->executePayment($token, $payerId);
                } else {
                    echo json_encode(['error' => 'Missing token or PayerID parameters']);
                }
                break;
                
            case 'cancel':
                // Xử lý khi người dùng hủy thanh toán trên PayPal
                header("Content-Type: application/html; charset=UTF-8");
                include __DIR__ . '/../../public/payments/payment_cancel.php';
                // echo json_encode([
                //     'status' => 'info',
                //     'message' => 'Thanh toán đã bị hủy bởi người dùng'
                // ]);
                break;
                
            case 'history':
                // Lấy lịch sử thanh toán của người dùng
                $userId = isset($_GET['user_id']) ? $_GET['user_id'] : null;
                
                if($userId === null) {
                    echo json_encode([
                        'status' => 'error',
                        'message' => 'Thiếu ID người dùng'
                    ]);
                    break;
                }
                
                echo $paymentController->getPaymentHistory($userId);
                break;
                
            default:
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Hành động không được hỗ trợ'
                ]);
                break;
        }
        break;

    default:
        header("HTTP/1.0 405 Method Not Allowed");
        echo json_encode([
            'status' => 'error',
            'message' => 'Phương thức không được hỗ trợ'
        ]);
        break;
}