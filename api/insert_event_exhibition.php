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
        !isset($data['e_name']) ||
        !isset($data['e_starttime']) ||
        !isset($data['e_endtime']) ||
        !isset($data['t_id']) ||
        !isset($data['expense'])
    ) {
        echo json_encode([
            'status' => 'error',
            'message' => 'Missing required fields'
        ]);
        exit;
    }

    $stmt = $pdo->prepare("CALL SP_INSERT_JPN_EXHIBITION_EVENT(:e_name, :e_starttime, :e_endtime, :t_id, :expense)");

    $stmt->execute([
        ':e_name'      => $data['e_name'],
        ':e_starttime' => $data['e_starttime'],
        ':e_endtime'   => $data['e_endtime'],
        ':t_id'        => $data['t_id'],
        ':expense'     => $data['expense']
    ]);

    echo json_encode([
        'status' => 'success',
        'message' => 'Exhibition event inserted successfully'
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}
?>
