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
    $query = "SELECT 
                r.RES_ID,
                r.RES_STARTTIME,
                r.RES_ENDTIME,
                r.RES_DESC,
                r.RES_COUNT,
                r.CUST_ID,
                CONCAT(c.CUST_FNAME, ' ', COALESCE(c.CUST_LNAME, '')) AS customer_name,
                r.ROOM_ID,
                ro.ROOM_CAPACITY
              FROM JPN_RESERVATION r
              JOIN JPN_CUSTOMER c ON r.CUST_ID = c.CUST_ID
              JOIN JPN_ROOM ro ON r.ROOM_ID = ro.ROOM_ID
              ORDER BY r.RES_STARTTIME DESC";

    $stmt = $pdo->prepare($query);
    $stmt->execute();
    $reservations = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'status' => 'success',
        'data' => $reservations
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}
