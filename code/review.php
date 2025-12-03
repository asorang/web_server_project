<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <title>게임 복기 - Gomoku</title>
    <link rel="stylesheet" href="style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body class="review-page"> 

    <div class="review-layout">
        <div class="left-panel">
            <div class="board-wrapper">
                <canvas id="omok-board"></canvas>
            </div>
            <div class="review-controls">
                <button id="btn-prev"><i class="fas fa-step-backward"></i> 이전</button>
                <button id="btn-play"><i class="fas fa-play"></i> 재생</button>
                <button id="btn-next">다음 <i class="fas fa-step-forward"></i></button>
            </div>
        </div>

        <div class="right-panel">
            <div class="game-info-card">
                <h3>게임 정보</h3>
                <div class="info-grid">
                    <div class="info-item">
                        <span class="label">흑돌:</span> <strong id="p1-name">-</strong>
                    </div>
                    <div class="info-item">
                        <span class="label">백돌:</span> <strong id="p2-name">-</strong>
                    </div>
                    <div class="info-item">
                        <span class="label">결과:</span> <strong id="game-result" style="color: #81b64c;">-</strong>
                    </div>
                    <div class="info-item">
                        <span class="label">총 수:</span> 
                        <strong id="total-moves">-</strong>
                        <span>수</span>
                    </div>
                </div>
            </div>

            <div class="moves-container">
                <h3>수순 기록</h3>
                <div class="moves-scroll-box">
                    <ol id="moves-list">
                        </ol>
                </div>
            </div>

            <button onclick="location.href='history.php'" class="btn-exit">목록으로 돌아가기</button>
        </div>
    </div>

    <script src="review.js"></script>
</body>
</html>