<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once '../config/db_connect.php';

try {
    $query = "SELECT 
                ex.E_ID,
                e.E_NAME,
                e.E_STARTTIME,
                e.E_ENDTIME,
                t.T_NAME AS topic_name,
                ex.EXPENSE
              FROM JPN_EXHIBITION ex
              JOIN JPN_EVENT e ON ex.E_ID = e.E_ID
              JOIN JPN_TOPIC t ON e.T_ID = t.T_ID";

    $stmt = $pdo->prepare($query);
    $stmt->execute();
    $exhibitions = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'status' => 'success',
        'data' => $exhibitions
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}
