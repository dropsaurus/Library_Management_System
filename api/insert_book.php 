<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once '../config/db_connect.php';

try {
    $data = json_decode(file_get_contents("php://input"), true);

    if (!isset($data['book_name']) || !isset($data['t_id']) || !isset($data['author_ids']) || !is_array($data['author_ids'])) {
        echo json_encode([
            'status' => 'error',
            'message' => 'Missing required fields: book_name, t_id, or author_ids'
        ]);
        exit;
    }

    $pdo->beginTransaction();

    $stmt = $pdo->prepare("INSERT INTO JPN_BOOK (BOOK_NAME, T_ID) VALUES (:book_name, :t_id)");
    $stmt->execute([
        ':book_name' => $data['book_name'],
        ':t_id' => $data['t_id']
    ]);

    $bookId = $pdo->lastInsertId();

    $stmt_author = $pdo->prepare("INSERT INTO JPN_BOOK_AUTHOR (BOOK_ID, A_ID) VALUES (:book_id, :a_id)");
    foreach ($data['author_ids'] as $authorId) {
        $stmt_author->execute([
            ':book_id' => $bookId,
            ':a_id' => $authorId
        ]);
    }

    $pdo->commit();

    echo json_encode([
        'status' => 'success',
        'message' => 'Book inserted successfully',
        'book_id' => $bookId
    ]);
} catch (PDOException $e) {
    $pdo->rollBack();
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}
?>
