<?php
require_once __DIR__ . '/../vendor/autoload.php';

use Dotenv\Dotenv;
$dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->load();

define("JWT_SECRET", $_ENV["JWT_SECRET"]);

// URL của website
define('WEBSITE_URL', 'http://localhost:3000/RestAPIRestaurant/');

// Thông tin PayPal
define('PAYPAL_CLIENT_ID',  $_ENV['PAYPAL_CLIENT_ID']);
define('PAYPAL_CLIENT_SECRET',  $_ENV['PAYPAL_CLIENT_SECRET']);
define('PAYPAL_MODE', 'sandbox'); // sandbox hoặc live

// Định dạng thời gian và múi giờ
define('TIMEZONE', 'Asia/Ho_Chi_Minh');
date_default_timezone_set(TIMEZONE);