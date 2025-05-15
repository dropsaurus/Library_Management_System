<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

session_start();

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../config/db_connect.php';

// Get the JSON data from the request
$data = json_decode(file_get_contents("php://input"), true);

// Validate required fields
if (!isset($data['reservation_id'])) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Missing reservation ID'
    ]);
    exit;
}

// Extract the data
$reservationId = intval($data['reservation_id']);

// Validate the data
if ($reservationId <= 0) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Invalid reservation ID'
    ]);
    exit;
}

try {
    // Check if the reservation exists
    $checkStmt = $pdo->prepare("SELECT RES_ID, CUST_ID FROM JPN_RESERVATION WHERE RES_ID = ?");
    $checkStmt->execute([$reservationId]);
    $reservation = $checkStmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$reservation) {
        echo json_encode([
            'status' => 'error',
            'message' => 'Reservation not found'
        ]);
        exit;
    }
    
    // Delete the reservation
    $deleteStmt = $pdo->prepare("DELETE FROM JPN_RESERVATION WHERE RES_ID = ?");
    $deleteStmt->execute([$reservationId]);
    
    $rowCount = $deleteStmt->rowCount();
    
    if ($rowCount > 0) {
        echo json_encode([
            'status' => 'success',
            'message' => 'Reservation cancelled successfully'
        ]);
    } else {
        echo json_encode([
            'status' => 'error',
            'message' => 'Failed to cancel reservation'
        ]);
    }
    
} catch (PDOException $e) {
    error_log("Database error: " . $e->getMessage());
    echo json_encode([
        'status' => 'error',
        'message' => 'Database error: ' . $e->getMessage()
    ]);
} 