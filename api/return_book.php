<?php
header("Content-Type: application/json");
require_once("../config/db.php");

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['R_ID']) || !isset($data['R_AC_RETURNDATE'])) {
    http_response_code(400);
    echo json_encode([
        "status" => "error",
        "message" => "Missing R_ID or R_AC_RETURNDATE"
    ]);
    exit();
}

try {
    $stmt = $pdo->prepare("
        UPDATE JPN_RENTAL
        SET R_AC_RETURNDATE = ?, R_STATUS = 'Returned'
        WHERE R_ID = ?
    ");

    $stmt->execute([
        $data['R_AC_RETURNDATE'],
        $data['R_ID']
    ]);

    if ($stmt->rowCount() > 0) {
        echo json_encode([
            "status" => "success",
            "message" => "Book marked as returned"
        ]);
    } else {
        http_response_code(404);
        echo json_encode([
            "status" => "error",
            "message" => "Rental record not found or already updated"
        ]);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage()
    ]);
}
?>
