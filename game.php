<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>오목 게임 - AI 대전</title>
    <link rel="stylesheet" href="style.css">
</head>
<body> 

    <div class="game-container">
        <main class="game-content">
            
            <div class="board-column">
                
                <div class="player-info player-white">
                    <h2>AI (백돌)</h2>
                    <div id="ai-timer" class="timer">10:00</div>
                </div>

                <canvas id="omok-board" width="600" height="600"></canvas>

                <div class="player-info player-black">
                    <div class="profile-details">
                        <h2 id="player-name-game">나 (흑돌)</h2>
                        <div id="player-rank-game" class="rank-info">(급수 점수)</div>
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
            <h2 id="modal-title">게임 종료</h2>
            <p id="modal-message">시간 초과! AI의 승리입니다.</p>
            <div class="modal-buttons">
                <button id="rematch-button" class="btn-primary">새로 시작하기</button>
                <button id="modal-home-button" class="btn-secondary">홈으로 가기</button>
            </div>
        </div>
    </div>

    <script src="game.js"></script>
</body>
</html>