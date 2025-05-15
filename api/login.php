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

require_once __DIR__ . '/../config/db_connect.php';

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
    // Get user information from the new JPN_USER table
    $stmt = $pdo->prepare("
        SELECT u.U_ID, u.U_FNAME, u.U_LNAME, u.U_PWD_HASH, r.ROLE_NAME 
        FROM JPN_USER u
        JOIN JPN_USER_ROLE ur ON u.U_ID = ur.U_ID
        JOIN JPN_ROLE r ON ur.ROLE_ID = r.ROLE_ID
        WHERE u.U_EMAIL = :email
    ");
    $stmt->execute([':email' => $email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    // Check if user exists and password is correct
    // Note: Password is now stored as SHA-256 hash in binary format
    if ($user && hash_equals($user['U_PWD_HASH'], hex2bin(hash('sha256', $password)))) {
        // Set session variables
        $_SESSION['USER_ID'] = $user['U_ID'];
        $_SESSION['ROLE'] = $user['ROLE_NAME'];

        // Set redirect based on role
        $redirect = 'pages/customer_dashboard.html';
        if ($user['ROLE_NAME'] === 'EMPLOYEE') {
            $redirect = 'pages/employee_dashboard.html';
        }

        // Check if user is also an author for additional privileges
        $isAuthor = false;
        $isSponsor = false;
        
        $authorCheck = $pdo->prepare("SELECT 1 FROM JPN_AUTHOR WHERE A_ID = :uid");
        $authorCheck->execute([':uid' => $user['U_ID']]);
        if ($authorCheck->fetch()) {
            $isAuthor = true;
        }

        // Return user information
        echo json_encode([
            'status' => 'success',
            'user_id' => $user['U_ID'],
            'user_fname' => $user['U_FNAME'],
            'user_lname' => $user['U_LNAME'],
            'role' => $user['ROLE_NAME'],
            'is_author' => $isAuthor,
            'is_sponsor' => $isSponsor,
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
