<?php
header("Content-Type: application/json");
require_once("../config/db.php");

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['CUST_EMAIL']) || !isset($data['CUST_PASSWORD'])) {
    http_response_code(400);
    echo json_encode([
        "status" => "error",
        "message" => "Missing email or password"
    ]);
    exit();
}

try {
    $stmt = $pdo->prepare("
        SELECT CUST_ID, CUST_FNAME, CUST_LNAME, CUST_PASSWORD
        FROM JPN_CUSTOMER
        WHERE CUST_EMAIL = ?
        LIMIT 1
    ");
    $stmt->execute([$data['CUST_EMAIL']]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user && password_verify($data['CUST_PASSWORD'], $user['CUST_PASSWORD'])) {
        
        unset($user['CUST_PASSWORD']);
        echo json_encode([
            "status" => "success",
            "message" => "Login successful",
            "user" => $user
        ]);
    } else {
        http_response_code(401);
        echo json_encode([
            "status" => "error",
            "message" => "Invalid email or password"
        ]);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage()
    ]);
}
?>
