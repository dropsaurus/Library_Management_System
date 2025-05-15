<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Preflight for CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once '../config/db_connect.php';

$userId = isset($_GET['user_id']) ? intval($_GET['user_id']) : 0;

if (!$userId) {
    echo json_encode([
        'status' => 'error',
        'message' => 'User ID is required'
    ]);
    exit;
}

try {
    // Get customer ID from user ID
    $custStmt = $pdo->prepare("SELECT CUST_ID FROM JPN_CUSTOMER WHERE CUST_ID = ?");
    $custStmt->execute([$userId]);
    $customer = $custStmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$customer) {
        echo json_encode([
            'status' => 'error',
            'message' => 'Customer not found'
        ]);
        exit;
    }
    
    $customerId = $customer['CUST_ID'];
    
    // Get rental records for this customer - Updated to match JPN_RENTAL table structure
    $stmt = $pdo->prepare("
        SELECT 
            r.R_ID,
            c.COPY_ID,
            b.BOOK_ID,
            b.BOOK_NAME,
            r.R_BORROWDATE as RENT_DATE,
            r.R_AC_RETURNDATE as RETURN_DATE
        FROM JPN_RENTAL r
        JOIN JPN_COPIES c ON r.COPY_ID = c.COPY_ID
        JOIN JPN_BOOK b ON c.BOOK_ID = b.BOOK_ID
        WHERE r.CUST_ID = ?
        ORDER BY r.R_BORROWDATE DESC
    ");
    
    $stmt->execute([$customerId]);
    $rentals = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if (count($rentals) === 0) {
        echo json_encode([
            'status' => 'success',
            'message' => 'No rental records found',
            'data' => []
        ]);
    } else {
        echo json_encode([
            'status' => 'success',
            'data' => $rentals
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
