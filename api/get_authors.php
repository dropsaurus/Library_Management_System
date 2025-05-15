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
            a.A_ID,
            u.U_FNAME,
            u.U_LNAME,
            u.U_EMAIL,
            CONCAT(a.A_STREET, ', ', a.A_CITY, ', ', a.A_STATE, ', ', a.A_COUNTRY, ' ', a.A_ZIPCODE) AS FULL_ADDRESS
        FROM JPN_AUTHOR a
        JOIN JPN_USER u ON a.A_ID = u.U_ID
    ";

    $stmt = $pdo->prepare($query);
    $stmt->execute();
    $authors = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'status' => 'success',
        'data' => $authors
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}
