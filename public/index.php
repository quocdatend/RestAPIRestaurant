<?php
// Cấu hình headers để hỗ trợ CORS
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Nhận URI request
$request_uri = explode('/', trim($_SERVER['REQUEST_URI'], '/'));
$resource = isset($request_uri[0]) ? $request_uri[0] : null;

// Điều hướng đến file routes tương ứng
switch ($resource) {
    case 'users':
        require_once '../api/routes/user_routes.php';
        break;

    default:
        echo json_encode(["message" => "Invalid API endpoint"]);
        break;
}
?>
