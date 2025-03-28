<?php
require_once __DIR__ . '/../utils/jwt.php';

class AuthMiddleware {
    public static function authenticate() {
        $headers = getallheaders();
        $token = $headers['Authorization'] ?? '';

        if (!$token) {
            http_response_code(401);
            echo json_encode(["error" => "Unauthorized: Missing token"]);
            exit;
        }

        $decoded = JWTHandler::verifyToken($token);
        if (!$decoded) {
            http_response_code(403);
            echo json_encode(["error" => "Forbidden: Invalid token"]);
            exit;
        }

        return $decoded;
    }
}
?>
