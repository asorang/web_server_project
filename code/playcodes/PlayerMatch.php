<?php
session_start();

// 로그인 체크
$isLoggedIn = isset($_SESSION['uid']);
$uid = $_SESSION['uid'] ?? 0;
$nickname1 = $_SESSION['userNick'] ?? 'Player1';
$nickname2 = 'Player2'; // 두 번째 플레이어 이름, 로컬 2인용이면 고정 가능

$playerStone1 = 'black';
$playerStone2 = 'white';

$micro = (int)(microtime(true) * 1000000);
$game_id = $micro . $uid;
?>

<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>오목 - 2인용 대국</title>
    <link rel="stylesheet" href="../style.css">
</head>
<body> 

<div class="game-container">
    <main class="game-content">
        <div class="board-column">

            <!-- 플레이어 1 정보 -->
            <div class="player-info">
                <div class="profile-details">
                    <h2 id="player1-name"><?php echo htmlspecialchars($nickname1); ?> (흑)</h2>
                </div>
            </div>

            <canvas id="omok-board"></canvas>

            <!-- 플레이어 2 정보 -->
            <div class="player-info">
                <div class="profile-details">
                    <h2 id="player2-name"><?php echo htmlspecialchars($nickname2); ?> (백)</h2>
                </div>
            </div>

            <div class="game-actions">
                <button id="home-button" class="btn-secondary"><a href="../main.php" class="nav-link">홈으로 가기</a></button>
            </div>

        </div>
    </main>
</div>

<div id="end-game-modal" class="modal-overlay">
    <div class="modal-content">
        <h2 id="modal-title">게임 종료</h2>
        <p id="modal-message"></p>
        <div class="modal-buttons">
            <button id="rematch-button" class="btn-primary">다시 하기</button>
            <button id="modal-home-button" class="btn-secondary"><a href="../main.php" class="nav-link">홈으로 가기</a></button>
        </div>
    </div>
</div>

<script>
    const USER_ID = '<?php echo $uid; ?>';
    const CURRENT_GAME_ID = '<?php echo $game_id; ?>';

    document.getElementById("rematch-button").addEventListener("click", () => {
        window.location.href = `./PlayerMatch.php`;
        });
</script>

<script src="./PlayerMatch.js"></script>
</body>
</html>
