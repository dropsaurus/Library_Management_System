<?php
header("Content-Type: application/json");
require_once("../config/db.php");

try {
    $sql = "
        SELECT 
            r.R_ID,
            r.R_STATUS,
            r.R_BORROWDATE,
            r.R_EX_RETURNDATE,
            r.R_AC_RETURNDATE,
            c.CUST_FNAME,
            c.CUST_LNAME,
            b.BOOK_NAME
        FROM JPN_RENTAL r
        JOIN JPN_CUSTOMER c ON r.CUST_ID = c.CUST_ID
        JOIN JPN_COPIES cp ON r.COPY_ID = cp.COPY_ID
        JOIN JPN_BOOK b ON cp.BOOK_ID = b.BOOK_ID
        ORDER BY r.R_BORROWDATE DESC
    ";

    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    $rentals = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "status" => "success",
        "data" => $rentals
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage()
    ]);
}
?>
