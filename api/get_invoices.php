<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}
require_once '../config/db_connect.php';

try {
    $sql = "
        SELECT 
            i.INV_ID,
            i.INV_DATE,
            i.INV_AMOUNT,
            r.R_ID,
            r.R_STATUS,
            c.CUST_FNAME,
            c.CUST_LNAME,
            b.BOOK_NAME
        FROM JPN_INVOICE i
        JOIN JPN_RENTAL r ON i.R_ID = r.R_ID
        JOIN JPN_CUSTOMER c ON r.CUST_ID = c.CUST_ID
        JOIN JPN_COPIES cp ON r.COPY_ID = cp.COPY_ID
        JOIN JPN_BOOK b ON cp.BOOK_ID = b.BOOK_ID
        ORDER BY i.INV_DATE DESC
    ";

    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    $invoices = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "status" => "success",
        "data" => $invoices
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage()
    ]);
}
?>
