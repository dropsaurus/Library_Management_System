<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

session_start();

// Handle preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once '../config/db_connect.php';

// Check if user is logged in and has customer role
if (!isset($_SESSION['USER_ID']) || $_SESSION['ROLE'] !== 'CUSTOMER') {
    http_response_code(401);
    echo json_encode([
        "status" => "error",
        "message" => "Unauthorized access"
    ]);
    exit;
}

try {
    // First check if customer has any rentals
    $checkSql = "SELECT COUNT(*) as count FROM JPN_RENTAL WHERE CUST_ID = :user_id";
    $checkStmt = $pdo->prepare($checkSql);
    $checkStmt->execute([':user_id' => $_SESSION['USER_ID']]);
    $count = $checkStmt->fetch(PDO::FETCH_ASSOC)['count'];

    if ($count == 0) {
        echo json_encode([
            "status" => "success",
            "data" => [],
            "message" => "No rental records found"
        ]);
        exit;
    }

    $sql = "
        SELECT 
            r.R_ID,
            r.R_STATUS,
            r.R_BORROWDATE,
            r.R_EX_RETURNDATE,
            r.R_AC_RETURNDATE,
            b.BOOK_NAME
        FROM JPN_RENTAL r
        JOIN JPN_COPIES cp ON r.COPY_ID = cp.COPY_ID
        JOIN JPN_BOOK b ON cp.BOOK_ID = b.BOOK_ID
        WHERE r.CUST_ID = :user_id
        ORDER BY r.R_BORROWDATE DESC
    ";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([':user_id' => $_SESSION['USER_ID']]);
    $rentals = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "status" => "success",
        "data" => $rentals
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => "Database error: " . $e->getMessage()
    ]);
}
?>
