<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once '../config/db_connect.php';

// Check if request method is POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405); // Method Not Allowed
    echo json_encode([
        'status' => 'error',
        'message' => 'Method not allowed'
    ]);
    exit;
}

// Get POST data
$json = file_get_contents('php://input');
$data = json_decode($json, true);

// Validate required fields
if (!isset($data['author_id']) || !isset($data['event_id'])) {
    http_response_code(400); // Bad Request
    echo json_encode([
        'status' => 'error',
        'message' => 'Author ID and Event ID are required'
    ]);
    exit;
}

$authorId = intval($data['author_id']);
$eventId = intval($data['event_id']);

// Validate IDs
if ($authorId <= 0 || $eventId <= 0) {
    http_response_code(400);
    echo json_encode([
        'status' => 'error',
        'message' => 'Invalid Author ID or Event ID'
    ]);
    exit;
}

try {
    // First check if the author is already registered for this seminar
    $checkQuery = "
        SELECT COUNT(*) as count
        FROM JPN_AUTHOR_SEMINAR
        WHERE A_ID = :author_id AND E_ID = :event_id
    ";
    
    $checkStmt = $pdo->prepare($checkQuery);
    $checkStmt->bindParam(':author_id', $authorId, PDO::PARAM_INT);
    $checkStmt->bindParam(':event_id', $eventId, PDO::PARAM_INT);
    $checkStmt->execute();
    
    $result = $checkStmt->fetch(PDO::FETCH_ASSOC);
    
    if ($result['count'] > 0) {
        echo json_encode([
            'status' => 'error',
            'message' => 'Author is already registered for this seminar'
        ]);
        exit;
    }
    
    // Check if seminar is in the future
    $eventQuery = "
        SELECT E_STARTTIME 
        FROM JPN_EVENT 
        WHERE E_ID = :event_id
    ";
    
    $eventStmt = $pdo->prepare($eventQuery);
    $eventStmt->bindParam(':event_id', $eventId, PDO::PARAM_INT);
    $eventStmt->execute();
    
    $event = $eventStmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$event) {
        echo json_encode([
            'status' => 'error',
            'message' => 'Seminar does not exist'
        ]);
        exit;
    }
    
    $eventStartTime = new DateTime($event['E_STARTTIME']);
    $now = new DateTime();
    
    if ($eventStartTime < $now) {
        echo json_encode([
            'status' => 'error',
            'message' => 'Cannot register for past seminars'
        ]);
        exit;
    }
    
    // Check attendance limit (assuming max is 20)
    $countQuery = "
        SELECT COUNT(*) as count 
        FROM JPN_AUTHOR_SEMINAR 
        WHERE E_ID = :event_id
    ";
    
    $countStmt = $pdo->prepare($countQuery);
    $countStmt->bindParam(':event_id', $eventId, PDO::PARAM_INT);
    $countStmt->execute();
    
    $countResult = $countStmt->fetch(PDO::FETCH_ASSOC);
    
    if ($countResult['count'] >= 20) {
        echo json_encode([
            'status' => 'error',
            'message' => 'Seminar is already full'
        ]);
        exit;
    }
    
    // All checks passed, register the author
    $insertQuery = "
        INSERT INTO JPN_AUTHOR_SEMINAR (A_ID, E_ID) 
        VALUES (:author_id, :event_id)
    ";
    
    $insertStmt = $pdo->prepare($insertQuery);
    $insertStmt->bindParam(':author_id', $authorId, PDO::PARAM_INT);
    $insertStmt->bindParam(':event_id', $eventId, PDO::PARAM_INT);
    $insertStmt->execute();
    
    // Get the newly created invitation ID
    $invitationId = $pdo->lastInsertId();
    
    echo json_encode([
        'status' => 'success',
        'message' => 'Successfully registered for the seminar',
        'data' => [
            'invitation_id' => $invitationId,
            'author_id' => $authorId,
            'event_id' => $eventId
        ]
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}
?> 