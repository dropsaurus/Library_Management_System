<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

session_start();

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../config/db_connect.php';

// Get user ID from query parameter
$userId = isset($_GET['user_id']) ? intval($_GET['user_id']) : 0;

if ($userId <= 0) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Invalid or missing user ID'
    ]);
    exit;
}

try {
    // Get the customer ID for this user
    $custStmt = $pdo->prepare("
        SELECT CUST_ID 
        FROM JPN_CUSTOMER 
        WHERE CUST_ID = ?
    ");
    
    $custStmt->execute([$userId]);
    $customer = $custStmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$customer) {
        echo json_encode([
            'status' => 'error',
            'message' => 'User not registered as a customer'
        ]);
        exit;
    }
    
    $customerId = $customer['CUST_ID'];
    
    // Get all reservations for this customer
    $resStmt = $pdo->prepare("
        SELECT r.RES_ID, r.RES_STARTTIME, r.RES_ENDTIME, r.RES_DESC, r.RES_COUNT, r.ROOM_ID, rm.ROOM_CAPACITY
        FROM JPN_RESERVATION r
        JOIN JPN_ROOM rm ON r.ROOM_ID = rm.ROOM_ID
        WHERE r.CUST_ID = ?
        ORDER BY r.RES_STARTTIME
    ");
    
    $resStmt->execute([$customerId]);
    $reservations = $resStmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode([
        'status' => 'success',
        'data' => $reservations
    ]);
    
} catch (PDOException $e) {
    error_log("Database error: " . $e->getMessage());
    echo json_encode([
        'status' => 'error',
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}
