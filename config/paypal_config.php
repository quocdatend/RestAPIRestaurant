<?php
// Cấu hình PayPal
class PayPalConfig {
    // Các URL API của PayPal
    private $apiUrl = [
        'sandbox' => 'https://api-m.sandbox.paypal.com',
        'live' => 'https://api-m.paypal.com'
    ];
    
    // Client ID và Secret từ PayPal Developer Dashboard
    private $clientId;
    private $clientSecret;
    private $mode;
    
    public function __construct() {
        $this->clientId = PAYPAL_CLIENT_ID;
        $this->clientSecret = PAYPAL_CLIENT_SECRET;
        $this->mode = PAYPAL_MODE;
    }
    
    public function getBaseUrl() {
        return $this->apiUrl[$this->mode];
    }
    
    public function getClientId() {
        return $this->clientId;
    }
    
    public function getClientSecret() {
        return $this->clientSecret;
    }
    
    public function getMode() {
        return $this->mode;
    }
}
?>
