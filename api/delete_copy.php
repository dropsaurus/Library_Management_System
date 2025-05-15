<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once '../config/db_connect.php';

try {
    $data = json_decode(file_get_contents("php://input"), true);

    if (!isset($data['copy_id'])) {
        echo json_encode([
            'status' => 'error',
            'message' => 'Missing required field: copy_id'
        ]);
        exit;
    }

    $stmt = $pdo->prepare("DELETE FROM JPN_COPIES WHERE COPY_ID = :copy_id");
    $stmt->execute([':copy_id' => $data['copy_id']]);

    echo json_encode([
        'status' => 'success',
        'message' => 'Copy deleted successfully'
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}
