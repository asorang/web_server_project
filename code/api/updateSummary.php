<?php
session_start();
$conn = mysqli_connect('localhost', 'root', '', 'DBTeam008');
if (!$conn) { echo json_encode(['status'=>'error','msg'=>'DB connect fail']); exit; }

$data = json_decode(file_get_contents('php://input'), true);

$game_id     = $data['game_id'] ?? '';   // ★ long integer 방어
$user_id1    = intval($data['user_id1'] ?? 0);
$user_id2    = intval($data['user_id2'] ?? 0);
$user1_color = $data['user1_color'] ?? 'B';
$user2_color = $data['user2_color'] ?? 'W';
$winner      = $data['winner'] ?? 'B';

$sql = "INSERT INTO 
        SummaryLog (game_id, user_id1, user_id2, user1_color, user2_color, winner)
        VALUES 
        ($game_id,
        $user_id1,
        $user_id2,
        '$user1_color',
        '$user2_color',
        '$winner')";
    mysqli_query($conn, $sql);

    mysqli_close($conn);
echo json_encode(["status" => "ok"]);
