<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>게임 기록</title>
    <link rel="stylesheet" href="style.css">
</head>
<body class="history-page"> 

    <div class="history-container">
        <h1>게임 기록</h1>
        <p>지금까지의 AI 대전 기록입니다. (이 데이터는 현재 가상 데이터입니다)</p>

        <p id="total-record-text" class="history-summary-text">총 전적: 계산 중...</p>
        <p id="win-rate-text" class="history-summary-text">승률: 계산 중...</p>
        
        <table class="history-table">
            <thead>
                <tr>
                    <th>상대</th>
                    <th>결과</th>
                    <th>날짜</th>
                </tr>
            </thead>
            <tbody id="history-table-body">
                </tbody>
        </table>
        
        <div class="links">
            <a href="index.php" id="home-link">홈으로 돌아가기</a>
        </div>
    </div>
    
    <script src="history.js"></script>
</body>
</html>