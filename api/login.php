<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

session_start();
// Handle preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once '../config/db_connect.php';

$data = json_decode(file_get_contents("php://input"), true);

// Input validation
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
    // Retrieve user info from JPN_USER
    $stmt = $pdo->prepare("SELECT USER_ID, USER_FNAME, USER_LNAME, USER_PASSWORD, ROLE FROM JPN_USER WHERE USER_EMAIL = :email");
    $stmt->execute([':email' => $email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user && password_verify($password, $user['USER_PASSWORD'])) {
        $_SESSION['USER_ID'] = $user['USER_ID'];
        $_SESSION['ROLE'] = $user['ROLE'];

        if ($user['ROLE'] === 'customer') {
        $_SESSION['CUST_ID'] = $user['USER_ID'];
        }

        $redirect = ($user['ROLE'] === 'employee') 
        ? 'employee_dashboard.html' 
        : 'customer_dashboard.html';

        $redirect = ($user['ROLE'] === 'employee') 
        ? 'employee_dashboard.html' 
        : 'customer_dashboard.html';

        echo json_encode([
        'status' => 'success',
        'user_id' => $user['USER_ID'],
        'user_fname' => $user['USER_FNAME'],
        'user_lname' => $user['USER_LNAME'],
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
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Server error: ' . $e->getMessage()
    ]);
}
