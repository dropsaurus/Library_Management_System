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

    if (!isset($data['id'])) {
        echo json_encode([
            'status' => 'error',
            'message' => 'Missing required field: id'
        ]);
        exit;
    }

    $stmt = $pdo->prepare("DELETE FROM JPN_RENTAL WHERE R_ID = :id");
    $stmt->execute([':id' => $data['id']]);

    echo json_encode([
        'status' => 'success',
        'message' => 'Rental deleted successfully'
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}
