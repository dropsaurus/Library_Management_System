<?php
require_once "../config/db_connect.php";

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Check if ID was provided
if (!isset($_GET['id']) || empty($_GET['id'])) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Book ID is required'
    ]);
    exit;
}

$bookId = $_GET['id'];

// Prepare and execute the query
try {
    $stmt = $pdo->prepare("
        SELECT 
            b.BOOK_ID, 
            b.BOOK_NAME, 
            t.T_NAME as TOPIC_NAME,
            COUNT(CASE WHEN c.COPY_STATUS = 'AVAILABLE' THEN 1 END) as AVAILABLE_COPIES,
            GROUP_CONCAT(DISTINCT CONCAT(a.A_FNAME, ' ', a.A_LNAME) SEPARATOR ', ') as AUTHOR_NAME
        FROM JPN_BOOK b
        LEFT JOIN JPN_TOPIC t ON b.T_ID = t.T_ID
        LEFT JOIN JPN_COPIES c ON b.BOOK_ID = c.BOOK_ID
        LEFT JOIN JPN_BOOK_AUTHOR ba ON b.BOOK_ID = ba.BOOK_ID
        LEFT JOIN JPN_AUTHOR a ON ba.A_ID = a.A_ID
        WHERE b.BOOK_ID = :bookId
        GROUP BY b.BOOK_ID, b.BOOK_NAME, t.T_NAME
    ");
    
    $stmt->execute(['bookId' => $bookId]);
    $book = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($book) {
        echo json_encode([
            'status' => 'success',
            'book' => $book
        ]);
    } else {
        http_response_code(404);
        echo json_encode([
            'status' => 'error',
            'message' => 'Book not found'
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