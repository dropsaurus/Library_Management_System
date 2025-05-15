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

        // Check all roles of the user to determine the appropriate dashboard
        // Get all roles for this user
        $rolesStmt = $pdo->prepare("
            SELECT r.ROLE_NAME 
            FROM JPN_USER_ROLE ur
            JOIN JPN_ROLE r ON ur.ROLE_ID = r.ROLE_ID
            WHERE ur.U_ID = :uid
        ");
        $rolesStmt->execute([':uid' => $user['U_ID']]);
        $roles = $rolesStmt->fetchAll(PDO::FETCH_COLUMN);
        
        // Set redirect based on role priority: Employee > Author > Customer
        // Using relative paths without leading slash
        $redirect = '../pages/employee_dashboard.html'; // Default
        
        if (in_array('EMPLOYEE', $roles)) {
            $redirect = '../pages/employee_dashboard.html';
        } elseif (in_array('AUTHOR', $roles)) {
            $redirect = '../pages/author_dashboard.html';
        } elseif (in_array('CUSTOMER', $roles)) {
            $redirect = '../pages/customer_dashboard.html';
        }

        // Check if user is also an author for additional privileges (for UI customization)
        $isAuthor = in_array('AUTHOR', $roles);
        $isSponsor = false; // Could add similar check for sponsor role if needed

        // Log the values for debugging
        error_log("User roles: " . implode(", ", $roles));
        error_log("Redirect path: $redirect");

        // Return user information
        echo json_encode([
            'status' => 'success',
            'user_id' => $user['U_ID'],
            'user_fname' => $user['U_FNAME'],
            'user_lname' => $user['U_LNAME'],
            'role' => $user['ROLE_NAME'],
            'all_roles' => $roles,
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
    error_log("Login error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Server error: ' . $e->getMessage()
    ]);
}
