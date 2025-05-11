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
        !isset($data['inv_id']) ||
        !isset($data['pay_date']) ||
        !isset($data['pay_amount'])
    ) {
        echo json_encode([
            'status' => 'error',
            'message' => 'Missing required fields'
        ]);
        exit;
    }

    $stmt = $pdo->prepare("CALL SP_INSERT_JPN_PAYMENT_CASH(:inv_id, :pay_date, :pay_amount)");

    $stmt->execute([
        ':inv_id'     => $data['inv_id'],
        ':pay_date'   => $data['pay_date'],
        ':pay_amount' => $data['pay_amount']
    ]);

    echo json_encode([
        'status' => 'success',
        'message' => 'Cash payment inserted successfully'
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}
?>
