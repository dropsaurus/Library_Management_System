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

try {
    $query = "
        SELECT 
            ss.SP_ID,
            CONCAT(s.SP_FNAME, ' ', COALESCE(s.SP_LNAME, '')) AS sponsor_name,
            ss.E_ID,
            e.E_NAME,
            ss.AMOUNT
        FROM JPN_SPONSOR_SEMINAR ss
        LEFT JOIN JPN_SPONSOR s ON ss.SP_ID = s.SP_ID
        LEFT JOIN JPN_EVENT e ON ss.E_ID = e.E_ID
        ORDER BY ss.SP_ID, ss.E_ID
    ";

    $stmt = $pdo->prepare($query);
    $stmt->execute();
    $sponsorSeminars = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'status' => 'success',
        'data' => $sponsorSeminars
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}
?>
