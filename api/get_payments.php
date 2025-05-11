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
                p.PAY_ID,
                p.PAY_DATE,
                p.PAY_AMOUNT,
                p.PAY_METHOD,
                p.INV_ID,
                i.INV_DATE,
                i.INV_AMOUNT
              FROM JPN_PAYMENT p
              LEFT JOIN JPN_INVOICE i ON p.INV_ID = i.INV_ID";

    $stmt = $pdo->prepare($query);
    $stmt->execute();
    $payments = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'status' => 'success',
        'data' => $payments
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}
