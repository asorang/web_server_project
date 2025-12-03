<?php
session_start();

// 로그인 체크
$isLoggedIn = isset($_SESSION['uid']);
$uid = $_SESSION['uid'] ?? 0;
$nickname = isset($_SESSION['userNick']) ? $_SESSION['userNick'] : (isset($_SESSION['nickname']) ? $_SESSION['nickname'] : 'Guest');
$playerScore = $_SESSION['score'] ?? 0;

// 난이도 파라미터
$difficulty = isset($_GET['level']) ? $_GET['level'] : 'beginner';

// 플레이어와 AI 돌 색 랜덤 배정
// true면 플레이어가 흑, false면 백
$isPlayerBlack = (rand(0, 1) === 1);

$playerStone = $isPlayerBlack ? 'black' : 'white';
$aiStone = $isPlayerBlack ? 'white' : 'black';
$micro = (int)(microtime(true) * 1000000); // 16자리 정도
$game_id = $micro . $uid;                   // 문자열로 처리

// 2) 랜덤 4자리 추가 (충돌 가능성 감소)
$rand = str_pad(mt_rand(0, 9999), 4, '0', STR_PAD_LEFT);
$game_id = $game_id . $rand;  

$score_arr = array(
    'seed' => 799,
    'beginner' => 1199,
    'intermediate' => 1499,
    'advanced' => 1799,
    'super' => 2099,
    'hell' => 2299,
    'pro' => 2799
);
$score = $score_arr[$difficulty];
$diff_arr = array(
    'seed' => 1,
    'beginner' => 2,
    'intermediate' => 3,
    'advanced' => 4,
    'super' => 5,
    'hell' => 6,
    'pro' => 7
);
$stage = $diff_arr[$difficulty];

?>

<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>오목 - AI 대전 (<?php echo htmlspecialchars($difficulty); ?>)</title>
    <link rel="stylesheet" href="../style.css">
</head>
<body> 

    <div class="game-container">
        <main class="game-content">
            <div class="board-column">

                <!-- AI 돌 정보 -->
                <div class="player-info">
                    <div class="profile-details">
                        <h2>AI (
                            <?php echo ($aiStone === 'black') ? '흑돌' : '백돌'; ?>
                        )</h2>
                        <div class="rank-info">난이도: <?php echo htmlspecialchars($difficulty); ?></div>
                    </div>
                    <div id="ai-timer" class="timer">--:--</div>
                </div>

                <canvas id="omok-board"></canvas>

                <!-- 플레이어 돌 정보 -->
                <div class="player-info">
                    <div class="profile-details">
                        <h2 id="player-name-game">
                            <?php echo htmlspecialchars($nickname); ?> (
                            <?php echo ($playerStone === 'black') ? '흑돌' : '백돌'; ?> )
                        </h2>
                    </div>
                    <div id="player-timer" class="timer">--:--</div>
                </div>

                <div class="game-actions">
                    <button id="resign-button" class="btn-danger">기권하기</button>
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

    <!-- JS 변수 전달 방식 수정 -->
    <script>
        const CURRENT_GAME_ID = '<?php echo $game_id; ?>';
        const CURRENT_LEVEL = <?php echo $stage; ?>;
        const PLAYERSCORE = <?php echo $playerScore; ?>;
        const AISCORE = <?php echo $score; ?>;
        const PLAYER_STONE = '<?php echo $playerStone; ?>';
        const USER_ID = '<?php echo $uid; ?>';
        const AI_STONE = '<?php echo $aiStone; ?>';

        document.getElementById("rematch-button").addEventListener("click", () => {
        const currentLevel = '<?php echo $difficulty; ?>';

        window.location.href = `./AIMatch.php?level=${currentLevel}`;
        });
        
    </script>
    
    <script src="./AIMatch.js"></script>
    
</body>
</html>
