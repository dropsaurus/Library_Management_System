<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../config/db_connect.php';

// Get user ID from request
$userId = isset($_GET['user_id']) ? intval($_GET['user_id']) : 0;

if (!$userId) {
    echo json_encode([
        'status' => 'error',
        'message' => 'User ID is required'
    ]);
    exit;
}

try {
    // Query to get all room bookings by the user
    $stmt = $pdo->prepare("
        SELECT b.*, r.ROOM_NAME, r.ROOM_CAPACITY
        FROM JPN_BOOKING b
        JOIN JPN_ROOM r ON b.ROOM_ID = r.ROOM_ID
        WHERE b.USER_ID = :user_id AND b.BOOKING_DATE >= CURRENT_DATE
        ORDER BY b.BOOKING_DATE ASC
    ");
    
    $stmt->execute([':user_id' => $userId]);
    $bookings = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode([
        'status' => 'success',
        'bookings' => $bookings
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Server error: ' . $e->getMessage()
    ]);
} 