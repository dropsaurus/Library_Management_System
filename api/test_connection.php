<?php
header('Content-Type: application/json');

require_once '../config/db_connect.php';

try {
    // Test the connection
    $pdo->query('SELECT 1');
    echo json_encode([
        'status' => 'success',
        'message' => 'Database connection successful'
    ]);
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Connection failed: ' . $e->getMessage()
    ]);
}
?> 