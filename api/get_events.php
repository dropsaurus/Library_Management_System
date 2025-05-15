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

try {
    $sql = "
        SELECT 
            e.E_ID,
            e.E_NAME,
            e.E_STARTTIME,
            e.E_ENDTIME,
            e.E_TYPE,
            t.T_NAME AS TOPIC_NAME,
            CASE 
                WHEN e.E_TYPE = 'E' THEN ex.EXPENSE
                ELSE NULL
            END AS EXPENSE,
            CASE 
                WHEN e.E_TYPE = 'S' THEN s.SPEAKER_FNAME
                ELSE NULL
            END AS SPEAKER_FNAME,
            CASE 
                WHEN e.E_TYPE = 'S' THEN s.SPEAKER_LNAME
                ELSE NULL
            END AS SPEAKER_LNAME
        FROM JPN_EVENT e
        JOIN JPN_TOPIC t ON e.T_ID = t.T_ID
        LEFT JOIN JPN_EXHIBITION ex ON e.E_ID = ex.E_ID AND e.E_TYPE = 'E'
        LEFT JOIN JPN_SEMINAR s ON e.E_ID = s.E_ID AND e.E_TYPE = 'S'
        ORDER BY e.E_STARTTIME DESC
    ";

    $stmt = $pdo->prepare($sql);
    $stmt->execute();

    $events = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "status" => "success",
        "data" => $events
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage()
    ]);
}
?>
