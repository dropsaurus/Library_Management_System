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

// In a real implementation, you would get the author ID from the session
// For now, we'll accept it as a parameter (but in production, add proper validation)
$authorId = isset($_GET['author_id']) ? intval($_GET['author_id']) : 0;

try {
    // Base query to get all upcoming seminars
    $query = "
        SELECT 
            e.E_ID,
            e.E_NAME AS seminar_name,
            e.E_STARTTIME AS start_time,
            e.E_ENDTIME AS end_time,
            e.E_TYPE,
            s.SPEAKER_FNAME,
            s.SPEAKER_LNAME,
            t.T_NAME AS topic_name,
            (
                SELECT COUNT(*) 
                FROM JPN_AUTHOR_SEMINAR ase2 
                WHERE ase2.E_ID = e.E_ID
            ) AS registered_authors
        FROM JPN_EVENT e
        JOIN JPN_SEMINAR s ON e.E_ID = s.E_ID
        LEFT JOIN JPN_TOPIC t ON e.T_ID = t.T_ID
        WHERE e.E_STARTTIME > NOW()
    ";

    // Parameters will be added conditionally
    $params = [];
    
    // If author ID is provided, check if the author is registered for each seminar
    if ($authorId) {
        $query .= "
            AND (
                SELECT COUNT(*)
                FROM JPN_AUTHOR_SEMINAR ase
                WHERE ase.E_ID = e.E_ID AND ase.A_ID = :author_id
            ) AS is_registered
        ";
        $params[':author_id'] = $authorId;
    }
    
    $query .= " ORDER BY e.E_STARTTIME ASC";
    
    $stmt = $pdo->prepare($query);
    
    // Bind parameters if any
    foreach ($params as $key => $value) {
        $stmt->bindValue($key, $value);
    }
    
    $stmt->execute();
    $seminars = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Transform the data to add more useful information
    foreach ($seminars as &$seminar) {
        // Format dates nicely
        $startDateTime = new DateTime($seminar['start_time']);
        $endDateTime = new DateTime($seminar['end_time']);
        
        $seminar['formatted_date'] = $startDateTime->format('M d, Y');
        $seminar['formatted_time'] = $startDateTime->format('g:i A') . ' - ' . $endDateTime->format('g:i A');
        
        // Calculate estimated spots left (assuming max capacity is 20 for seminars)
        $maxCapacity = 20; // This could be fetched from a settings table in a real implementation
        $seminar['spots_left'] = max(0, $maxCapacity - $seminar['registered_authors']);
        
        // Is it fully booked?
        $seminar['is_full'] = $seminar['spots_left'] <= 0;
    }
    
    echo json_encode([
        'status' => 'success',
        'data' => $seminars
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}
?> 