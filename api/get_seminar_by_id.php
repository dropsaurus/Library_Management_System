<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once '../config/db_connect.php';

// Check if e_id is provided
if (!isset($_GET['e_id'])) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Missing required parameter: e_id'
    ]);
    exit;
}

$e_id = $_GET['e_id'];

try {
    $query = "SELECT 
                e.E_ID,
                e.E_NAME,
                e.E_STARTTIME,
                e.E_ENDTIME,
                e.T_ID,
                t.T_NAME AS topic_name,
                s.SPEAKER_FNAME,
                s.SPEAKER_LNAME
              FROM JPN_EVENT e
              JOIN JPN_SEMINAR s ON e.E_ID = s.E_ID
              JOIN JPN_TOPIC t ON e.T_ID = t.T_ID
              WHERE e.E_ID = :eid AND e.E_TYPE = 'S'";

    $stmt = $pdo->prepare($query);
    $stmt->execute([':eid' => $e_id]);
    $seminar = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($seminar) {
        echo json_encode([
            'status' => 'success',
            'data' => $seminar
        ]);
    } else {
        echo json_encode([
            'status' => 'error',
            'message' => 'Seminar not found'
        ]);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}
