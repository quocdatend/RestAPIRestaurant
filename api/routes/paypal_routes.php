<?php
// Headers cần thiết
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Load core files
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../config/core.php';
require_once __DIR__ . '/../controllers/payment_controller.php';
require_once __DIR__ . '/../../middlewares/auth_middleware.php';

// Kết nối database
$database = new Database();
$db = $database->getConnection();
$paymentController = new PaymentController($db);

// Phân tích URL
$request_uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$request_method = $_SERVER['REQUEST_METHOD'];

// Tách các thành phần URI
$uri_parts = explode('/', trim($request_uri, '/'));

// Ví dụ: /RestAPIRestaurant/payments/initiate → ['RestAPIRestaurant', 'payments', 'initiate']
$endpoint = $uri_parts[count($uri_parts) - 2] ?? '';
$action = $uri_parts[count($uri_parts) - 1] ?? '';

if ($endpoint !== 'payments') {
    echo json_encode([
        'status' => 'error',
        'message' => 'Endpoint không hợp lệ'
    ]);
    exit;
}

AuthMiddleware::checkUser();

// Xử lý logic theo method và action
switch ($request_method) {
    case 'POST':
        $data = json_decode(file_get_contents("php://input"));

        switch($action) {
            case 'initiate':
                // Bắt đầu quá trình thanh toán
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
                echo json_encode([
                    'status' => 'info',
                    'message' => 'Thanh toán đã bị hủy bởi người dùng'
                ]);
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

/*
// Headers cần thiết
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Lấy kết nối database
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../config/core.php';
require_once __DIR__ . '/../../api/controllers/payment_controller.php';

// Khởi tạo đối tượng Database và lấy kết nối
$database = new Database();
$db = $database->getConnection();

// Khởi tạo controller
$paymentController = new PaymentController($db);

// Lấy phương thức yêu cầu
$request_method = $_SERVER["REQUEST_METHOD"];

// Xử lý các tuyến đường
switch($request_method) {
    case 'POST':
        // Nhận dữ liệu từ yêu cầu
        $data = json_decode(file_get_contents("php://input"));
        
        // Xác định hành động từ dữ liệu hoặc URL
        $action = '';
        if(isset($_GET['action'])) {
            $action = $_GET['action'];
        } else if(isset($data->action)) {
            $action = $data->action;
        }
        
        switch($action) {
            case 'initiate':
                // Bắt đầu quá trình thanh toán
                echo $paymentController->initiatePayment($data);
                break;
                
            case 'execute':
                // Thực hiện thanh toán sau khi người dùng xác nhận
                $paymentId = isset($data->payment_id) ? $data->payment_id : null;
                echo $paymentController->executePayment($paymentId);
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
        // Xử lý các yêu cầu GET
        $action = isset($_GET['action']) ? $_GET['action'] : '';
        
        switch($action) {
            case 'success':
                // Xử lý khi PayPal redirect về với trạng thái thành công
                $paymentId = isset($_GET['payment_id']) ? $_GET['payment_id'] : null;
                echo $paymentController->executePayment($paymentId);
                break;
                
            case 'cancel':
                // Xử lý khi người dùng hủy thanh toán trên PayPal
                echo json_encode([
                    'status' => 'info',
                    'message' => 'Thanh toán đã bị hủy bởi người dùng'
                ]);
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
        // Method không được hỗ trợ
        header("HTTP/1.0 405 Method Not Allowed");
        echo json_encode([
            'status' => 'error',
            'message' => 'Phương thức không được hỗ trợ'
        ]);
        break;
}
*/

/*
<?php
// Headers cần thiết
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Load core files
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../config/core.php';
require_once __DIR__ . '/../controllers/payment_controller.php';

// Kết nối database
$database = new Database();
$db = $database->getConnection();
$paymentController = new PaymentController($db);

// Phân tích URL
$request_uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$request_method = $_SERVER['REQUEST_METHOD'];

// Tách các thành phần URI
$uri_parts = explode('/', trim($request_uri, '/'));

// Ví dụ: /RestAPIRestaurant/payments/initiate → ['RestAPIRestaurant', 'payments', 'initiate']
$endpoint = $uri_parts[count($uri_parts) - 2] ?? '';
$action = $uri_parts[count($uri_parts) - 1] ?? '';

if ($endpoint !== 'payments') {
    echo json_encode([
        'status' => 'error',
        'message' => 'Endpoint không hợp lệ'
    ]);
    exit;
}

// Xử lý logic theo method và action
switch ($request_method) {
    case 'POST':
        $data = json_decode(file_get_contents("php://input"));

        switch ($action) {
            case 'initiate':
                echo $paymentController->initiatePayment($data);
                break;

            case 'execute':
                $paymentId = $data->payment_id ?? null;
                echo $paymentController->executePayment($paymentId);
                break;

            case 'webhook':
                $headers = getallheaders();
                $requestBody = file_get_contents("php://input");
                echo $paymentController->handleWebhook($requestBody, $headers);
                break;

            case 'refund':
                echo $paymentController->refundPayment($data);
                break;

            case 'status':
                echo $paymentController->checkStatus($data);
                break;

            default:
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Hành động POST không được hỗ trợ'
                ]);
                break;
        }
        break;

    case 'GET':
        switch ($action) {
            case 'success':
                $paymentId = $_GET['payment_id'] ?? null;
                echo $paymentController->executePayment($paymentId);
                break;

            case 'cancel':
                echo json_encode([
                    'status' => 'info',
                    'message' => 'Thanh toán đã bị hủy bởi người dùng'
                ]);
                break;

            case 'history':
                $userId = $_GET['user_id'] ?? null;

                if (!$userId) {
                    echo json_encode([
                        'status' => 'error',
                        'message' => 'Thiếu ID người dùng'
                    ]);
                } else {
                    echo $paymentController->getPaymentHistory($userId);
                }
                break;

            default:
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Hành động GET không được hỗ trợ'
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
*/
