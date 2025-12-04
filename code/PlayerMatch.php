<?php
    session_start();
    $isLoggedIn = isset($_SESSION['uid']);
    $nickname = isset($_SESSION['userNick']) ? $_SESSION['userNick'] : (isset($_SESSION['nickname']) ? $_SESSION['nickname'] : 'Guest');
?>
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <title>오목 - 친선 대전</title>
    <link rel="stylesheet" href="style.css">
</head>
<body> 
    <div class="game-container">
        <main class="game-content">
            <div class="board-column">
                
                <div id="p2-card" class="player-info player-white">
                    <div class="profile-details">
                        <h2>백돌 (Player 2)</h2>
                        <div class="rank-info">손님</div>
                    </div>
                    <div id="p2-timer" class="timer">--:--</div>
                </div>

                <div class="board-frame">
                    <canvas id="omok-board"></canvas>
                </div>

                <div id="p1-card" class="player-info player-black">
                    <div class="profile-details">
                        <h2><?php echo htmlspecialchars($nickname); ?> (Player 1)</h2>
                        <div class="rank-info">사용자</div>
                    </div>
                    <div id="p1-timer" class="timer">--:--</div>
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

    <script src="PlayerMatch.js"></script>
</body>
</html>