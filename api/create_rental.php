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
        !isset($data['r_status']) ||
        !isset($data['r_borrowdate']) ||
        !isset($data['r_ex_returndate']) ||
        !isset($data['cust_id']) ||
        !isset($data['copy_id'])
    ) {
        echo json_encode([
            'status' => 'error',
            'message' => 'Missing required fields'
        ]);
        exit;
    }

    $stmt = $pdo->prepare("
        INSERT INTO JPN_RENTAL (R_STATUS, R_BORROWDATE, R_EX_RETURNDATE, CUST_ID, COPY_ID)
        VALUES (:r_status, :r_borrowdate, :r_ex_returndate, :cust_id, :copy_id)
    ");

    $stmt->execute([
        ':r_status'       => $data['r_status'],
        ':r_borrowdate'   => $data['r_borrowdate'],
        ':r_ex_returndate'=> $data['r_ex_returndate'],
        ':cust_id'        => $data['cust_id'],
        ':copy_id'        => $data['copy_id']
    ]);

    echo json_encode([
        'status' => 'success',
        'message' => 'Rental record inserted successfully'
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Database error: ' . $e->getMessage()
    ]);
} 