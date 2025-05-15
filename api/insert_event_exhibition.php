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

$data = json_decode(file_get_contents("php://input"), true);

// Input validation
if (
    !isset($data['E_NAME']) ||
    !isset($data['E_STARTTIME']) ||
    !isset($data['E_ENDTIME']) ||
    !isset($data['T_ID']) ||
    !isset($data['EXPENSE'])
) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Missing required fields.'
    ]);
    exit;
}

try {
    $stmt = $pdo->prepare("CALL SP_INSERT_JPN_EXHIBITION_EVENT(:ename, :starttime, :endtime, :tid, :expense)");
    $stmt->execute([
        ':ename'     => $data['E_NAME'],
        ':starttime' => $data['E_STARTTIME'],
        ':endtime'   => $data['E_ENDTIME'],
        ':tid'       => $data['T_ID'],
        ':expense'   => $data['EXPENSE']
    ]);

    echo json_encode([
        'status' => 'success',
        'message' => 'Exhibition created successfully.'
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}
