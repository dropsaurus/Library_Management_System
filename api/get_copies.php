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
            c.COPY_ID,
            c.COPY_STATUS,
            b.BOOK_NAME
        FROM JPN_COPIES c
        LEFT JOIN JPN_BOOK b ON c.BOOK_ID = b.BOOK_ID
        ORDER BY c.COPY_ID
    ";

    $stmt = $pdo->prepare($query);
    $stmt->execute();
    $copies = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'status' => 'success',
        'data' => $copies
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}
?>
