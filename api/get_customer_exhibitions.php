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

// Input validation - use customer_id from query parameter, which is user_id from localStorage
if (!isset($_GET['customer_id'])) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Missing required parameter: customer_id'
    ]);
    exit;
}

$customerId = $_GET['customer_id'];

try {
    $query = "
        SELECT 
            ce.REGISTRATION_ID,
            ce.CUST_ID,
            ce.E_ID,
            e.E_NAME,
            e.E_STARTTIME,
            e.E_ENDTIME,
            t.T_NAME as TOPIC_NAME,
            ex.EXPENSE
        FROM JPN_CUSTOMER_EXHIBITION ce
        JOIN JPN_EVENT e ON ce.E_ID = e.E_ID
        JOIN JPN_EXHIBITION ex ON e.E_ID = ex.E_ID
        JOIN JPN_TOPIC t ON e.T_ID = t.T_ID
        WHERE ce.CUST_ID = :customer_id
        ORDER BY e.E_STARTTIME DESC
    ";

    $stmt = $pdo->prepare($query);
    $stmt->execute([':customer_id' => $customerId]);
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
