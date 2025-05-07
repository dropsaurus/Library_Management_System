<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');

require_once '../config/db_connect.php';

try {
    // Query to get books with their authors and topics
    $query = "SELECT 
                b.BOOK_ID,
                b.BOOK_NAME,
                t.T_NAME as topic_name,
                GROUP_CONCAT(CONCAT(a.A_FNAME, ' ', COALESCE(a.A_LNAME, '')) SEPARATOR ', ') as authors,
                COUNT(DISTINCT c.COPY_ID) as total_copies,
                SUM(CASE WHEN c.COPY_STATUS = 'AVAILABLE' THEN 1 ELSE 0 END) as available_copies
              FROM JPN_BOOK b
              LEFT JOIN JPN_TOPIC t ON b.T_ID = t.T_ID
              LEFT JOIN JPN_BOOK_AUTHOR ba ON b.BOOK_ID = ba.BOOK_ID
              LEFT JOIN JPN_AUTHOR a ON ba.A_ID = a.A_ID
              LEFT JOIN JPN_COPIES c ON b.BOOK_ID = c.BOOK_ID
              GROUP BY b.BOOK_ID, b.BOOK_NAME, t.T_NAME";
    
    $stmt = $pdo->prepare($query);
    $stmt->execute();
    $books = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Format the response
    $formatted_books = array_map(function($book) {
        return [
            'id' => $book['BOOK_ID'],
            'title' => $book['BOOK_NAME'],
            'authors' => $book['authors'],
            'topic' => $book['topic_name'],
            'total_copies' => $book['total_copies'],
            'available_copies' => $book['available_copies'],
            'status' => $book['available_copies'] > 0 ? 'Available' : 'Not Available'
        ];
    }, $books);

    echo json_encode([
        'status' => 'success',
        'data' => $formatted_books
    ]);

} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}
?> 
>>>>>>> Pradeep
