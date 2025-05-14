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
    // Query to get all books borrowed by the user
    $stmt = $pdo->prepare("
        SELECT r.*, b.BOOK_NAME, b.AUTHOR_NAME, b.TOPIC_ID 
        FROM JPN_RENTAL r
        JOIN JPN_BOOK b ON r.BOOK_ID = b.BOOK_ID
        WHERE r.USER_ID = :user_id AND r.RETURN_DATE IS NULL
    ");
    
    $stmt->execute([':user_id' => $userId]);
    $rentals = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode([
        'status' => 'success',
        'rentals' => $rentals
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Server error: ' . $e->getMessage()
    ]);
} 