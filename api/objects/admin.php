<?php
class Admin {
    private $conn;
    private $table_name = "admin";

    function __construct($db)
    {
        $this->conn = $db;
    }

    
}