<?php
require_once __DIR__ . '/../vendor/autoload.php';
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Firebase\JWT\ExpiredException;
use Firebase\JWT\SignatureInvalidException;
use Firebase\JWT\BeforeValidException;
use UnexpectedValueException;

class JWTHandler {
    private static $secret_key;
    private static $algo = 'HS256';

    // Khởi tạo JWTHandler với secret key từ .env hoặc config
    public static function init() {
        self::$secret_key = getenv("JWT_SECRET") ?: "your_fallback_secret"; // Thay thế "your_fallback_secret"
    }

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
        } catch (ExpiredException $e) {
            return ["error" => "Token đã hết hạn"];
        } catch (SignatureInvalidException $e) {
            return ["error" => "Chữ ký không hợp lệ"];
        } catch (BeforeValidException $e) {
            return ["error" => "Token chưa hợp lệ"];
        } catch (UnexpectedValueException $e) {
            return ["error" => "Token không hợp lệ"];
        }
    }
}

// Gọi init() để nạp secret key từ môi trường hoặc cấu hình
JWTHandler::init();
?>
