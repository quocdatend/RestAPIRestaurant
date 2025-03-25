<?php
class UserController {
    private $db;
    private $user;

    public function __construct($database) {
        $this->db = $database->getConnection();
        $this->user = new User($this->db);
    }

    // get all
    public function getUsers() {
        $stmt = $this->user->readAll();
        $users_arr = array();

        while ($row = $stmt->fetch()) {
            extract($row);
            $user_item = array(
                "id" => $id,
                "username" => $username,
                "password" => $password,
                "email" => $email,
                "phone" => $phone,
            );
            array_push($users_arr, $user_item);
        }

        http_response_code(200);
        echo json_encode($users_arr);
    }

    // create
    public function createUser($data) {
        $this->user->id = $this->generateRandomId();
        $this->user->username = $data->username;
        $this->user->password = $this->hashPassword($data->password);
        $this->user->email = $data->email;
        $this->user->phone = $data->phone;

        if ($this->user->create()) {
            http_response_code(201);
            echo json_encode(array("message" => "Người dùng được tạo thành công."));
        } else {
            http_response_code(503);
            echo json_encode(array("message" => "Không thể tạo tài khoản."));
        }
    }

    // get by username
    public function getUserByUsername($data) {
        $result = $this->user->searchByUsername($data->username);

        if($result) {
            http_response_code(200);
            echo json_encode($result);
        } else {
            http_response_code(404);
            echo json_encode(array("message" => "Không tìm thấy người dùng."));
        }
    }

    // hass pass
    private function hashPassword($password) {
        return hash('sha256', $password); // Tạo hash 64 ký tự
    }

    // random id
    private function generateRandomId() {
        return bin2hex(random_bytes(8)); // 8 bytes = 16 ký tự hex
    }
}
?>