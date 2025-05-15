<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

session_start();

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../config/db_connect.php';

// Get filter parameters
$capacity = isset($_GET['capacity']) ? intval($_GET['capacity']) : null;
$date = isset($_GET['date']) ? $_GET['date'] : date('Y-m-d'); // Default to today
$time = isset($_GET['time']) ? $_GET['time'] : null;
$search = isset($_GET['search']) ? $_GET['search'] : null;

// Set default time to current hour if not provided
if (empty($time)) {
    $time = date('H:00:00');
}

// Combine date and time for availability check
$dateTime = $date . ' ' . $time;

try {
    // Build query to get all rooms with their availability status
    $query = "
        SELECT 
            r.ROOM_ID,
            r.ROOM_CAPACITY,
            CASE 
                WHEN res.RES_ID IS NULL THEN 'Available'
                ELSE 'Occupied'
            END AS STATUS
        FROM JPN_ROOM r
        LEFT JOIN (
            SELECT RES_ID, ROOM_ID
            FROM JPN_RESERVATION
            WHERE 
                (? BETWEEN RES_STARTTIME AND RES_ENDTIME) OR
                (DATE_ADD(?, INTERVAL 1 HOUR) BETWEEN RES_STARTTIME AND RES_ENDTIME) OR
                (RES_STARTTIME BETWEEN ? AND DATE_ADD(?, INTERVAL 1 HOUR))
        ) res ON r.ROOM_ID = res.ROOM_ID
    ";
    
    $params = [$dateTime, $dateTime, $dateTime, $dateTime];
    $conditions = [];
    
    // Add capacity filter if provided
    if (!is_null($capacity) && $capacity > 0) {
        $conditions[] = "r.ROOM_CAPACITY >= ?";
        $params[] = $capacity;
    }
    
    // Add search filter if provided
    if (!is_null($search) && !empty($search)) {
        $conditions[] = "r.ROOM_ID LIKE ?";
        $params[] = "%$search%";
    }
    
    // Add conditions to query if any
    if (!empty($conditions)) {
        $query .= " WHERE " . implode(" AND ", $conditions);
    }
    
    // Order by room ID
    $query .= " ORDER BY r.ROOM_ID";
    
    $stmt = $pdo->prepare($query);
    $stmt->execute($params);
    
    $rooms = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode([
        'status' => 'success',
        'data' => $rooms
    ]);
    
} catch (PDOException $e) {
    error_log("Database error: " . $e->getMessage());
    echo json_encode([
        'status' => 'error',
        'message' => 'Database error: ' . $e->getMessage()
    ]);
} 