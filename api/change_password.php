<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(200);
  exit;
}

session_start();
require_once '../config/db_connect.php';

if (!isset($_SESSION['USER_ID'])) {
  echo json_encode([
    'status' => 'error',
    'message' => 'User not logged in.'
  ]);
  exit;
}

$data = json_decode(file_get_contents('php://input'), true);

$oldPassword = $data['oldPassword'] ?? '';
$newPassword = $data['newPassword'] ?? '';

if (empty($oldPassword) || empty($newPassword)) {
  echo json_encode([
    'status' => 'error',
    'message' => 'Both old and new passwords are required.'
  ]);
  exit;
}

try {
  // Get the current password hash
  $stmt = $pdo->prepare("SELECT U_PWD_HASH FROM JPN_USER WHERE U_ID = ?");
  $stmt->execute([$_SESSION['USER_ID']]);
  $row = $stmt->fetch(PDO::FETCH_ASSOC);

  // Verify old password by comparing hashes
  $oldPasswordHash = hex2bin(hash('sha256', $oldPassword));
  
  if (!$row || !hash_equals($row['U_PWD_HASH'], $oldPasswordHash)) {
    echo json_encode([
      'status' => 'error',
      'message' => 'Current password is incorrect.'
    ]);
    exit;
  }

  // Create hash for new password and update
  $newPasswordHash = hash('sha256', $newPassword);
  $updateStmt = $pdo->prepare("UPDATE JPN_USER SET U_PWD_HASH = UNHEX(?) WHERE U_ID = ?");
  $updateStmt->execute([$newPasswordHash, $_SESSION['USER_ID']]);

  echo json_encode([
    'status' => 'success',
    'message' => 'Password updated successfully.'
  ]);
} catch (PDOException $e) {
  http_response_code(500);
  echo json_encode([
    'status' => 'error',
    'message' => 'Database error: ' . $e->getMessage()
  ]);
}
