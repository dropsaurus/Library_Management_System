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
                cu.CUST_ID,
                u.U_FNAME AS CUST_FNAME,
                u.U_LNAME AS CUST_LNAME,
                u.U_PHONE AS CUST_PHONE,
                u.U_EMAIL AS CUST_EMAIL,
                cu.CUST_UID_TYPE,
                cu.CUST_UID_NO
              FROM JPN_CUSTOMER cu
              JOIN JPN_USER u ON cu.CUST_ID = u.U_ID
              ORDER BY u.U_FNAME, u.U_LNAME";

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
