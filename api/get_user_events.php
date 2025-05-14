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
    // Query to get all event registrations by the user
    $stmt = $pdo->prepare("
        SELECT r.*, e.EVENT_NAME, e.EVENT_DATE, e.EVENT_LOCATION
        FROM JPN_EVENT_REGISTRATION r
        JOIN JPN_EVENT e ON r.EVENT_ID = e.EVENT_ID
        WHERE r.USER_ID = :user_id AND e.EVENT_DATE >= CURRENT_DATE
        ORDER BY e.EVENT_DATE ASC
    ");
    
    $stmt->execute([':user_id' => $userId]);
    $events = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode([
        'status' => 'success',
        'events' => $events
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Server error: ' . $e->getMessage()
    ]);
} 