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

// Input validation - CUST_ID is user_id from localStorage
if (!isset($data['CUST_ID']) || !isset($data['E_ID'])) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Missing required fields.'
    ]);
    exit;
}

try {
    // Check if this exhibition exists
    $checkExh = $pdo->prepare("SELECT E_ID FROM JPN_EXHIBITION WHERE E_ID = :eid");
    $checkExh->execute([':eid' => $data['E_ID']]);
    
    if (!$checkExh->fetch()) {
        echo json_encode([
            'status' => 'error',
            'message' => 'Exhibition not found.'
        ]);
        exit;
    }
    
    // Check if the customer is already registered for this exhibition
    $checkReg = $pdo->prepare("SELECT REGISTRATION_ID FROM JPN_CUSTOMER_EXHIBITION 
                              WHERE CUST_ID = :custid AND E_ID = :eid");
    $checkReg->execute([
        ':custid' => $data['CUST_ID'],
        ':eid' => $data['E_ID']
    ]);
    
    if ($checkReg->fetch()) {
        echo json_encode([
            'status' => 'error',
            'message' => 'You are already registered for this exhibition.'
        ]);
        exit;
    }
    
    // Insert the registration
    $stmt = $pdo->prepare("INSERT INTO JPN_CUSTOMER_EXHIBITION (CUST_ID, E_ID) VALUES (:custid, :eid)");
    $stmt->execute([
        ':custid' => $data['CUST_ID'],
        ':eid' => $data['E_ID']
    ]);
    
    echo json_encode([
        'status' => 'success',
        'message' => 'Successfully registered for the exhibition.',
        'registration_id' => $pdo->lastInsertId()
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}
?> 