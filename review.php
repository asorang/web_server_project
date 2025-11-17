<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>게임 복기</title>
    <link rel="stylesheet" href="style.css">
</head>
<body class="review-page"> 

    <div class="review-container">
        
        <div class="board-column">
            <canvas id="omok-board" width="600" height="600"></canvas>
            
            <div class="review-controls">
                <button id="btn-prev">이전 (◀)</button>
                <button id="btn-play">재생 (▶)</button>
                <button id="btn-next">다음 (▶)</button>
            </div>
            
            <div class="links">
                <a href="history.php">기록 목록으로 돌아가기</a> </div>
        </div>
        
        <div class="moves-panel">
            <h2>수순 기록</h2>
            <ol id="moves-list">
                </ol>
        </div>

    </div>

    <script src="review.js"></script>
</body>
</html>