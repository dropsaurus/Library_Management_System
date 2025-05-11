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
        !isset($data['start_time']) ||
        !isset($data['end_time']) ||
        !isset($data['description']) ||
        !isset($data['count']) ||
        !isset($data['cust_id']) ||
        !isset($data['room_id'])
    ) {
        echo json_encode([
            'status' => 'error',
            'message' => 'Missing required fields'
        ]);
        exit;
    }

    $stmt = $pdo->prepare("
        INSERT INTO JPN_RESERVATION 
        (RES_STARTTIME, RES_ENDTIME, RES_DESC, RES_COUNT, CUST_ID, ROOM_ID)
        VALUES (:start_time, :end_time, :description, :count, :cust_id, :room_id)
    ");

    $stmt->execute([
        ':start_time'   => $data['start_time'],
        ':end_time'     => $data['end_time'],
        ':description'  => $data['description'],
        ':count'        => $data['count'],
        ':cust_id'      => $data['cust_id'],
        ':room_id'      => $data['room_id']
    ]);

    echo json_encode([
        'status' => 'success',
        'message' => 'Reservation created successfully'
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}
