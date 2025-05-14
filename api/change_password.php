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

if (!isset($_SESSION['CUST_ID'])) {
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
  // 1. 获取当前密码（假设字段是 CUST_PASSWORD，使用哈希存储）
  $stmt = $pdo->prepare("SELECT CUST_PASSWORD FROM JPN_CUSTOMER WHERE CUST_ID = ?");
  $stmt->execute([$_SESSION['CUST_ID']]);
  $row = $stmt->fetch(PDO::FETCH_ASSOC);

  if (!$row || !password_verify($oldPassword, $row['CUST_PASSWORD'])) {
    echo json_encode([
      'status' => 'error',
      'message' => 'Current password is incorrect.'
    ]);
    exit;
  }

  // 2. 更新新密码（使用 hash 加密）
  $hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);
  $updateStmt = $pdo->prepare("UPDATE JPN_CUSTOMER SET CUST_PASSWORD = ? WHERE CUST_ID = ?");
  $updateStmt->execute([$hashedPassword, $_SESSION['CUST_ID']]);

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
