<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once '../config/db_connect.php';

$data = json_decode(file_get_contents("php://input"), true);

// Validate input
if (!isset($data['res_id'])) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Missing reservation ID'
    ]);
    exit;
}

$res_id = $data['res_id'];

try {
    $stmt = $pdo->prepare("DELETE FROM JPN_RESERVATION WHERE RES_ID = ?");
    $stmt->execute([$res_id]);

    if ($stmt->rowCount() > 0) {
        echo json_encode([
            'status' => 'success',
            'message' => 'Reservation deleted successfully'
        ]);
    } else {
        echo json_encode([
            'status' => 'error',
            'message' => 'Reservation not found or already deleted'
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
