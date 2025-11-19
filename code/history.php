<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <title>게임 기록</title>
    <link rel="stylesheet" href="style.css">
</head>
<body class="history-page"> 
    <div class="history-container">
        <h1>게임 기록</h1>
        <p id="total-record-text">총 전적 불러오는 중...</p>
        <table class="history-table">
            <thead><tr><th>상대</th><th>결과</th><th>날짜</th></tr></thead>
            <tbody id="history-table-body"></tbody>
        </table>
        <div class="links"><a href="index.php">홈으로 돌아가기</a></div>
    </div>
    <script src="history.js"></script>
</body>
</html>