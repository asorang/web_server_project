<?php
require "../actionCodes/DB.php";

header("Content-Type: application/json; charset=utf-8");

// gameId 받기
$gameId = $_GET['gameId'] ?? null;
if (!$gameId) {
    echo json_encode(["error" => "no gameId"]);
    exit;
}

/* --------------------------------------------------------
   1) 메타데이터 1줄 가져오기
--------------------------------------------------------- */
$sqlMeta = "
    SELECT 
        user_id1, user_id2, user1_color, user2_color,
        user1_score, user2_score, game_if, winner, created_at
    FROM RawGameLog
    WHERE game_id = ?
    ORDER BY turn ASC
    LIMIT 1
";

$stmt = $conn->prepare($sqlMeta);
$stmt->bind_param("s", $gameId);
$stmt->execute();
$stmt->store_result();

// 결과가 없을 때
if ($stmt->num_rows === 0) {
    echo json_encode(["error" => "invalid gameId"]);
    exit;
}

$stmt->bind_result(
    $user_id1, $user_id2, $user1_color, $user2_color,
    $user1_score, $user2_score, $game_if, $winner, $created_at
);
$stmt->fetch();

$meta = [
    "user_id1" => $user_id1,
    "user_id2" => $user_id2,
    "user1_color" => $user1_color,
    "user2_color" => $user2_color,
    "user1_score" => $user1_score,
    "user2_score" => $user2_score,
    "game_if" => $game_if,
    "winner" => $winner,
    "created_at" => $created_at
];

$stmt->close();

/* --------------------------------------------------------
   2) 전체 수순 조회
--------------------------------------------------------- */
$sqlMoves = "
    SELECT turn, x, y, color
    FROM RawGameLog
    WHERE game_id = ?
    ORDER BY turn ASC
";

$stmt = $conn->prepare($sqlMoves);
$stmt->bind_param("s", $gameId);
$stmt->execute();
$stmt->store_result();

$stmt->bind_result($turn, $x, $y, $color);

$moves = [];
while ($stmt->fetch()) {
    $moves[] = [
        "turn"  => (int)$turn,
        "x"     => (int)$x,
        "y"     => (int)$y,
        "color" => $color
    ];
}

$stmt->close();

/* --------------------------------------------------------
   최종 JSON 출력
--------------------------------------------------------- */
echo json_encode([
    "gameId" => $gameId,
    "meta"   => $meta,
    "moves"  => $moves
], JSON_UNESCAPED_UNICODE);
