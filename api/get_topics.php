<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}
require_once '../config/db_connect.php';

// Check if we only want count
$countOnly = isset($_GET['countOnly']) && $_GET['countOnly'] === 'true';

try {
    if ($countOnly) {
        $stmt = $pdo->query("SELECT COUNT(*) FROM JPN_TOPIC");
        $count = $stmt->fetchColumn();
        
        echo json_encode([
            'status' => 'success',
            'count' => $count
        ]);
    } else {
        $stmt = $pdo->query("SELECT T_ID, T_NAME FROM JPN_TOPIC ORDER BY T_NAME");
        $topics = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        echo json_encode([
            'status' => 'success',
            'topics' => $topics
        ]);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}
?> 