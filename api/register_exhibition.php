<?php
header("Content-Type: application/json");
require_once("../config/db.php");

$data = json_decode(file_get_contents("php://input"), true);

if (
    !isset($data['CUST_ID']) ||
    !isset($data['E_ID'])
) {
    http_response_code(400);
    echo json_encode([
        "status" => "error",
        "message" => "Missing CUST_ID or E_ID"
    ]);
    exit();
}

try {
    $stmt = $pdo->prepare("
        INSERT INTO JPN_CUSTOMER_EXHIBITION (CUST_ID, E_ID)
        VALUES (?, ?)
    ");
    $stmt->execute([
        $data['CUST_ID'],
        $data['E_ID']
    ]);

    echo json_encode([
        "status" => "success",
        "message" => "Customer registered for exhibition",
        "REGISTRATION_ID" => $pdo->lastInsertId()
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage()
    ]);
}
?>
