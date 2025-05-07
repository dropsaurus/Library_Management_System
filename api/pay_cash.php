<?php
header("Content-Type: application/json");
require_once("../config/db.php");

$data = json_decode(file_get_contents("php://input"), true);

if (
    !isset($data['INV_ID']) ||
    !isset($data['PAY_DATE']) ||
    !isset($data['PAY_AMOUNT'])
) {
    http_response_code(400);
    echo json_encode([
        "status" => "error",
        "message" => "Missing required fields"
    ]);
    exit();
}

try {
    $stmt = $pdo->prepare("CALL SP_INSERT_JPN_PAYMENT_CASH(?, ?, ?)");
    $stmt->execute([
        $data['INV_ID'],
        $data['PAY_DATE'],
        $data['PAY_AMOUNT']
    ]);

    echo json_encode([
        "status" => "success",
        "message" => "Cash payment processed successfully"
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage()
    ]);
}
?>
