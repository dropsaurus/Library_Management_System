<?php
header("Content-Type: application/json");

require_once("../config/db.php");

try {
    $sql = "SELECT BOOK_ID, BOOK_NAME FROM JPN_BOOK";
    $stmt = $pdo->prepare($sql);
    $stmt->execute();

    $books = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "status" => "success",
        "data" => $books
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage()
    ]);
}
?>
