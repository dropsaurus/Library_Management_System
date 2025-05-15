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

    if (!isset($data['sp_id']) || !isset($data['e_id']) || !isset($data['amount'])) {
        echo json_encode([
            'status' => 'error',
            'message' => 'Missing required fields: sp_id, e_id, or amount'
        ]);
        exit;
    }

    $stmt = $pdo->prepare("
        INSERT INTO JPN_SPONSOR_SEMINAR (SP_ID, E_ID, AMOUNT)
        VALUES (:sp_id, :e_id, :amount)
    ");

    $stmt->execute([
        ':sp_id' => $data['sp_id'],
        ':e_id' => $data['e_id'],
        ':amount' => $data['amount']
    ]);

    echo json_encode([
        'status' => 'success',
        'message' => 'Sponsor-seminar relationship created successfully'
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}
?> 