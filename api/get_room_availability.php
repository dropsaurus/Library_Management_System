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

// Get filter parameters
$capacity = isset($_GET['capacity']) ? (int)$_GET['capacity'] : 0;
$searchTerm = isset($_GET['search']) ? $_GET['search'] : '';
$date = isset($_GET['date']) ? $_GET['date'] : date('Y-m-d'); // Default to today
$time = isset($_GET['time']) ? $_GET['time'] : date('H:i:s'); // Default to now

try {
    // Base query to get rooms with their capacity and availability status
    $query = "SELECT 
                r.ROOM_ID,
                r.ROOM_CAPACITY,
                -- Check if there are any reservations that conflict with the requested time
                CASE WHEN EXISTS (
                    SELECT 1 
                    FROM JPN_RESERVATION res
                    WHERE res.ROOM_ID = r.ROOM_ID
                    AND res.RES_STARTTIME <= ? 
                    AND res.RES_ENDTIME >= ?
                ) THEN 'Not Available' ELSE 'Available' END AS STATUS
              FROM JPN_ROOM r
              WHERE 1=1";
    
    $params = [];
    
    // For date and time, create a datetime string
    $datetime = $date . ' ' . ($time ?: '00:00:00');
    $params[] = $datetime;
    $params[] = $datetime;
    
    // Add capacity filter if specified
    if ($capacity > 0) {
        $query .= " AND r.ROOM_CAPACITY < ?";
        $params[] = $capacity;
    }
    
    // Add search filter if specified
    if (!empty($searchTerm)) {
        $query .= " AND r.ROOM_ID LIKE ?";
        $params[] = "%$searchTerm%";
    }
    
    $query .= " ORDER BY r.ROOM_ID";
    
    $stmt = $pdo->prepare($query);
    $stmt->execute($params);
    $rooms = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode([
        'status' => 'success',
        'data' => $rooms,
        'filters' => [
            'capacity' => $capacity,
            'search' => $searchTerm,
            'date' => $date,
            'time' => $time,
            'datetime' => $datetime
        ]
    ]);
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Database error: ' . $e->getMessage()
    ]);
} 