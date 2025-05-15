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

// Use correct parameter name: E_ID
if (!isset($_GET['E_ID'])) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Missing required parameter: E_ID'
    ]);
    exit;
}

$e_id = $_GET['E_ID'];

try {
    $query = "SELECT 
                e.E_ID,
                e.E_NAME,
                e.E_STARTTIME,
                e.E_ENDTIME,
                e.T_ID,
                t.T_NAME AS topic_name,
                ex.EXPENSE
              FROM JPN_EVENT e
              JOIN JPN_EXHIBITION ex ON e.E_ID = ex.E_ID
              JOIN JPN_TOPIC t ON e.T_ID = t.T_ID
              WHERE e.E_ID = :eid AND e.E_TYPE = 'E'";

    $stmt = $pdo->prepare($query);
    $stmt->execute([':eid' => $e_id]);
    $exhibition = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($exhibition) {
        echo json_encode([
            'status' => 'success',
            'data' => $exhibition
        ]);
    } else {
        echo json_encode([
            'status' => 'error',
            'message' => 'Exhibition not found'
        ]);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}
?>
