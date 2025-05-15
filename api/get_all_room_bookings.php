<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

require_once '../config/db_connect.php';

try {
    $query = "SELECT 
                rb.RES_ID,
                r.ROOM_ID,
                CONCAT(u.U_FNAME, ' ', u.U_LNAME) AS CUSTOMER_NAME,
                rb.RES_STARTTIME,
                rb.RES_ENDTIME,
                rb.RES_DESC,
                rb.RES_COUNT
              FROM JPN_RESERVATION rb
              JOIN JPN_ROOM r ON rb.ROOM_ID = r.ROOM_ID
              JOIN JPN_USER u ON rb.CUST_ID = u.U_ID
              ORDER BY rb.RES_STARTTIME DESC";

    $stmt = $pdo->query($query);
    $bookings = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $currentDateTime = date('Y-m-d H:i:s');

    foreach ($bookings as &$booking) {
        if ($booking['RES_STARTTIME'] > $currentDateTime) {
            $booking['status'] = 'upcoming';
        } else if ($booking['RES_ENDTIME'] < $currentDateTime) {
            $booking['status'] = 'completed';
        } else {
            $booking['status'] = 'ongoing';
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
