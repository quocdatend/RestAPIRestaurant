<?php
require_once __DIR__ . '/../utils/jwt.php';

class AuthMiddleware
{
    public static function verifyToken()
    {
        $headers = getallheaders();
        if (!isset($headers["Authorization"])) {
            http_response_code(401);
            echo json_encode(["error" => "Token không được cung cấp"]);
            exit();
        }

        $token = str_replace("Bearer ", "", $headers["Authorization"]);
        $decoded = (array) JWTHandler::verifyToken($token);

        if (isset($decoded["error"])) {
            http_response_code(401);
            echo json_encode(["error" => $decoded["error"]]);
            exit();
        }

        return $decoded;
    }
}
