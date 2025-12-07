<?php
require "../actionCodes/DB.php";

header('Content-Type: application/json');

$uid = $_GET['uid'] ?? null;

if (!$uid) {
    echo json_encode([]);
    exit;
}

$sql = "
SELECT 
    s.game_id,
    CASE
        WHEN s.user_id1 = ? THEN u2.nickname
        ELSE u1.nickname
    END AS opponent_name,
    CASE
        WHEN (
            (s.winner = s.user1_color AND s.user_id1 = ?) OR 
            (s.winner = s.user2_color AND s.user_id2 = ?)
        )
        THEN 'win'
        ELSE 'lose'
    END AS result,
    s.created_at
FROM SummaryLog s
JOIN usertable u1 ON u1.uid = s.user_id1
JOIN usertable u2 ON u2.uid = s.user_id2
WHERE s.user_id1 = ? OR s.user_id2 = ?
ORDER BY s.created_at DESC
";

$stmt = $conn->prepare($sql);

if (!$stmt) {
    die("SQL ERROR: " . $conn->error);
}

$stmt->bind_param("iiiii", $uid, $uid, $uid, $uid, $uid);
$stmt->execute();
$stmt->store_result();

$stmt->bind_result($game_id, $opponent_name, $result, $created_at);

$list = [];

while ($stmt->fetch()) {
    $list[] = [
        "game_id"       => $game_id,
        "opponent_name" => $opponent_name,
        "result"        => $result,
        "created_at"    => $created_at
    ];
}

echo json_encode($list);
