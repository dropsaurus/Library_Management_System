<?php
header("Content-Type: application/json");
require_once("../config/db.php");

// 获取顾客 ID
$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['CUST_ID'])) {
    http_response_code(400);
    echo json_encode([
        "status" => "error",
        "message" => "Missing CUST_ID"
    ]);
    exit();
}

try {
    $stmt = $pdo->prepare("
        SELECT 
            r.R_ID,
            r.R_STATUS,
            r.R_BORROWDATE,
            r.R_EX_RETURNDATE,
            r.R_AC_RETURNDATE,
            b.BOOK_NAME
        FROM JPN_RENTAL r
        JOIN JPN_COPIES c ON r.COPY_ID = c.COPY_ID
        JOIN JPN_BOOK b ON c.BOOK_ID = b.BOOK_ID
        WHERE r.CUST_ID = ?
        ORDER BY r.R_BORROWDATE DESC
    ");

    $stmt->execute([$data['CUST_ID']]);
    $history = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "status" => "success",
        "data" => $history
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage()
    ]);
}
?>
