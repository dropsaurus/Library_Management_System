<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
require_once '../config/db_connect.php';

try {
    $stmt = $pdo->query("
        SELECT 
            r.REGISTRATION_ID,
            u.U_FNAME AS CUST_FNAME,
            u.U_LNAME AS CUST_LNAME,
            e.E_NAME,
            e.E_STARTTIME
        FROM JPN_CUSTOMER_EXHIBITION r
        JOIN JPN_CUSTOMER c ON r.CUST_ID = c.CUST_ID
        JOIN JPN_USER u ON c.CUST_ID = u.U_ID
        JOIN JPN_EVENT e ON r.E_ID = e.E_ID
        ORDER BY e.E_STARTTIME DESC
    ");
    
    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode(['status' => 'success', 'data' => $result]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
?>
