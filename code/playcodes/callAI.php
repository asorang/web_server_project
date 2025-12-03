<?php
session_start();

// 1. JS에서 보낸 JSON 바디 읽기
$raw = file_get_contents('php://input');
$payload = json_decode($raw, true);

// 2. 기본값 설정
$game_id = isset($payload['game_id']) ? intval($payload['game_id']) : null;
$board = isset($payload['board']) ? $payload['board'] : [];
$player_move = isset($payload['player_move']) ? $payload['player_move'] : null;
$turn = isset($payload['turn']) ? intval($payload['turn']) : 0;
$difficulty = isset($payload['difficulty']) ? intval($payload['difficulty']) : 1199;
$user_id = isset($_SESSION['uid']) ? intval($_SESSION['uid']) : null;
$player_stone = isset($payload['player_stone']) ? $payload['player_stone'] : 'B';

// 3. Flask AI 서버로 전달할 payload
$ai_payload = array(
    "game_id" => $game_id,
    "board" => $board,
    "player_move" => $player_move,
    "turn" => $turn,
    "difficulty" => $difficulty,
    "player_stone" => $player_stone,
    "user_id" => $user_id

);

// 4. cURL로 Flask AI 서버 호출
$ch = curl_init("http://127.0.0.1:5000/ai_move");
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($ai_payload));
curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json'));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($ch);
if(curl_errno($ch)){
    echo json_encode(['error' => curl_error($ch)]);
    exit;
}
curl_close($ch);

// 5. 응답 그대로 반환 (JS에서 처리)
header('Content-Type: application/json');
echo $response;
?>
