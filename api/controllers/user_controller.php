<?php
require_once '../api/objects/user.php';
require_once '../utils/validator.php';
require_once '../utils/response.php';
require_once __DIR__ . '/../../middlewares/auth_middleware.php';
require_once __DIR__ . '/../../utils/jwt.php';
require_once __DIR__ . '/../../services/email_service.php';

class UserController
{
    private $db;
    private $user;

    public function __construct($database)
    {
        $this->db = $database->getConnection();
        $this->user = new User($this->db);
    }

    // get one
    public function getUser()
    {
        $userData = AuthMiddleware::verifyToken();
        if (count((array) $userData) == 0) {
            http_response_code(401);
            return APIResponse::error("Unauthorized");
        } else {
            return APIResponse::success($userData);
        }
        // $stmt = $this->user->searchById($id);
        // return $stmt;
    }


    // get all
    public function getUsers()
    {
        $stmt = $this->user->readAll(PDO::FETCH_ASSOC);
        $users_arr = array();
        $result = $stmt->get_result(); // Lấy kết quả từ câu truy vấn

        $users = [];
        while ($row = $result->fetch_assoc()) { // Lặp từng hàng dữ liệu
            $users[] = $row;
        }
        foreach ($users as $row) {
            $user_item = array(
                "id" => $row['id'],
                "username" => $row['username'],
                "password" => $row['password'],
                "email" => $row['email'],
            );
            array_push($users_arr, $user_item);
        }

        http_response_code(200);
        echo json_encode($users_arr);
    }

    // create
    public function createUser($data)
    {
        if (!Validator::validateUsername($data['username'])) {
            APIResponse::error("Username phải có ít nhất 8 ký tự, chứa chữ hoa, chữ thường, số và ký tự đặc biệt.");
            return ["message" => "User created faild"];
        }

        if (!Validator::validateEmail($data['email'])) {
            APIResponse::error("Email không hợp lệ.");
            return ["message" => "User created faild"];
        }

        // check exits username
        $stmt = $this->user->searchByUsername($data);
        if (count($stmt) != 0) {
            APIResponse::error("Username đã tồn tại.");
            return ["message" => "User created faild"];
        }

        // check exits email
        $stmt = $this->user->searchByEmail($data);
        if (count($stmt) != 0) {
            APIResponse::error("Email đã tồn tại.");
            return ["message" => "User created faild"];
        }


        if ($this->user->create($data)) {
            http_response_code(201);
            echo json_encode(array("message" => "Người dùng được tạo thành công."));
        } else {
            http_response_code(503);
            echo json_encode(array("message" => "Không thể tạo tài khoản."));
        }
        return ["message" => "User created successfully"];
    }

    public function login($data)
    {
        // check username
        $stmt = $this->user->searchByUsername($data);
        if (count($stmt) != 0) {
            $stmt = $this->user->loginByUsername($data);
        } else {
            // check email
            $stmt = $this->user->searchByEmail($data);
            if (count($stmt) != 0) {
                $stmt = $this->user->loginByEmail($data);
            } else {
                return APIResponse::error("Tài khoản không tồn tại.");
            }
        }
        if (count($stmt) == 0) {
            return APIResponse::error("Password incorrect");
        }
        $token = JWTHandler::generateToken($stmt[0]["id"], $stmt[0]["email"], $stmt[0]["username"]);

        return APIResponse::success($token);
    }

    public function updateUser($data)
    {
        //check username 
        $stmt = $this->user->searchByUsername($data);
        if (count($stmt) == 0) {
            return APIResponse::error("Username không tồn tại.");
        }
        //check email
        $stmt = $this->user->searchByEmail($data);
        if (count($stmt) != 0) {
            return APIResponse::error("Email đã tồn tại.");
        }
        $stmt = $this->user->updateEmail($data);
        if (!$stmt) {
            return APIResponse::error("Không thể cập nhật thông tin người dùng.");
        }
        return APIResponse::success($stmt);
    }

    public function forgetPassword($data)
    {
        $stmt = $this->user->searchByEmail($data);
        if (count($stmt) == 0) {
            return APIResponse::error("Username không tồn tại.");
        }
        // check data
        $to = isset($data["to"]) ? $data["to"] : null;
        $sub = isset($data["sub"]) ? $data["sub"] : null;
        $body = isset($data["body"]) ? $data["body"] : null;

        if(is_null($to) || is_null($sub) || is_null($body)) {
            return APIResponse::error("Thiếu dữ liệu");
        }
        // link reset
        $body += "Link Reset Password" . " ";
        // send email
        $emailService = new EmailService();
        $emailService->sendEmail($data["to"], $data["sub"], $data["body"]);
        return APIResponse::success("Đã gửi email reset Password");
    }

    public function resetPassword($data)
    {
        // check token
        $userData = AuthMiddleware::verifyToken();
        if (count((array) $userData) == 0) {
            return APIResponse::error("Token không hợp lệ.");
        }
        $data["username"] = $userData["username"];
        // check password
        if ($data["password"] != $data["repassword"]) {
            return APIResponse::error("Mật khẩu không khớp.");
        }
        // update password
        $stmt = $this->user->updatePassword($data);
        if (!$stmt) {
            return APIResponse::error("Không thể cập nhật thông tin người dùng.");
        }
    }
}
