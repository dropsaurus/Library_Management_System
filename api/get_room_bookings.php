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
    $query = "SELECT rb.*, sr.ROOM_NUMBER 
              FROM JPN_ROOM_BOOKING rb
              JOIN JPN_STUDY_ROOM sr ON rb.ROOM_ID = sr.ROOM_ID
              WHERE rb.CUST_ID = ?
              ORDER BY rb.BOOKING_DATE DESC, rb.START_TIME DESC";
    
    $stmt = $pdo->prepare($query);
    $stmt->execute([$_SESSION['CUST_ID']]);
    $bookings = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Process bookings to add status
    $currentDate = date('Y-m-d');
    $currentTime = date('H:i:s');
    
    foreach ($bookings as &$booking) {
        if ($booking['IS_CANCELLED']) {
            $booking['status'] = 'cancelled';
        } else if ($booking['BOOKING_DATE'] > $currentDate || 
                  ($booking['BOOKING_DATE'] == $currentDate && $booking['START_TIME'] > $currentTime)) {
            $booking['status'] = 'upcoming';
        } else {
            $booking['status'] = 'completed';
        }
    }

    echo json_encode([
        'status' => 'success',
        'data' => $bookings
    ]);

} catch (PDOException $e) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}
?> 