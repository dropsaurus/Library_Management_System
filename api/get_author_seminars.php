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
            asr.INVITATION_ID,
            a.A_ID,
            CONCAT(a.A_FNAME, ' ', COALESCE(a.A_LNAME, '')) AS author_name,
            asr.E_ID,
            e.E_NAME
        FROM JPN_AUTHOR_SEMINAR asr
        LEFT JOIN JPN_AUTHOR a ON asr.A_ID = a.A_ID
        LEFT JOIN JPN_EVENT e ON asr.E_ID = e.E_ID
        ORDER BY asr.INVITATION_ID
    ";

    $stmt = $pdo->prepare($query);
    $stmt->execute();
    $authorSeminars = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'status' => 'success',
        'data' => $authorSeminars
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}
?>
