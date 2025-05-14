<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

session_start();
require_once '../config/db_connect.php';

if (!isset($_SESSION['CUST_ID'])) {
    echo json_encode([
        'status' => 'error',
        'message' => 'User not logged in'
    ]);
    exit;
}

try {
    $query = "SELECT er.*, e.EVENT_NAME, e.EVENT_DATE, e.EVENT_TIME, e.LOCATION 
              FROM JPN_EVENT_REGISTRATION er
              JOIN JPN_EVENT e ON er.EVENT_ID = e.EVENT_ID
              WHERE er.CUST_ID = ?
              ORDER BY e.EVENT_DATE DESC, e.EVENT_TIME DESC";
    
    $stmt = $pdo->prepare($query);
    $stmt->execute([$_SESSION['CUST_ID']]);
    $registrations = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Process registrations to add status
    $currentDate = date('Y-m-d');
    $currentTime = date('H:i:s');
    
    foreach ($registrations as &$registration) {
        if ($registration['IS_CANCELLED']) {
            $registration['status'] = 'cancelled';
        } else if ($registration['EVENT_DATE'] > $currentDate || 
                  ($registration['EVENT_DATE'] == $currentDate && $registration['EVENT_TIME'] > $currentTime)) {
            $registration['status'] = 'upcoming';
        } else {
            $registration['status'] = 'completed';
        }
    }

    echo json_encode([
        'status' => 'success',
        'data' => $registrations
    ]);

} catch (PDOException $e) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}
?> 