<?php
// Cấu hình headers để hỗ trợ CORS
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Nhận URI request
// require_once '../api/routes/product_routes.php';
// require_once '../api/routes/user_routes.php';
// require_once '../api/routes/menu_routes.php';

$request_uri = explode('/', trim($_SERVER['REQUEST_URI'], '/'));
$resource = isset($request_uri[1]) ? $request_uri[1] : null;

// Điều hướng đến file routes tương ứng
switch ($resource) {
    case 'users':
        require_once '../api/routes/user_routes.php';
        break;
    case 'order':
        require_once '../api/routes/order_route.php';
        break;
    case 'products':
        require_once '../api/routes/menu_routes.php';
        break;
    default:
        echo json_encode(["message" => $resource]);
        break;
}
?>