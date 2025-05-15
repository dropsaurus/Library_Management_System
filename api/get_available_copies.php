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
    // This query selects book copies that are not currently rented (status = 'available')
    // or are not in the rental table at all
    $query = "
        SELECT 
            c.COPY_ID,
            c.COPY_STATUS,
            b.BOOK_ID,
            b.BOOK_NAME,
            b.BOOK_ISBN
        FROM JPN_COPIES c
        JOIN JPN_BOOK b ON c.BOOK_ID = b.BOOK_ID
        WHERE c.COPY_STATUS = 'available'
        AND NOT EXISTS (
            SELECT 1 FROM JPN_RENTAL r 
            WHERE r.COPY_ID = c.COPY_ID 
            AND r.R_STATUS = 'active'
            AND r.R_AC_RETURNDATE IS NULL
        )
        ORDER BY b.BOOK_NAME
    ";

    $stmt = $pdo->prepare($query);
    $stmt->execute();
    $copies = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if (count($copies) > 0) {
        echo json_encode([
            'status' => 'success',
            'data' => $copies
        ]);
    } else {
        echo json_encode([
            'status' => 'success',
            'message' => 'No available book copies found',
            'data' => []
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