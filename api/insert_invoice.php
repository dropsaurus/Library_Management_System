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

    if (
        !isset($data['inv_date']) ||
        !isset($data['inv_amount']) ||
        !isset($data['r_id'])
    ) {
        echo json_encode([
            'status' => 'error',
            'message' => 'Missing required fields'
        ]);
        exit;
    }

    $stmt = $pdo->prepare("
        INSERT INTO JPN_INVOICE (INV_DATE, INV_AMOUNT, R_ID)
        VALUES (:inv_date, :inv_amount, :r_id)
    ");

    $stmt->execute([
        ':inv_date'   => $data['inv_date'],
        ':inv_amount' => $data['inv_amount'],
        ':r_id'       => $data['r_id']
    ]);

    echo json_encode([
        'status' => 'success',
        'message' => 'Invoice inserted successfully'
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}
