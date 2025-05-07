<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');

require_once '../config/db_connect.php';

try {
    $query = "SELECT T_ID, T_NAME FROM JPN_TOPIC ORDER BY T_NAME";
    $stmt = $pdo->prepare($query);
    $stmt->execute();
    $topics = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'status' => 'success',
        'data' => $topics
    ]);

} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}
?> 