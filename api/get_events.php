<?php
header("Content-Type: application/json");
require_once("../config/db.php");

try {
    $sql = "
        SELECT 
            e.E_ID,
            e.E_NAME,
            e.E_STARTTIME,
            e.E_ENDTIME,
            e.E_TYPE,
            t.T_NAME AS TOPIC_NAME
        FROM JPN_EVENT e
        JOIN JPN_TOPIC t ON e.T_ID = t.T_ID
        ORDER BY e.E_STARTTIME DESC
    ";

    $stmt = $pdo->prepare($sql);
    $stmt->execute();

    $events = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "status" => "success",
        "data" => $events
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage()
    ]);
}
?>
