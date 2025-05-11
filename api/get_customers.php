<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once '../config/db_connect.php';

try {
    $query = "SELECT 
                CUST_ID,
                CUST_FNAME,
                CUST_LNAME,
                CUST_PHONE,
                CUST_EMAIL,
                CUST_UID_TYPE,
                CUST_UID_NO
              FROM JPN_CUSTOMER
              ORDER BY CUST_FNAME, CUST_LNAME";

    $stmt = $pdo->prepare($query);
    $stmt->execute();
    $customers = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'status' => 'success',
        'data' => $customers
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}
