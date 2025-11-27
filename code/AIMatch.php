<?php
    session_start();
    
    // 로그인 체크 (싱글은 비회원도 가능하지만 닉네임 표시는 함)
    $isLoggedIn = isset($_SESSION['uid']);
    $nickname = isset($_SESSION['userNick']) ? $_SESSION['userNick'] : (isset($_SESSION['nickname']) ? $_SESSION['nickname'] : 'Guest');

    // URL 파라미터로 넘어온 난이도 받기 (없으면 기본값 beginner)
    $difficulty = isset($_GET['level']) ? $_GET['level'] : 'beginner';
?>
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>오목 - AI 대전 (<?php echo htmlspecialchars($difficulty); ?>)</title>
    <link rel="stylesheet" href="style.css">
</head>
<body> 

    <div class="game-container">
        <main class="game-content">
            <div class="board-column">
                
                <div class="player-info player-white">
                    <div class="profile-details">
                        <h2>AI (백돌)</h2>
                        <div class="rank-info">난이도: <?php echo htmlspecialchars($difficulty); ?></div>
                    </div>
                    <div id="ai-timer" class="timer">--:--</div>
                </div>

                <canvas id="omok-board"></canvas>

                <div class="player-info player-black">
                    <div class="profile-details">
                        <h2 id="player-name-game"><?php echo htmlspecialchars($nickname); ?> (흑돌)</h2>
                        <div id="player-rank-game" class="rank-info">사용자</div>
                    </div>
                    <div id="player-timer" class="timer">--:--</div>
                </div>

                <div class="game-actions">
                    <button id="resign-button" class="btn-danger">기권하기</button>
                    <button id="home-button" class="btn-secondary">홈으로 가기</button>
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
                <button id="modal-home-button" class="btn-secondary">홈으로 가기</button>
            </div>
        </div>
    </div>

    <script>
        const CURRENT_LEVEL = '<?php echo $difficulty; ?>';
    </script>
    <script src="AIMatch.js"></script>
</body>
</html>