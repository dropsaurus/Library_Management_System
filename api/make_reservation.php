<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

session_start();

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../config/db_connect.php';

// Get the JSON data from the request
$data = json_decode(file_get_contents("php://input"), true);

// Validate required fields
if (!isset($data['room_id']) || 
    !isset($data['cust_id']) || 
    !isset($data['start_time']) || 
    !isset($data['end_time']) || 
    !isset($data['description']) || 
    !isset($data['count'])) {
    
    echo json_encode([
        'status' => 'error',
        'message' => 'Missing required fields'
    ]);
    exit;
}

// Extract the data
$roomId = intval($data['room_id']);
$custId = intval($data['cust_id']);
$startTime = $data['start_time'];
$endTime = $data['end_time'];
$description = $data['description'];
$count = intval($data['count']);

// Validate the data
if ($roomId <= 0) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Invalid room ID'
    ]);
    exit;
}

if ($custId <= 0) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Invalid customer ID'
    ]);
    exit;
}

if ($count <= 0) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Invalid count'
    ]);
    exit;
}

try {
    // First check if the room exists
    $roomStmt = $pdo->prepare("SELECT ROOM_ID, ROOM_CAPACITY FROM JPN_ROOM WHERE ROOM_ID = ?");
    $roomStmt->execute([$roomId]);
    $room = $roomStmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$room) {
        echo json_encode([
            'status' => 'error',
            'message' => 'Room not found'
        ]);
        exit;
    }
    
    // Check if count exceeds room capacity
    if ($count > $room['ROOM_CAPACITY']) {
        echo json_encode([
            'status' => 'error',
            'message' => 'Party size exceeds room capacity'
        ]);
        exit;
    }
    
    // Check if the user already has a reservation during the requested time period
    $userReservationStmt = $pdo->prepare("
        SELECT COUNT(*) as reservation_count 
        FROM JPN_RESERVATION
        WHERE CUST_ID = ? 
        AND (
            (RES_STARTTIME <= ? AND RES_ENDTIME > ?) OR
            (RES_STARTTIME < ? AND RES_ENDTIME >= ?) OR
            (RES_STARTTIME >= ? AND RES_ENDTIME <= ?)
        )
    ");
    
    $userReservationStmt->execute([
        $custId, 
        $endTime, $startTime,
        $endTime, $startTime,
        $startTime, $endTime
    ]);
    
    $userReservationCount = $userReservationStmt->fetch(PDO::FETCH_ASSOC)['reservation_count'];
    
    if ($userReservationCount > 0) {
        echo json_encode([
            'status' => 'error',
            'message' => 'You already have a reservation during this time period. Please choose a different time.'
        ]);
        exit;
    }
    
    // Check if the room is available during the requested time
    $availabilityStmt = $pdo->prepare("
        SELECT COUNT(*) as overlap_count 
        FROM JPN_RESERVATION
        WHERE ROOM_ID = ? 
        AND (
            (RES_STARTTIME <= ? AND RES_ENDTIME > ?) OR
            (RES_STARTTIME < ? AND RES_ENDTIME >= ?) OR
            (RES_STARTTIME >= ? AND RES_ENDTIME <= ?)
        )
    ");
    
    $availabilityStmt->execute([
        $roomId, 
        $endTime, $startTime,
        $endTime, $startTime,
        $startTime, $endTime
    ]);
    
    $overlapCount = $availabilityStmt->fetch(PDO::FETCH_ASSOC)['overlap_count'];
    
    if ($overlapCount > 0) {
        echo json_encode([
            'status' => 'error',
            'message' => 'Room is not available during this time period'
        ]);
        exit;
    }
    
    // Insert the reservation
    $insertStmt = $pdo->prepare("
        INSERT INTO JPN_RESERVATION 
        (RES_STARTTIME, RES_ENDTIME, RES_DESC, RES_COUNT, CUST_ID, ROOM_ID)
        VALUES (?, ?, ?, ?, ?, ?)
    ");
    
    $insertStmt->execute([
        $startTime,
        $endTime,
        $description,
        $count,
        $custId,
        $roomId
    ]);
    
    $reservationId = $pdo->lastInsertId();
    
    echo json_encode([
        'status' => 'success',
        'message' => 'Reservation created successfully',
        'reservation_id' => $reservationId
    ]);
    
} catch (PDOException $e) {
    error_log("Database error: " . $e->getMessage());
    echo json_encode([
        'status' => 'error',
        'message' => 'Database error: ' . $e->getMessage()
    ]);
} 