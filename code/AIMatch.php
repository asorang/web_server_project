<?php
    session_start();
    
    // 로그인 체크
    $isLoggedIn = isset($_SESSION['uid']);
    $nickname = isset($_SESSION['userNick']) ? $_SESSION['userNick'] : (isset($_SESSION['nickname']) ? $_SESSION['nickname'] : 'Guest');

    // URL 파라미터로 넘어온 난이도 받기
    $difficulty = isset($_GET['level']) ? $_GET['level'] : 'beginner';

    // 한글 난이도 변환
    $levelMap = [
        'seed' => '새싹', 'beginner' => '초급', 'intermediate' => '중급',
        'advanced' => '고급', 'super' => '초고급', 'hell' => '극악', 'pro' => '프로'
    ];
    $displayRank = isset($levelMap[$difficulty]) ? $levelMap[$difficulty] : '초급';
?>
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <title>오목 - AI 대전 (<?php echo $displayRank; ?>)</title>
    <link rel="stylesheet" href="style.css">
</head>
<body> 

    <div class="game-container">
        <main class="game-content">
            <div class="board-column">
                
                <div id="ai-card" class="player-info player-white">
                    <div class="profile-details">
                        <h2>AI (백돌)</h2>
                        <div class="rank-info">난이도: <?php echo $displayRank; ?></div>
                    </div>
                    <div id="ai-timer" class="timer">10:00</div>
                </div>

                <div class="board-frame">
                    <canvas id="omok-board"></canvas>
                </div>

                <div id="player-card" class="player-info player-black">
                    <div class="profile-details">
                        <h2 id="player-name-game"><?php echo htmlspecialchars($nickname); ?> (흑돌)</h2>
                        <div id="player-rank-game" class="rank-info">사용자</div>
                    </div>
                    <div id="player-timer" class="timer">10:00</div>
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
            <div class="modal-icon">
                <i class="fas fa-trophy"></i>
            </div>
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