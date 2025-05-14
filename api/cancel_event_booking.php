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
    // First check if the registration belongs to the user and is upcoming
    $checkQuery = "SELECT er.*, e.EVENT_DATE 
                  FROM JPN_EVENT_REGISTRATION er
                  JOIN JPN_EVENT e ON er.EVENT_ID = e.EVENT_ID
                  WHERE er.REG_ID = ? AND er.CUST_ID = ? 
                  AND e.EVENT_DATE >= CURDATE() 
                  AND er.IS_CANCELLED = 0";
    
    $stmt = $pdo->prepare($checkQuery);
    $stmt->execute([$data['booking_id'], $_SESSION['CUST_ID']]);
    
    if ($stmt->rowCount() === 0) {
        echo json_encode([
            'status' => 'error',
            'message' => 'Invalid registration or not authorized to cancel'
        ]);
        exit;
    }

    // Cancel the registration
    $updateQuery = "UPDATE JPN_EVENT_REGISTRATION 
                   SET IS_CANCELLED = 1, 
                       CANCEL_DATE = CURRENT_TIMESTAMP 
                   WHERE REG_ID = ?";
    
    $stmt = $pdo->prepare($updateQuery);
    $stmt->execute([$data['booking_id']]);

    echo json_encode([
        'status' => 'success',
        'message' => 'Event registration cancelled successfully'
    ]);

} catch (PDOException $e) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}
?> 