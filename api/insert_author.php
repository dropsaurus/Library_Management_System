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

try {
    $data = json_decode(file_get_contents("php://input"), true);

    // Required field check
    $required = ['fname', 'lname', 'phone', 'email', 'password', 'street', 'city', 'state', 'country', 'zipcode'];
    foreach ($required as $field) {
        if (empty($data[$field])) {
            echo json_encode([
                'status' => 'error',
                'message' => "Missing field: $field"
            ]);
            exit;
        }
    }

    $stmt = $pdo->prepare("CALL SP_INSERT_JPN_USER_AUTHOR(
        :fname,
        :lname,
        :phone,
        :email,
        :pwd,
        :street,
        :city,
        :state,
        :country,
        :zipcode
    )");

    $stmt->execute([
        ':fname'   => $data['fname'],
        ':lname'   => $data['lname'],
        ':phone'   => $data['phone'],
        ':email'   => $data['email'],
        ':pwd'     => $data['password'],
        ':street'  => $data['street'],
        ':city'    => $data['city'],
        ':state'   => $data['state'],
        ':country' => $data['country'],
        ':zipcode' => $data['zipcode']
    ]);

    echo json_encode([
        'status' => 'success',
        'message' => 'Author inserted successfully'
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}
