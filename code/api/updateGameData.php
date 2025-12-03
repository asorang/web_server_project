<?php
session_start();
$conn = mysqli_connect('localhost', 'root', '', 'DBTeam008');
if (!$conn) { echo json_encode(['status'=>'error','msg'=>'DB connect fail']); exit; }

$payload = json_decode(file_get_contents('php://input'), true);
$game_id = $payload['game_id'] ?? '';
$winner = $payload['winner'] ?? '';
$game_if = $payload['game_if'] ?? 'normal'; // 정상승리, 기권, 무승부
$user1_id = intval($payload['user1_id'] ?? 0);
$user2_id = intval($payload['user2_id'] ?? 1); // AI uid=1
$user1_score = intval($payload['user1_score'] ?? 0);
$user2_score = intval($payload['user2_score'] ?? 0);
$user1_color = $payload['user1_color'] ?? 'B';
$user2_color = $payload['user2_color'] ?? 'W';
$board_moves = $payload['board_moves'] ?? [];

foreach ($board_moves as $move) {
    $turn = intval($move['turn']);
    $x = intval($move['x']);
    $y = intval($move['y']);
    $color = ($move['color'] === 'B') ? 'B' : 'W';

    // 누가 착수했는지 판단
    $user_id = ($color === $user1_color) ? $user1_id : $user2_id;

    $sql = "INSERT INTO RawGameLog 
        (game_id, turn, user_id1, user_id2, user1_color, user2_color, x, y, color, user1_score, user2_score, game_if, winner)
        VALUES 
        ($game_id, $turn, $user1_id, $user2_id, '$user1_color', '$user2_color', $x, $y, '$color', $user1_score, $user2_score, '$game_if', '$winner')
        ON DUPLICATE KEY UPDATE x=$x, y=$y, color='$color', game_if='$game_if', winner='$winner'";

    mysqli_query($conn, $sql);
}

mysqli_close($conn);
echo json_encode(['status'=>'ok']);
