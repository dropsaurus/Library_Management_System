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
    $stmt = $pdo->prepare("
        SELECT 
            r.R_ID,
            r.R_BORROWDATE,
            r.R_EX_RETURNDATE,
            r.R_AC_RETURNDATE,
            b.BOOK_NAME
        FROM JPN_RENTAL r
        JOIN JPN_BOOK b ON r.BOOK_ID = b.BOOK_ID
        WHERE r.USER_ID = :user_id
        ORDER BY r.R_BORROWDATE DESC
    ");
    $stmt->execute([':user_id' => $userId]);
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
