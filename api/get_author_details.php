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

// In a real implementation, you would get the author ID from the session
// For now, we'll accept it as a parameter (but in production, add proper validation)
$authorId = isset($_GET['author_id']) ? intval($_GET['author_id']) : 0;

if (!$authorId) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Author ID is required'
    ]);
    exit;
}

try {
    // Query to get author details from JPN_AUTHOR and JPN_USER tables
    $query = "
        SELECT 
            a.A_ID,
            u.U_FNAME AS A_FNAME,
            u.U_LNAME AS A_LNAME,
            u.U_EMAIL AS A_EMAIL,
            a.A_STREET,
            a.A_CITY,
            a.A_STATE,
            a.A_COUNTRY,
            a.A_ZIPCODE
        FROM JPN_AUTHOR a
        JOIN JPN_USER u ON a.A_ID = u.U_ID
        WHERE a.A_ID = :author_id
    ";

    $stmt = $pdo->prepare($query);
    $stmt->bindParam(':author_id', $authorId, PDO::PARAM_INT);
    $stmt->execute();
    
    $authorDetails = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($authorDetails) {
        echo json_encode([
            'status' => 'success',
            'data' => $authorDetails
        ]);
    } else {
        echo json_encode([
            'status' => 'error',
            'message' => 'Author not found'
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