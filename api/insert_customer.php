<?php
header("Content-Type: application/json");
require_once("../config/db.php");

$data = json_decode(file_get_contents("php://input"), true);

if (
    !isset($data['CUST_FNAME']) || !isset($data['CUST_LNAME']) ||
    !isset($data['CUST_PHONE']) || !isset($data['CUST_EMAIL']) ||
    !isset($data['CUST_UID_TYPE']) || !isset($data['CUST_UID_NO'])
) {
    http_response_code(400);
    echo json_encode([
        "status" => "error",
        "message" => "Missing required fields"
    ]);
    exit();
}

try {
    $sql = "
        INSERT INTO JPN_CUSTOMER (
            CUST_FNAME, CUST_LNAME, CUST_PHONE, CUST_EMAIL, CUST_UID_TYPE, CUST_UID_NO
        ) VALUES (?, ?, ?, ?, ?, ?)
    ";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        $data['CUST_FNAME'],
        $data['CUST_LNAME'],
        $data['CUST_PHONE'],
        $data['CUST_EMAIL'],
        $data['CUST_UID_TYPE'],
        $data['CUST_UID_NO']
    ]);

    echo json_encode([
        "status" => "success",
        "message" => "Customer inserted successfully",
        "CUST_ID" => $pdo->lastInsertId()
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage()
    ]);
}
?>
