<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

session_start();
require_once '../config/db_connect.php';

if (!isset($_SESSION['USER_ID'])) {
    echo json_encode([
        'status' => 'error',
        'message' => 'User not logged in.'
    ]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

if (
    !isset($data['CUST_FNAME']) || !isset($data['CUST_EMAIL']) || !isset($data['CUST_PHONE'])
) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Missing required fields.'
    ]);
    exit;
}

$fname = $data['CUST_FNAME'];
$lname = $data['CUST_LNAME'] ?? null; // optional
$email = $data['CUST_EMAIL'];
$phone = $data['CUST_PHONE'];

try {
    // Update USER table
    $query = "UPDATE JPN_USER 
              SET USER_FNAME = ?, USER_LNAME = ?, USER_EMAIL = ?, USER_PHONE = ?
              WHERE USER_ID = ?";
    $stmt = $pdo->prepare($query);
    $stmt->execute([$fname, $lname, $email, $phone, $_SESSION['USER_ID']]);

    echo json_encode([
        'status' => 'success',
        'message' => 'Profile updated successfully.'
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}
?>
