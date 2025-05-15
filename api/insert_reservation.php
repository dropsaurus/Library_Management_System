<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight CORS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once '../config/db_connect.php';

$maxRetries = 3; // Maximum number of retries for deadlock


for ($attempt = 1; $attempt <= $maxRetries; $attempt++) {
    try {
        // Parse incoming JSON request data
        $data = json_decode(file_get_contents("php://input"), true);

        // Input validation
        if (
            !isset($data['start_time']) ||
            !isset($data['end_time']) ||
            !isset($data['description']) ||
            !isset($data['count']) ||
            !isset($data['cust_id']) ||
            !isset($data['room_id'])
        ) {
            echo json_encode([
                'status' => 'error',
                'message' => 'Missing required fields'
            ]);
            exit;
        }

        // Start transaction
        $pdo->beginTransaction();

        // Prepare and execute insert statement for new reservation
        $stmt = $pdo->prepare("
            INSERT INTO JPN_RESERVATION 
            (RES_STARTTIME, RES_ENDTIME, RES_DESC, RES_COUNT, CUST_ID, ROOM_ID)
            VALUES (:start_time, :end_time, :description, :count, :cust_id, :room_id)
        ");

        $stmt->execute([
            ':start_time'   => $data['start_time'],
            ':end_time'     => $data['end_time'],
            ':description'  => $data['description'],
            ':count'        => $data['count'],
            ':cust_id'      => $data['cust_id'],
            ':room_id'      => $data['room_id']
        ]);

        // Commit transaction
        $pdo->commit();

        // Return success response
        echo json_encode([
            'status' => 'success',
            'message' => 'Reservation created successfully'
        ]);
        break; // Exit the retry loop on success
    } catch (PDOException $e) {
        $pdo->rollBack();
        // Check for deadlock error (MySQL error code 1213)
        if (strpos($e->getMessage(), '1213') !== false && $attempt < $maxRetries) {
            usleep(100000); // Wait 100 ms before retrying
            continue; // Retry the transaction
        } else {
            // On other errors or after final attempt, return error
            http_response_code(500);
            echo json_encode([
                'status' => 'error',
                'message' => 'Database error: ' . $e->getMessage()
            ]);
            break;
        }
    }
}
?>
