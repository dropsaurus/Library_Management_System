<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

session_start();
require_once '../config/db_connect.php';

if (!isset($_SESSION['CUST_ID'])) {
    echo json_encode([
        'status' => 'error',
        'message' => 'User not logged in.'
    ]);
    exit;
}

try {
    $query = "SELECT CUST_FNAME, CUST_LNAME, CUST_EMAIL, CUST_PHONE FROM JPN_CUSTOMER WHERE CUST_ID = ?";
    $stmt = $pdo->prepare($query);
    $stmt->execute([$_SESSION['CUST_ID']]);
    $result = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($result) {
        echo json_encode([
            'status' => 'success',
            'data' => $result
        ]);
    } else {
        echo json_encode([
            'status' => 'error',
            'message' => 'Customer not found.'
        ]);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}
?>
