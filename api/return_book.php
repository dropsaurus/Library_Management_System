<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: PUT, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once '../config/db_connect.php';

try {
    $data = json_decode(file_get_contents("php://input"), true);

    if (!isset($data['rental_id']) || !isset($data['return_date'])) {
        echo json_encode([
            'status' => 'error',
            'message' => 'Missing required fields: rental_id or return_date'
        ]);
        exit;
    }

    $stmt = $pdo->prepare("
        UPDATE JPN_RENTAL
        SET R_AC_RETURNDATE = :return_date,
            R_STATUS = 'RETURNED'
        WHERE R_ID = :rental_id
    ");
    $stmt->execute([
        ':return_date' => $data['return_date'],
        ':rental_id' => $data['rental_id']
    ]);

    echo json_encode([
        'status' => 'success',
        'message' => 'Book returned successfully'
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}
