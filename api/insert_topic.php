<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once '../config/db_connect.php';

try {
    $data = json_decode(file_get_contents("php://input"), true);

    if (!isset($data['name'])) {
        echo json_encode([
            'status' => 'error',
            'message' => 'Missing required field: name'
        ]);
        exit;
    }

    $stmt = $pdo->prepare("INSERT INTO JPN_TOPIC (T_NAME) VALUES (:name)");
    $stmt->execute([':name' => $data['name']]);

    echo json_encode([
        'status' => 'success',
        'message' => 'Topic inserted successfully'
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}
