<?php
class PaymentController {
    private $paypalService;
    private $payment;
    private $conn;
    
    public function __construct($db) {
        $this->conn = $db;
        
        // Khởi tạo đối tượng Payment
        require_once __DIR__ . '/../objects/payment.php';
        $this->payment = new Payment($db);
        
        // Khởi tạo PayPal Service
        require_once '../services/paypal_service.php';
        $this->paypalService = new PayPalService();
    }
    
    // Khởi tạo thanh toán PayPal
    public function initiatePayment($data) {
        // Kiểm tra dữ liệu đầu vào
        if(!isset($data->amount) || !isset($data->currency) || !isset($data->description) || !isset($data->user_id) || !isset($data->order_id)) {
            return json_encode([
                'status' => 'error',
                'message' => 'Thiếu thông tin thanh toán cần thiết'
            ]);
        }
        
        // Tạo URL cho PayPal redirect
        $returnUrl = WEBSITE_URL . "payments/success";
        $cancelUrl = WEBSITE_URL . "payments/cancel";
        
        try {
            // Tạo order trong PayPal
            $paypalOrder = $this->paypalService->createOrder(
                $data->amount,
                $data->currency,
                $data->description,
                $returnUrl,
                $cancelUrl
            );
            
            if(!isset($paypalOrder['id'])) {
                return json_encode([
                    'status' => 'error',
                    'message' => 'Không thể tạo đơn hàng PayPal',
                    'details' => $paypalOrder
                ]);
            }
            
            // Lưu thông tin thanh toán vào database
            $this->payment->user_id = $data->user_id;
            $this->payment->order_id = $data->order_id;
            $this->payment->transaction_id = $paypalOrder['id'];
            $this->payment->payment_amount = $data->amount;
            $this->payment->currency = $data->currency;
            $this->payment->payment_status = 'PENDING';
            $this->payment->payment_method = 'PAYPAL';
            
            if(!$this->payment->create()) {
                return json_encode([
                    'status' => 'error',
                    'message' => 'Không thể lưu thông tin thanh toán'
                ]);
            }
            
            // Tìm URL để redirect người dùng đến PayPal
            $approvalUrl = '';
            foreach($paypalOrder['links'] as $link) {
                if($link['rel'] == 'approve') {
                    $approvalUrl = $link['href'];
                    break;
                }
            }
            
            return json_encode([
                'status' => 'success',
                'message' => 'Đã tạo đơn hàng PayPal thành công',
                'payment_id' => $this->payment->id,
                'approval_url' => $approvalUrl
            ]);
            
        } catch(Exception $e) {
            return json_encode([
                'status' => 'error',
                'message' => $e->getMessage()
            ]);
        }
    }
    
    // Xử lý khi người dùng hoàn thành thanh toán
    public function executePayment ($token,$paymentId) {
        try {
            // Lấy thông tin thanh toán từ database
            // $this->payment->id = $paymentId;
            $this->payment->transaction_id = $token;
            if(!$this->payment->readOne()) {
                return json_encode([
                    'status' => 'error',
                    'message' => $paymentId
                ]);
            }
            
            // Chấp nhận giao dịch qua PayPal
            $result = $this->paypalService->captureOrder($this->payment->transaction_id);
            
            if($result['status'] == 'COMPLETED') {
                // Cập nhật trạng thái thanh toán
                $this->payment->payment_status = 'COMPLETED';
                $this->payment->updateStatus();
                
                header("Content-Type: text/html; charset=UTF-8");
                include __DIR__ . '/../../public/payments/payment_success.php';
                // return json_encode([
                //     'status' => 'success',
                //     'message' => 'Thanh toán đã được xử lý thành công',
                //     'details' => $result
                // ]);
            } else {
                return json_encode([
                    'status' => 'error',
                    'message' => 'Thanh toán không thành công',
                    'details' => $result
                ]);
            }
        } catch(Exception $e) {
            return json_encode([
                'status' => 'error',
                'message' => $e->getMessage()
            ]);
        }
    }
    
    // Xử lý webhook từ PayPal
    public function handleWebhook($requestBody, $headers) {
        try {
            // Xác thực webhook
            $verificationResult = $this->paypalService->verifyWebhookSignature($requestBody, $headers);
            
            if($verificationResult['verification_status'] != 'SUCCESS') {
                return json_encode([
                    'status' => 'error',
                    'message' => 'Xác thực webhook không thành công'
                ]);
            }
            
            $event = json_decode($requestBody);
            
            // Xử lý các loại sự kiện khác nhau
            switch($event->event_type) {
                case 'PAYMENT.CAPTURE.COMPLETED':
                    // Thanh toán đã hoàn thành
                    $transactionId = $event->resource->id;
                    
                    // Tìm thanh toán trong database
                    $this->payment->transaction_id = $transactionId;
                    if($this->payment->readByTransactionId()) {
                        // Cập nhật trạng thái thanh toán
                        $this->payment->payment_status = 'COMPLETED';
                        $this->payment->updateStatus();
                    }
                    break;
                
                case 'PAYMENT.CAPTURE.REFUNDED':
                    // Thanh toán đã được hoàn trả
                    $transactionId = $event->resource->id;
                    
                    // Tìm thanh toán trong database
                    $this->payment->transaction_id = $transactionId;
                    if($this->payment->readByTransactionId()) {
                        // Cập nhật trạng thái thanh toán
                        $this->payment->payment_status = 'REFUNDED';
                        $this->payment->updateStatus();
                    }
                    break;
                
                // Xử lý các sự kiện khác nếu cần
            }
            
            return json_encode([
                'status' => 'success',
                'message' => 'Webhook đã được xử lý'
            ]);
            
        } catch(Exception $e) {
            return json_encode([
                'status' => 'error',
                'message' => $e->getMessage()
            ]);
        }
    }
    
    // Hoàn tiền cho một giao dịch
    public function refundPayment($data) {
        try {
            if(!isset($data->payment_id)) {
                return json_encode([
                    'status' => 'error',
                    'message' => 'Thiếu ID thanh toán'
                ]);
            }
            
            // Lấy thông tin thanh toán
            $this->payment->id = $data->payment_id;
            if(!$this->payment->readOne()) {
                return json_encode([
                    'status' => 'error',
                    'message' => 'Không tìm thấy thông tin thanh toán'
                ]);
            }
            
            // Kiểm tra xem thanh toán đã hoàn thành chưa
            if($this->payment->payment_status != 'COMPLETED') {
                return json_encode([
                    'status' => 'error',
                    'message' => 'Chỉ có thể hoàn tiền cho thanh toán đã hoàn thành'
                ]);
            }
            
            // Trích xuất ID giao dịch từ transaction_id
            $transactionId = $this->payment->transaction_id;
            
            // Thực hiện hoàn tiền
            $amount = isset($data->amount) ? $data->amount : null;
            $currency = isset($data->currency) ? $data->currency : null;
            
            $result = $this->paypalService->refundTransaction($transactionId, $amount, $currency);
            
            if(isset($result['status']) && $result['status'] == 'COMPLETED') {
                // Cập nhật trạng thái thanh toán
                $this->payment->payment_status = 'REFUNDED';
                $this->payment->updateStatus();
                
                return json_encode([
                    'status' => 'success',
                    'message' => 'Hoàn tiền thành công',
                    'details' => $result
                ]);
            } else {
                return json_encode([
                    'status' => 'error',
                    'message' => 'Hoàn tiền không thành công',
                    'details' => $result
                ]);
            }
            
        } catch(Exception $e) {
            return json_encode([
                'status' => 'error',
                'message' => $e->getMessage()
            ]);
        }
    }
    
    // Kiểm tra trạng thái thanh toán
    public function checkStatus($data) {
        try {
            if(!isset($data->payment_id)) {
                return json_encode([
                    'status' => 'error',
                    'message' => 'Thiếu ID thanh toán'
                ]);
            }
            
            // Lấy thông tin thanh toán
            $this->payment->id = $data->payment_id;
            if(!$this->payment->readOne()) {
                return json_encode([
                    'status' => 'error',
                    'message' => 'Không tìm thấy thông tin thanh toán'
                ]);
            }
            
            // Kiểm tra trạng thái giao dịch trong PayPal
            $result = $this->paypalService->checkOrderStatus($this->payment->transaction_id);
            
            return json_encode([
                'status' => 'success',
                'payment_status' => $this->payment->payment_status,
                'paypal_details' => $result
            ]);
            
        } catch(Exception $e) {
            return json_encode([
                'status' => 'error',
                'message' => $e->getMessage()
            ]);
        }
    }
    
    // Lấy lịch sử thanh toán của người dùng
    public function getPaymentHistory($userId) {
        try {
            $this->payment->user_id = $userId;
            $result = $this->payment->readByUser();
            
            $num = $result->num_rows;
            
            if($num > 0) {
                $payments_arr = [];
                $payments_arr["records"] = [];
                
                while($row = $result->fetch_assoc()) {
                    $payment_item = [
                        "id" => $row["id"],
                        "user_id" => $row["user_id"],
                        "order_id" => $row["order_id"],
                        "transaction_id" => $row["transaction_id"],
                        "payment_amount" => $row["payment_amount"],
                        "currency" => $row["currency"],
                        "payment_status" => $row["payment_status"],
                        "payment_method" => $row["payment_method"],
                        "created_at" => $row["created_at"],
                        "updated_at" => $row["updated_at"]
                    ];
                    
                    array_push($payments_arr["records"], $payment_item);
                }
                
                return json_encode([
                    'status' => 'success',
                    'data' => $payments_arr
                ]);
            } else {
                return json_encode([
                    'status' => 'success',
                    'message' => 'Không tìm thấy lịch sử thanh toán',
                    'data' => []
                ]);
            }
            
        } catch(Exception $e) {
            return json_encode([
                'status' => 'error',
                'message' => $e->getMessage()
            ]);
        }
    }
}
?>