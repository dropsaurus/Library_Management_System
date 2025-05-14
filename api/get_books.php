<?php
require_once __DIR__ . "/../config/db_connect.php";

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Check if we only want counts
$countOnly = isset($_GET['countOnly']) && $_GET['countOnly'] === 'true';
$availability = isset($_GET['availability']) ? $_GET['availability'] : '';

try {
    if ($countOnly) {
        // Build the SQL query for count based on availability
        if ($availability === 'available') {
            // Count distinct books that have at least one available copy
            $sql = "SELECT COUNT(DISTINCT b.BOOK_ID) 
                   FROM JPN_BOOK b 
                   JOIN JPN_COPIES c ON b.BOOK_ID = c.BOOK_ID 
                   WHERE c.COPY_STATUS = 'AVAILABLE'";
        } else if ($availability === 'borrowed') {
            // Count distinct books that have copies but none are available
            $sql = "SELECT COUNT(DISTINCT b.BOOK_ID) 
                   FROM JPN_BOOK b 
                   JOIN JPN_COPIES c ON b.BOOK_ID = c.BOOK_ID 
                   WHERE b.BOOK_ID NOT IN (
                       SELECT DISTINCT b2.BOOK_ID 
                       FROM JPN_BOOK b2 
                       JOIN JPN_COPIES c2 ON b2.BOOK_ID = c2.BOOK_ID 
                       WHERE c2.COPY_STATUS = 'AVAILABLE'
                   )";
        } else {
            // Count all books
            $sql = "SELECT COUNT(*) FROM JPN_BOOK";
        }
        
        $stmt = $pdo->query($sql);
        $count = $stmt->fetchColumn();
        
        echo json_encode([
            'status' => 'success',
            'count' => $count
        ]);
        
    } else {
        // Get books with details
        $sql = "
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
            GROUP BY b.BOOK_ID, b.BOOK_NAME, t.T_NAME
        ";
        
        // Add availability filter if provided
        if ($availability === 'available') {
            $sql .= " HAVING AVAILABLE_COPIES > 0";
        } else if ($availability === 'borrowed') {
            $sql .= " HAVING AVAILABLE_COPIES = 0";
        }
        
        // Add order and limit
        $sql .= " ORDER BY b.BOOK_ID DESC LIMIT 20";
        
        $stmt = $pdo->query($sql);
        $books = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        echo json_encode([
            'status' => 'success',
            'books' => $books,
            'total' => count($books)
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
