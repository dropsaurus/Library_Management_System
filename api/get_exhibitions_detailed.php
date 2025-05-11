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
    $query = "
        SELECT
            e.E_ID,
            ev.E_NAME,
            ev.E_STARTTIME,
            ev.E_ENDTIME,
            t.T_NAME AS topic,
            e.EXPENSE
        FROM JPN_EXHIBITION e
        JOIN JPN_EVENT ev ON e.E_ID = ev.E_ID
        LEFT JOIN JPN_TOPIC t ON ev.T_ID = t.T_ID
        ORDER BY ev.E_STARTTIME DESC
    ";

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
