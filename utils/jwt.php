<?php
require_once __DIR__ . '/../vendor/autoload.php';
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class JWTHandler {
    private static $secret_key = "your_secret_key";
    private static $algo = 'HS256';

    // Tạo JWT
    public static function generateToken($user_id, $email) {
        $payload = [
            "sub" => $user_id,
            "email" => $email,
            "iat" => time(),
            "exp" => time() + 3600 // Token hết hạn sau 1 giờ
        ];
        return JWT::encode($payload, self::$secret_key, self::$algo);
    }

    // Xác thực JWT
    public static function verifyToken($token) {
        try {
            return JWT::decode($token, new Key(self::$secret_key, self::$algo));
        } catch (Exception $e) {
            return null; // Token không hợp lệ
        }
    }
}
?>
