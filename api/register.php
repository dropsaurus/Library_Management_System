<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}
require_once '../config/db_connect.php';


$data = json_decode(file_get_contents("php://input"), true);

if (
    !isset($data['CUST_FNAME']) ||
    !isset($data['CUST_LNAME']) ||
    !isset($data['CUST_PHONE']) ||
    !isset($data['CUST_EMAIL']) ||
    !isset($data['CUST_UID_TYPE']) ||
    !isset($data['CUST_UID_NO']) ||
    !isset($data['CUST_PASSWORD'])
) {
    http_response_code(400);
    echo json_encode([
        "status" => "error",
        "message" => "Missing required fields"
    ]);
    exit();
}

try {
    $checkStmt = $pdo->prepare("
        SELECT CUST_ID FROM JPN_CUSTOMER
        WHERE CUST_EMAIL = ? OR CUST_UID_NO = ?
    ");
    $checkStmt->execute([
        $data['CUST_EMAIL'],
        $data['CUST_UID_NO']
    ]);

    if ($checkStmt->fetch()) {
        http_response_code(409);
        echo json_encode([
            "status" => "error",
            "message" => "Customer already exists with same email or ID number"
        ]);
        exit();
    }

    $hashedPassword = password_hash($data['CUST_PASSWORD'], PASSWORD_DEFAULT);
    
    $stmt = $pdo->prepare("
        INSERT INTO JPN_CUSTOMER (
            CUST_FNAME, CUST_LNAME, CUST_PHONE,
            CUST_EMAIL, CUST_UID_TYPE, CUST_UID_NO, CUST_PASSWORD
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
    ");

    $stmt->execute([
        $data['CUST_FNAME'],
        $data['CUST_LNAME'],
        $data['CUST_PHONE'],
        $data['CUST_EMAIL'],
        $data['CUST_UID_TYPE'],
        $data['CUST_UID_NO'],
        $hashedPassword
    ]);

    echo json_encode([
        "status" => "success",
        "message" => "Customer registered successfully",
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
