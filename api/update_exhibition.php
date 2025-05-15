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

if (
    !isset($data['E_ID']) ||
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

$eid = $data['E_ID'];

try {
    $pdo->beginTransaction();

    // Update JPN_EVENT
    $updateEvent = $pdo->prepare("
        UPDATE JPN_EVENT
        SET E_NAME = :e_name,
            E_STARTTIME = :e_starttime,
            E_ENDTIME = :e_endtime,
            T_ID = :t_id
        WHERE E_ID = :eid AND E_TYPE = 'E'
    ");
    $updateEvent->execute([
        ':e_name'      => $data['E_NAME'],
        ':e_starttime' => $data['E_STARTTIME'],
        ':e_endtime'   => $data['E_ENDTIME'],
        ':t_id'        => $data['T_ID'],
        ':eid'         => $eid
    ]);

    // Update JPN_EXHIBITION
    $updateExhibition = $pdo->prepare("
        UPDATE JPN_EXHIBITION
        SET EXPENSE = :expense
        WHERE E_ID = :eid
    ");
    $updateExhibition->execute([
        ':expense' => $data['EXPENSE'],
        ':eid'     => $eid
    ]);

    $pdo->commit();

    echo json_encode([
        'status' => 'success',
        'message' => 'Exhibition updated successfully'
    ]);
} catch (PDOException $e) {
    $pdo->rollBack();
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}
