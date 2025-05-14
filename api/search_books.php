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

// Initialize parameters with default values
$searchTerm = isset($_GET['query']) ? $_GET['query'] : '';
$category = isset($_GET['category']) ? $_GET['category'] : '';
$availability = isset($_GET['availability']) ? $_GET['availability'] : '';

try {
    // Build the SQL query with conditional filters
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
        WHERE 1=1
    ";
    
    $params = [];
    
    // Add search term filter if provided
    if (!empty($searchTerm)) {
        $sql .= " AND (
            b.BOOK_NAME LIKE :searchTerm 
            OR CONCAT(a.A_FNAME, ' ', a.A_LNAME) LIKE :searchTerm
        )";
        $params['searchTerm'] = "%$searchTerm%";
    }
    
    // Add category filter if provided
    if (!empty($category)) {
        $sql .= " AND b.T_ID = :category";
        $params['category'] = $category;
    }
    
    // Group by to avoid duplicate results
    $sql .= " GROUP BY b.BOOK_ID, b.BOOK_NAME, t.T_NAME";
    
    // Add availability filter if provided
    if ($availability === 'available') {
        $sql .= " HAVING AVAILABLE_COPIES > 0";
    } else if ($availability === 'borrowed') {
        $sql .= " HAVING AVAILABLE_COPIES = 0";
    }
    
    // Add order and limit
    $sql .= " ORDER BY b.BOOK_ID DESC LIMIT 20";
    
    // Prepare and execute the statement
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $books = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode([
        'status' => 'success',
        'books' => $books,
        'total' => count($books)
    ]);
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}
?> 