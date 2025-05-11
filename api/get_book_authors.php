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
            ba.BOOK_ID,
            b.BOOK_NAME,
            ba.A_ID,
            CONCAT(a.A_FNAME, ' ', COALESCE(a.A_LNAME, '')) AS author_name
        FROM JPN_BOOK_AUTHOR ba
        LEFT JOIN JPN_BOOK b ON ba.BOOK_ID = b.BOOK_ID
        LEFT JOIN JPN_AUTHOR a ON ba.A_ID = a.A_ID
        ORDER BY ba.BOOK_ID, ba.A_ID
    ";

    $stmt = $pdo->prepare($query);
    $stmt->execute();
    $bookAuthors = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'status' => 'success',
        'data' => $bookAuthors
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}
?>
