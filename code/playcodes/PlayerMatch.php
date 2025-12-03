<?php
    session_start();
    
    // PVP는 로그인이 필수일 수 있음
    $isLoggedIn = isset($_SESSION['uid']);
    $nickname = isset($_SESSION['userNick']) ? $_SESSION['userNick'] : (isset($_SESSION['nickname']) ? $_SESSION['nickname'] : 'Guest');
?>
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <title>오목 - 온라인 대전</title>
    <link rel="stylesheet" href="style.css">
</head>
<body> 
    <div class="game-container">
        <main class="game-content">
            <div class="board-column">
                
                <div class="player-info player-white">
                    <div class="profile-details">
                        <h2 id="opponent-name">상대방 (매칭 중...)</h2>
                        <div id="opponent-rank" class="rank-info">-</div>
                    </div>
                    <div id="opponent-timer" class="timer">10:00</div>
                </div>

                <canvas id="omok-board"></canvas>

                <div class="player-info player-black">
                    <div class="profile-details">
                        <h2 id="my-name"><?php echo htmlspecialchars($nickname); ?> (나)</h2>
                        <div id="my-rank" class="rank-info">내 점수</div>
                    </div>
                    <div id="my-timer" class="timer">10:00</div>
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
                <button id="rematch-button" class="btn-primary">재시합 요청</button>
                <button id="modal-home-button" class="btn-secondary">홈으로 가기</button>
            </div>
        </div>
    </div>

    <script src="PlayerMatch.js"></script>
</body>
</html>