<?php
// hass pass
function HashPassword($password)
{
    return hash('sha256', $password); // Tạo hash 64 ký tự
}

// random id
function GenerateRandomAlphaNumeric($length = 16)
{
    return substr(str_shuffle("0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"), 0, $length);
}