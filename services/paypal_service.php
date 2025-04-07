<?php
class PayPalService
{
    private $paypalConfig;
    private $accessToken;

    public function __construct()
    {
        // Khởi tạo cấu hình PayPal
        require_once __DIR__ . '/../config/paypal_config.php';
        $this->paypalConfig = new PayPalConfig();

        // Lấy access token
        $this->getAccessToken();
    }

    // Lấy access token từ PayPal API
    private function getAccessToken()
    {
        $ch = curl_init();

        $clientId = $this->paypalConfig->getClientId();
        $clientSecret = $this->paypalConfig->getClientSecret();

        curl_setopt($ch, CURLOPT_URL, $this->paypalConfig->getBaseUrl() . "/v1/oauth2/token");
        curl_setopt($ch, CURLOPT_HEADER, false);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_USERPWD, $clientId . ":" . $clientSecret);
        curl_setopt($ch, CURLOPT_POSTFIELDS, "grant_type=client_credentials");

        $result = curl_exec($ch);

        if (empty($result)) {
            throw new Exception("Error: No response from PayPal server");
        }

        $json = json_decode($result);

        if (!isset($json->access_token)) {
            throw new Exception("Error: Failed to get access token from PayPal");
        }

        $this->accessToken = $json->access_token;

        curl_close($ch);
    }

    // Tạo một đơn hàng thanh toán trong PayPal
    public function createOrder($amount, $currency, $description, $returnUrl, $cancelUrl)
    {
        $ch = curl_init();

        $payload = [
            'intent' => 'CAPTURE',
            'purchase_units' => [
                [
                    'amount' => [
                        'currency_code' => $currency,
                        'value' => $amount
                    ],
                    'description' => $description
                ]
            ],
            'application_context' => [
                'return_url' => $returnUrl,
                'cancel_url' => $cancelUrl
            ]
        ];

        curl_setopt($ch, CURLOPT_URL, $this->paypalConfig->getBaseUrl() . "/v2/checkout/orders");
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Content-Type: application/json',
            'Authorization: Bearer ' . $this->accessToken
        ]);

        $result = curl_exec($ch);
        curl_close($ch);
        return json_decode($result, true);
    }

    // Chấp nhận giao dịch đã được tạo
    public function captureOrder($orderId)
    {
        $ch = curl_init();

        curl_setopt($ch, CURLOPT_URL, $this->paypalConfig->getBaseUrl() . "/v2/checkout/orders/" . $orderId . "/capture");
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Content-Type: application/json',
            'Authorization: Bearer ' . $this->accessToken
        ]);

        $result = curl_exec($ch);
        curl_close($ch);

        return json_decode($result, true);
    }

    // Kiểm tra trạng thái giao dịch
    public function checkOrderStatus($orderId)
    {
        $ch = curl_init();

        curl_setopt($ch, CURLOPT_URL, $this->paypalConfig->getBaseUrl() . "/v2/checkout/orders/" . $orderId);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Content-Type: application/json',
            'Authorization: Bearer ' . $this->accessToken
        ]);

        $result = curl_exec($ch);
        curl_close($ch);

        return json_decode($result, true);
    }

    // Hoàn tiền cho một giao dịch
    public function refundTransaction($transactionId, $amount = null, $currency = null)
    {
        $ch = curl_init();

        $payload = [];

        if ($amount !== null && $currency !== null) {
            $payload = [
                'amount' => [
                    'value' => $amount,
                    'currency_code' => $currency
                ]
            ];
        }

        curl_setopt($ch, CURLOPT_URL, $this->paypalConfig->getBaseUrl() . "/v2/payments/captures/" . $transactionId . "/refund");
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Content-Type: application/json',
            'Authorization: Bearer ' . $this->accessToken
        ]);

        $result = curl_exec($ch);
        curl_close($ch);

        return json_decode($result, true);
    }

    // Tạo webhook để nhận thông báo từ PayPal
    public function createWebhook($url, $eventTypes)
    {
        $ch = curl_init();

        $payload = [
            'url' => $url,
            'event_types' => $eventTypes
        ];

        curl_setopt($ch, CURLOPT_URL, $this->paypalConfig->getBaseUrl() . "/v1/notifications/webhooks");
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Content-Type: application/json',
            'Authorization: Bearer ' . $this->accessToken
        ]);

        $result = curl_exec($ch);
        curl_close($ch);

        return json_decode($result, true);
    }

    // Xác thực webhook từ PayPal
    public function verifyWebhookSignature($requestBody, $headers)
    {
        $ch = curl_init();

        $payload = [
            'auth_algo' => $headers['PAYPAL-AUTH-ALGO'],
            'cert_url' => $headers['PAYPAL-CERT-URL'],
            'transmission_id' => $headers['PAYPAL-TRANSMISSION-ID'],
            'transmission_sig' => $headers['PAYPAL-TRANSMISSION-SIG'],
            'transmission_time' => $headers['PAYPAL-TRANSMISSION-TIME'],
            'webhook_id' => 'your_webhook_id_here',
            'webhook_event' => json_decode($requestBody)
        ];

        curl_setopt($ch, CURLOPT_URL, $this->paypalConfig->getBaseUrl() . "/v1/notifications/verify-webhook-signature");
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Content-Type: application/json',
            'Authorization: Bearer ' . $this->accessToken
        ]);

        $result = curl_exec($ch);
        curl_close($ch);

        return json_decode($result, true);
    }
}
