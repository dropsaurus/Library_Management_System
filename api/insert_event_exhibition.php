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

if (!isset($data['CUST_ID']) || !isset($data['E_ID'])) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Missing CUST_ID or E_ID'
    ]);
    exit;
}

$custId = $data['CUST_ID'];
$eventId = $data['E_ID'];

try {
    $checkType = $pdo->prepare("SELECT E_TYPE FROM JPN_EVENT WHERE E_ID = :eid");
    $checkType->execute([':eid' => $eventId]);
    $typeRow = $checkType->fetch(PDO::FETCH_ASSOC);

    if (!$typeRow || $typeRow['E_TYPE'] !== 'E') {
        echo json_encode([
            'status' => 'error',
            'message' => 'This event is not an exhibition.'
        ]);
        exit;
    }

    $checkExist = $pdo->prepare("SELECT COUNT(*) FROM JPN_CUSTOMER_EXHIBITION WHERE CUST_ID = :cid AND E_ID = :eid");
    $checkExist->execute([':cid' => $custId, ':eid' => $eventId]);
    $alreadyRegistered = $checkExist->fetchColumn();

    if ($alreadyRegistered > 0) {
        echo json_encode([
            'status' => 'error',
            'message' => 'You have already registered for this exhibition.'
        ]);
        exit;
    }

    $stmt = $pdo->prepare("INSERT INTO JPN_CUSTOMER_EXHIBITION (CUST_ID, E_ID) VALUES (:cid, :eid)");
    $stmt->execute([':cid' => $custId, ':eid' => $eventId]);

    echo json_encode([
        'status' => 'success',
        'message' => 'Successfully registered for the exhibition!'
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}
