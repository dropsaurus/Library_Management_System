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

    if (
        !isset($data['fname']) ||
        !isset($data['lname']) ||
        !isset($data['street']) ||
        !isset($data['city']) ||
        !isset($data['state']) ||
        !isset($data['country']) ||
        !isset($data['zipcode']) ||
        !isset($data['email'])
    ) {
        echo json_encode([
            'status' => 'error',
            'message' => 'Missing required fields'
        ]);
        exit;
    }

    $stmt = $pdo->prepare("
        INSERT INTO JPN_AUTHOR 
        (A_FNAME, A_LNAME, A_STREET, A_CITY, A_STATE, A_COUNTRY, A_ZIPCODE, A_EMAIL)
        VALUES (:fname, :lname, :street, :city, :state, :country, :zipcode, :email)
    ");

    $stmt->execute([
        ':fname'   => $data['fname'],
        ':lname'   => $data['lname'],
        ':street'  => $data['street'],
        ':city'    => $data['city'],
        ':state'   => $data['state'],
        ':country' => $data['country'],
        ':zipcode' => $data['zipcode'],
        ':email'   => $data['email']
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
