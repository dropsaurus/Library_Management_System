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

if (!isset($_SESSION['USER_ID'])) {
    echo json_encode([
        'status' => 'error',
        'message' => 'User not logged in.'
    ]);
    exit;
}

try {
    $query = "SELECT USER_FNAME as CUST_FNAME, USER_LNAME as CUST_LNAME, USER_EMAIL as CUST_EMAIL, USER_PHONE as CUST_PHONE 
              FROM JPN_USER WHERE USER_ID = ?";
    $stmt = $pdo->prepare($query);
    $stmt->execute([$_SESSION['USER_ID']]);
    $result = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($result) {
        echo json_encode([
            'status' => 'success',
            'data' => $result
        ]);
    } else {
        echo json_encode([
            'status' => 'error',
            'message' => 'User not found.'
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
