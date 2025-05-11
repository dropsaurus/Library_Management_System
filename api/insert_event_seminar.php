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
        !isset($data['speaker_fname']) ||
        !isset($data['speaker_lname'])
    ) {
        echo json_encode([
            'status' => 'error',
            'message' => 'Missing required fields'
        ]);
        exit;
    }

    $stmt = $pdo->prepare("CALL SP_INSERT_JPN_SEMINAR_EVENT(:e_name, :e_starttime, :e_endtime, :t_id, :speaker_fname, :speaker_lname)");

    $stmt->execute([
        ':e_name'         => $data['e_name'],
        ':e_starttime'    => $data['e_starttime'],
        ':e_endtime'      => $data['e_endtime'],
        ':t_id'           => $data['t_id'],
        ':speaker_fname'  => $data['speaker_fname'],
        ':speaker_lname'  => $data['speaker_lname']
    ]);

    echo json_encode([
        'status' => 'success',
        'message' => 'Seminar event inserted successfully'
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}
?>
