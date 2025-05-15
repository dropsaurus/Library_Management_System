<?php
require_once '../config/db_connect.php';

// This script initializes the role table required by the new schema

try {
    // First check if roles already exist
    $checkStmt = $pdo->query("SELECT COUNT(*) as count FROM JPN_ROLE");
    $count = $checkStmt->fetch(PDO::FETCH_ASSOC)['count'];

    if ($count > 0) {
        echo "Roles already initialized. No action taken.\n";
        exit;
    }
    
    // Insert the basic roles needed by the application
    $roles = [
        ['ROLE_NAME' => 'CUSTOMER'],
        ['ROLE_NAME' => 'EMPLOYEE'],
        ['ROLE_NAME' => 'AUTHOR'],
        ['ROLE_NAME' => 'ADMIN']
    ];
    
    $stmt = $pdo->prepare("INSERT INTO JPN_ROLE (ROLE_NAME) VALUES (:ROLE_NAME)");
    
    foreach ($roles as $role) {
        $stmt->execute($role);
        echo "Added role: " . $role['ROLE_NAME'] . "\n";
    }
    
    echo "Role initialization complete.\n";
    
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?> 