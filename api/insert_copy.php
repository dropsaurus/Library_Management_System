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

try {
    $data = json_decode(file_get_contents("php://input"), true);

    if (!isset($data['book_id']) || !isset($data['copy_status'])) {
        echo json_encode([
            'status' => 'error',
            'message' => 'Missing required fields: book_id or copy_status'
        ]);
        exit;
    }

    $stmt = $pdo->prepare("INSERT INTO JPN_COPIES (COPY_STATUS, BOOK_ID) VALUES (:copy_status, :book_id)");
    $stmt->execute([
        ':copy_status' => $data['copy_status'],
        ':book_id' => $data['book_id']
    ]);

    echo json_encode([
        'status' => 'success',
        'message' => 'Book copy inserted successfully',
        'copy_id' => $pdo->lastInsertId()
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}
?>
