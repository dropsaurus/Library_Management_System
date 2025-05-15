<?php
header('Content-Type: application/json');
require_once '../config/db_connect.php';

try {
    $stmt = $pdo->query("SELECT COUNT(*) AS count FROM JPN_RESERVATION");
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    echo json_encode([
        'status' => 'success',
        'count' => (int)$result['count']
    ]);
} catch (PDOException $e) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Database error: ' . $e->getMessage(),
        'count' => 0
    ]);
}
?>
