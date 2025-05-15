<?php
session_start();
header('Content-Type: application/json');

// Check if user is logged in
if (isset($_SESSION['user_id'])) {
    // Return user information
    echo json_encode([
        'status' => 'success',
        'user' => [
            'id' => $_SESSION['user_id'],
            'name' => $_SESSION['user_name'] ?? 'Customer',
            'role' => $_SESSION['user_role'] ?? 'customer'
        ]
    ]);
} else {
    // User not logged in
    echo json_encode([
        'status' => 'error',
        'message' => 'User not logged in'
    ]);
}
?> 