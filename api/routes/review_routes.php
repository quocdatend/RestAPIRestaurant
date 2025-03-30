<?php
// Include database and object files
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../controllers/ReviewController.php';

// Initialize database connection
$database = new Database();
$db = $database->getConnection();

// Initialize review controller
$reviewController = new ReviewController($db);

// Get request method
$method = $_SERVER['REQUEST_METHOD'];

// Get the ID from URL
$request_uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$uri_parts = explode('/', trim($request_uri, '/'));
$id = isset($uri_parts[count($uri_parts)-1]) && is_numeric($uri_parts[count($uri_parts)-1]) 
    ? (int)$uri_parts[count($uri_parts)-1] 
    : null;

// Handle different HTTP methods
switch ($method) {
    case 'GET':
        if ($id !== null) {
            $reviewController->readOne($id);
        } else {
            $reviewController->read();
        }
        break;
        
    case 'POST':
        $reviewController->create();
        break;
        
    case 'PUT':
        $reviewController->update();
        break;
        
    case 'DELETE':
        $reviewController->delete();
        break;
        
    default:
        http_response_code(405);
        echo json_encode(array("message" => "Method not allowed"));
        break;
}
?> 