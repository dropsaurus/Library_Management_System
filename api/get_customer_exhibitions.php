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
            ce.REGISTRATION_ID,
            ce.CUST_ID,
            CONCAT(c.CUST_FNAME, ' ', COALESCE(c.CUST_LNAME, '')) AS customer_name,
            ce.E_ID,
            e.E_NAME,
            e.E_STARTTIME,
            e.E_ENDTIME
        FROM JPN_CUSTOMER_EXHIBITION ce
        LEFT JOIN JPN_CUSTOMER c ON ce.CUST_ID = c.CUST_ID
        LEFT JOIN JPN_EVENT e ON ce.E_ID = e.E_ID
        ORDER BY ce.REGISTRATION_ID
    ";

    $stmt = $pdo->prepare($query);
    $stmt->execute();
    $registrations = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'status' => 'success',
        'data' => $registrations
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}
?>
