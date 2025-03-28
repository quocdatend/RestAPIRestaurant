<?php
require_once '../api/objects/user.php';
require_once '../utils/validator.php';
require_once '../utils/response.php';
class UserController
{
    private $db;
    private $user;

    public function __construct($database)
    {
        $this->db = $database->getConnection();
        $this->user = new User($this->db);
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
            return APIResponse::success($stmt);
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
        return APIResponse::success($stmt);
    }

    public function updateUser($data)
    {
        //check username 
        $stmt = $this->user->searchByUsername($data);
        if (count($stmt) == 0) {
            return APIResponse::error("Username không tồn tại.");
        }

        $stmt = $this->user->update($data);
        if (!$stmt) {
            return APIResponse::error("Không thể cập nhật thông tin người dùng.");
        }
        return APIResponse::success($stmt);
    }
}
