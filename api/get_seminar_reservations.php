<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
require_once '../config/db_connect.php';

try {
    $stmt = $pdo->query("
        SELECT s.INVITATION_ID, u.U_FNAME, u.U_LNAME, e.E_NAME, e.E_STARTTIME
        FROM JPN_AUTHOR_SEMINAR s
        JOIN JPN_AUTHOR a ON s.A_ID = a.A_ID
        JOIN JPN_USER u ON a.A_ID = u.U_ID
        JOIN JPN_EVENT e ON s.E_ID = e.E_ID
        ORDER BY e.E_STARTTIME DESC
    ");
    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode(['status' => 'success', 'data' => $result]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
?>
