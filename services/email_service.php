<?php
require_once __DIR__ . '/../vendor/phpmailer/phpmailer/src/PHPMailer.php';
require_once __DIR__ . '/../vendor/phpmailer/phpmailer/src/SMTP.php';
require_once __DIR__ . '/../vendor/phpmailer/phpmailer/src/Exception.php';
require_once __DIR__ . '/../utils/response.php';

use phpmailer\phpmailer\PHPMailer;
use phpmailer\phpmailer\Exception;

class EmailService {
    private $mail;

    public function __construct() {
        $this->mail = new PHPMailer(true);
        try {
            // Cấu hình SMTP
            $this->mail->isSMTP();
            $this->mail->Host ='sandbox.smtp.mailtrap.io';
            $this->mail->SMTPAuth = true;
            $this->mail->Username = 'bb739291c8c7c1'; // Email gửi
            $this->mail->Password = '6ddc8ab5159c99';    // App Password
            $this->mail->Port = 587;
            $this->mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;

            $this->mail->setFrom('noreply@restaurant.test', 'Restaurant');
            $this->mail->isHTML(true);
            $this->mail->CharSet = 'UTF-8';
        } catch (Exception $e) {
            return APIResponse::error("Email Error: " . $e->getMessage());
        }
    }

    public function sendEmail($to, $subject, $body) {
        try {
            $this->mail->clearAddresses();
            $this->mail->addAddress($to);
            $this->mail->Subject = $subject;
            $this->mail->Body = $body;

            return $this->mail->send();
        } catch (Exception $e) {
            APIResponse::error("Email Send Error: " . $this->mail->ErrorInfo);
            return false;
        }
    }
}
?>
