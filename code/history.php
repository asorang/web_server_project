<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <title>게임 기록 - Gomoku</title>
    <link rel="stylesheet" href="style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body class="history-page"> 
    <div class="history-layout">
        <div class="history-header">
            <h1><i class="fas fa-history"></i> 나의 전적</h1>
            <a href="main.php" class="btn-mini-home"><i class="fas fa-home"></i> 홈으로</a>
        </div>

        <div class="stats-row">
            <div class="stat-card">
                <div class="stat-icon"><i class="fas fa-trophy"></i></div>
                <div class="stat-info">
                    <span class="stat-label">총 전적</span>
                    <strong class="stat-value" id="total-games">0전 0승 0패</strong>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon"><i class="fas fa-chart-pie"></i></div>
                <div class="stat-info">
                    <span class="stat-label">승률</span>
                    <strong class="stat-value" id="win-rate">0%</strong>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon"><i class="fas fa-medal"></i></div>
                <div class="stat-info">
                    <span class="stat-label">현재 급수</span>
                    <strong class="stat-value" id="current-rank">기록 없음</strong>
                </div>
            </div>
        </div>

        <div class="history-list-container">
            <table class="history-table">
                <thead>
                    <tr>
                        <th width="15%">#</th>
                        <th width="30%">상대</th>
                        <th width="20%">결과</th>
                        <th width="35%">날짜</th>
                    </tr>
                </thead>
                <tbody id="history-table-body">
                    <tr>
                        <td colspan="4" class="empty-msg">기록을 불러오는 중...</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    <script src="history.js"></script>
</body>
</html>