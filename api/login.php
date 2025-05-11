<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');  // 可根据需要限制来源
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

require_once 'config/db_connect.php'; // 数据库连接文件

try {
    $data = json_decode(file_get_contents("php://input"), true);

    // 检查字段是否完整
    if (!isset($data['email']) || !isset($data['password'])) {
        echo json_encode(['status' => 'error', 'message' => 'Missing email or password']);
        exit;
    }

    $email = $data['email'];
    $password = $data['password'];

    // 查询用户信息
    $stmt = $pdo->prepare("SELECT id, password_hash, role FROM users WHERE email = :email");
    $stmt->execute([':email' => $email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user && password_verify($password, $user['password_hash'])) {
        // 登录成功，根据角色返回跳转页面
        $redirect = ($user['role'] === 'employee') ? 'employee_page.html' : 'customer_page.html';

        echo json_encode([
            'status' => 'success',
            'user_id' => $user['id'],
            'role' => $user['role'],
            'redirect' => $redirect
        ]);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Invalid credentials']);
    }

} catch (Exception $e) {
    echo json_encode(['status' => 'error', 'message' => 'Server error: ' . $e->getMessage()]);
}
?>
