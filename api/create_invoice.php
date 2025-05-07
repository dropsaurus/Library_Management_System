<?php
header("Content-Type: application/json");
require_once("../config/db.php");

$data = json_decode(file_get_contents("php://input"), true);

if (
    !isset($data['R_ID']) ||
    !isset($data['INV_DATE']) ||
    !isset($data['INV_AMOUNT'])
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
        INSERT INTO JPN_INVOICE (
            INV_DATE, INV_AMOUNT, R_ID
        ) VALUES (?, ?, ?)
    ";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        $data['INV_DATE'],
        $data['INV_AMOUNT'],
        $data['R_ID']
    ]);

    echo json_encode([
        "status" => "success",
        "message" => "Invoice created successfully",
        "INV_ID" => $pdo->lastInsertId()
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage()
    ]);
}
?>
