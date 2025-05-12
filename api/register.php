<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once '../config/db_connect.php';

$data = json_decode(file_get_contents("php://input"), true);

if (
    !isset($data['USER_FNAME']) ||
    !isset($data['USER_LNAME']) ||
    !isset($data['USER_EMAIL']) ||
    !isset($data['USER_PHONE']) ||
    !isset($data['USER_UID_TYPE']) ||
    !isset($data['USER_UID_NO']) ||
    !isset($data['USER_PASSWORD']) ||
    !isset($data['ROLE'])
) {
    http_response_code(400);
    echo json_encode([
        "status" => "error",
        "message" => "Missing required fields"
    ]);
    exit();
}

try {
    $checkStmt = $pdo->prepare("SELECT USER_ID FROM JPN_USER WHERE USER_EMAIL = ?");
    $checkStmt->execute([$data['USER_EMAIL']]);
    if ($checkStmt->fetch()) {
        http_response_code(409);
        echo json_encode([
            "status" => "error",
            "message" => "Email already registered"
        ]);
        exit();
    }

    $hashedPassword = password_hash($data['USER_PASSWORD'], PASSWORD_DEFAULT);

    $stmt = $pdo->prepare("
        INSERT INTO JPN_USER (
            USER_FNAME, USER_LNAME, USER_EMAIL, USER_PHONE,
            USER_UID_TYPE, USER_UID_NO, USER_PASSWORD, ROLE
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ");

    $stmt->execute([
        $data['USER_FNAME'],
        $data['USER_LNAME'],
        $data['USER_EMAIL'],
        $data['USER_PHONE'],
        $data['USER_UID_TYPE'],
        $data['USER_UID_NO'],
        $hashedPassword,
        $data['ROLE']
    ]);

    echo json_encode([
        "status" => "success",
        "message" => "User registered successfully",
        "USER_ID" => $pdo->lastInsertId()
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => "Server error"
    ]);
}
?>
