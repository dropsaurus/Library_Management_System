<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

session_start();
require_once '../config/db_connect.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if (!isset($_SESSION['CUST_ID'])) {
    echo json_encode([
        'status' => 'error',
        'message' => 'User not logged in'
    ]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['booking_id'])) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Booking ID is required'
    ]);
    exit;
}

try {
    // First check if the booking belongs to the user and is upcoming
    $checkQuery = "SELECT * FROM JPN_ROOM_BOOKING 
                  WHERE BOOKING_ID = ? AND CUST_ID = ? 
                  AND BOOKING_DATE >= CURDATE() 
                  AND IS_CANCELLED = 0";
    
    $stmt = $pdo->prepare($checkQuery);
    $stmt->execute([$data['booking_id'], $_SESSION['CUST_ID']]);
    
    if ($stmt->rowCount() === 0) {
        echo json_encode([
            'status' => 'error',
            'message' => 'Invalid booking or not authorized to cancel'
        ]);
        exit;
    }

    // Cancel the booking
    $updateQuery = "UPDATE JPN_ROOM_BOOKING 
                   SET IS_CANCELLED = 1, 
                       CANCEL_DATE = CURRENT_TIMESTAMP 
                   WHERE BOOKING_ID = ?";
    
    $stmt = $pdo->prepare($updateQuery);
    $stmt->execute([$data['booking_id']]);

    echo json_encode([
        'status' => 'success',
        'message' => 'Room booking cancelled successfully'
    ]);

} catch (PDOException $e) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}
?> 