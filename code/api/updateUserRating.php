<?php
session_start();
$conn = mysqli_connect('localhost', 'root', '');
if (!$conn) die('DB connect failed: ' . mysqli_connect_error());

if (!mysqli_select_db($conn, 'DBTeam008'))
    die('DB select failed: ' . mysqli_error($conn));

$raw = file_get_contents('php://input');
$payload = json_decode($raw, true);

// 유저 승리 여부
$uid = isset($_SESSION['uid']) ? intval($_SESSION['uid']) : null;
$winner = isset($payload['winner']) ? $payload['winner'] : null; // 'player' 또는 'ai'

// player가 승리했으면 10점, 패배면 -10점 예시
$scoreChange = 0;
if ($winner === 'player') $scoreChange = 10;
elseif ($winner === 'ai') $scoreChange = -10;

if ($uid) {
    // UserRating 존재 여부 확인
    $res = mysqli_query($conn, "SELECT * FROM UserRating WHERE uid = $uid");
    if (mysqli_num_rows($res) === 0) {
        // 신규 생성
        $initScore = 500 + $scoreChange;
        $games = 1;
        $winRate = ($scoreChange > 0) ? 1 : 0;
        mysqli_query($conn, "INSERT INTO UserRating(uid, score, games_played, win_rate) VALUES($uid, $initScore, $games, $winRate)");
    } else {
        // 기존 업데이트
        $row = mysqli_fetch_assoc($res);
        $newScore = $row['score'] + $scoreChange;
        $newGames = $row['games_played'] + 1;//3  4
        $wins = $row['win_rate'] * $row['games_played'];//0.5*2 / 2  
        if ($scoreChange > 0) $wins += 1;//2
        $newWinRate = $wins / $newGames;//2/3
        mysqli_query($conn, "UPDATE UserRating SET score = $newScore, games_played = $newGames, win_rate = $newWinRate WHERE uid = $uid");
    }
}

mysqli_close($conn);

// 반환
header('Content-Type: application/json');
echo json_encode(['status'=>'ok']);
?>
