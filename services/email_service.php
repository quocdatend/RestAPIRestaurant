<?php
require_once __DIR__ . '/../vendor/phpmailer/phpmailer/src/PHPMailer.php';
require_once __DIR__ . '/../vendor/phpmailer/phpmailer/src/SMTP.php';
require_once __DIR__ . '/../vendor/phpmailer/phpmailer/src/Exception.php';

use phpmailer\phpmailer\PHPMailer;
use phpmailer\phpmailer\Exception;

class EmailService {
    private $mail;

    public function __construct() {
        $this->mail = new PHPMailer(true);
        try {
            // Cấu hình SMTP
            $this->mail->isSMTP();
            $this->mail->Host = getenv("HOST_MAIL");
            $this->mail->SMTPAuth = true;
            $this->mail->Username = getenv("USERNAME_MAIL"); // Email gửi
            $this->mail->Password = getenv("PASSWORD_MAIL");    // App Password
            $this->mail->Port = getenv("PORT_MAIL");
            $this->mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;

            $this->mail->setFrom('noreply@restaurant.test', 'Restaurant');
            $this->mail->isHTML(true);
            $this->mail->CharSet = 'UTF-8';
        } catch (Exception $e) {
            error_log("Email Error: " . $e->getMessage());
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
            error_log("Email Send Error: " . $this->mail->ErrorInfo);
            return false;
        }
    }
}
?>
