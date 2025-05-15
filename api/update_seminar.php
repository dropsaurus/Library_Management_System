<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once '../config/db_connect.php';

try {
    $data = json_decode(file_get_contents("php://input"), true);

    if (
        !isset($data['e_id']) ||
        !isset($data['e_name']) ||
        !isset($data['e_starttime']) ||
        !isset($data['e_endtime']) ||
        !isset($data['t_id']) ||
        !isset($data['speaker_fname'])
    ) {
        echo json_encode([
            'status' => 'error',
            'message' => 'Missing required fields'
        ]);
        exit;
    }

    $stmtEvent = $pdo->prepare("
        UPDATE JPN_EVENT
        SET E_NAME = :e_name,
            E_STARTTIME = :e_starttime,
            E_ENDTIME = :e_endtime,
            T_ID = :t_id
        WHERE E_ID = :e_id AND E_TYPE = 'S'
    ");

    $stmtSeminar = $pdo->prepare("
        UPDATE JPN_SEMINAR
        SET SPEAKER_FNAME = :speaker_fname,
            SPEAKER_LNAME = :speaker_lname
        WHERE E_ID = :e_id
    ");

    $pdo->beginTransaction();

    $stmtEvent->execute([
        ':e_name' => $data['e_name'],
        ':e_starttime' => $data['e_starttime'],
        ':e_endtime' => $data['e_endtime'],
        ':t_id' => $data['t_id'],
        ':e_id' => $data['e_id']
    ]);

    $stmtSeminar->execute([
        ':speaker_fname' => $data['speaker_fname'],
        ':speaker_lname' => $data['speaker_lname'] ?? '',
        ':e_id' => $data['e_id']
    ]);

    $pdo->commit();

    echo json_encode([
        'status' => 'success',
        'message' => 'Seminar updated successfully'
    ]);
} catch (PDOException $e) {
    $pdo->rollBack();
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}
