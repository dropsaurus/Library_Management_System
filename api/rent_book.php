<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once '../config/db_connect.php';

try {
    $data = json_decode(file_get_contents('php://input'), true);

    if (!isset($data['book_id']) || !isset($data['customer_id'])) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Missing book_id or customer_id']);
        exit;
    }

    $book_id = $data['book_id'];
    $customer_id = $data['customer_id'];

    // Step 1: Get available copy
    $stmt = $pdo->prepare("SELECT COPY_ID FROM JPN_COPIES WHERE BOOK_ID = ? AND COPY_STATUS = 'AVAILABLE' LIMIT 1");
    $stmt->execute([$book_id]);
    $copy = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$copy) {
        http_response_code(404);
        echo json_encode(['status' => 'error', 'message' => 'No available copies']);
        exit;
    }

    $copy_id = $copy['COPY_ID'];

    // Step 2: Create rental record
    $stmt = $pdo->prepare("INSERT INTO JPN_RENTALS (CUST_ID, COPY_ID, RENT_DATE) VALUES (?, ?, NOW())");
    $stmt->execute([$customer_id, $copy_id]);

    // Step 3: Update copy status
    $stmt = $pdo->prepare("UPDATE JPN_COPIES SET COPY_STATUS = 'RENTED' WHERE COPY_ID = ?");
    $stmt->execute([$copy_id]);

    echo json_encode(['status' => 'success', 'message' => 'Book rented successfully']);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
}
?>
