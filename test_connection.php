<?php
require_once 'config/db_connect.php';

echo "Testing database connection...\n";

try {
    // Test 1: Basic connection
    echo "Test 1: Basic connection - ";
    if ($pdo) {
        echo "SUCCESS\n";
    }

    // Test 2: Fetch topics
    echo "Test 2: Fetching topics - ";
    $query = "SELECT COUNT(*) as count FROM JPN_TOPIC";
    $stmt = $pdo->query($query);
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    echo "Found " . $result['count'] . " topics\n";

    // Test 3: Fetch books
    echo "Test 3: Fetching books - ";
    $query = "SELECT COUNT(*) as count FROM JPN_BOOK";
    $stmt = $pdo->query($query);
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    echo "Found " . $result['count'] . " books\n";

    // Test 4: Complex book query
    echo "Test 4: Testing complex book query - ";
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
              GROUP BY b.BOOK_ID, b.BOOK_NAME, t.T_NAME
              LIMIT 1";
    $stmt = $pdo->query($query);
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    if ($result) {
        echo "SUCCESS\n";
        echo "Sample book data:\n";
        print_r($result);
    } else {
        echo "No books found\n";
    }

} catch(PDOException $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
}
?>