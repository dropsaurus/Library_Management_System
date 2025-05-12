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

if (!isset($data['email']) || !isset($data['password'])) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Missing email or password'
    ]);
    exit;
}

$email = strtolower(trim($data['email']));
$password = $data['password'];

try {
    $stmt = $pdo->prepare("SELECT USER_ID, USER_PASSWORD, ROLE FROM JPN_USER WHERE USER_EMAIL = :email");
    $stmt->execute([':email' => $email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user && password_verify($password, $user['USER_PASSWORD'])) {
        $redirect = ($user['ROLE'] === 'employee') 
            ? 'employee_page.html' 
            : 'customer_page.html';

        echo json_encode([
            'status' => 'success',
            'user_id' => $user['USER_ID'],
            'role' => $user['ROLE'],
            'redirect' => $redirect
        ]);
    } else {
        echo json_encode([
            'status' => 'error',
            'message' => 'Invalid email or password'
        ]);
    }
} catch (Exception $e) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Server error'
    ]);
}
