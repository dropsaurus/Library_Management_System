<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once '../config/db_connect.php';

try {
    $data = json_decode(file_get_contents("php://input"), true);

    if (!isset($data['e_id'])) {
        echo json_encode([
            'status' => 'error',
            'message' => 'Missing required field: e_id'
        ]);
        exit;
    }

    $e_id = $data['e_id'];

    // Start transaction to safely delete from both tables
    $pdo->beginTransaction();

    // Delete from JPN_SEMINAR
    $stmtSeminar = $pdo->prepare("DELETE FROM JPN_SEMINAR WHERE E_ID = :eid");
    $stmtSeminar->execute([':eid' => $e_id]);

    // Delete from JPN_EVENT (the base event)
    $stmtEvent = $pdo->prepare("DELETE FROM JPN_EVENT WHERE E_ID = :eid AND E_TYPE = 'S'");
    $stmtEvent->execute([':eid' => $e_id]);

    $pdo->commit();

    echo json_encode([
        'status' => 'success',
        'message' => 'Seminar deleted successfully'
    ]);
} catch (PDOException $e) {
    $pdo->rollBack();
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}
