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

    if (!isset($data['room_id']) || !isset($data['room_capacity'])) {
        echo json_encode([
            'status' => 'error',
            'message' => 'Missing room_id or room_capacity'
        ]);
        exit;
    }

    $roomId = (int)$data['room_id'];
    $capacity = (int)$data['room_capacity'];

    // Check if room already exists
    $check = $pdo->prepare("SELECT COUNT(*) FROM JPN_ROOM WHERE ROOM_ID = :room_id");
    $check->execute([':room_id' => $roomId]);
    if ($check->fetchColumn() > 0) {
        echo json_encode([
            'status' => 'error',
            'message' => 'Room ID already exists'
        ]);
        exit;
    }

    // Insert new room
    $stmt = $pdo->prepare("INSERT INTO JPN_ROOM (ROOM_ID, ROOM_CAPACITY) VALUES (:room_id, :capacity)");
    $stmt->execute([
        ':room_id' => $roomId,
        ':capacity' => $capacity
    ]);

    echo json_encode([
        'status' => 'success',
        'message' => 'Room added successfully'
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}
