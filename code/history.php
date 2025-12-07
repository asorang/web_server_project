<?php
 require "./actionCodes/DB.php";
 session_start();
 $uid = $_SESSION['uid'] ?? null;
 $score = $_SESSION['score'] ?? 500;
 $games_played = $_SESSION['played'] ?? 0;
 $win_rate = $_SESSION['win_rate'] ?? 0;

    
    $wins = $win_rate * $games_played;
    $loses = $games_played - $wins;
?>

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
                    <strong class="stat-value" id="total-games"><?php echo $games_played?>전 <?php echo  number_format($wins, 0);?>승 <?php echo  number_format($loses, 0);?>패</strong>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon"><i class="fas fa-chart-pie"></i></div>
                <div class="stat-info">
                    <span class="stat-label">승률</span>
                    <strong class="stat-value" id="win-rate"><?php echo  number_format(($win_rate*100), 2);?>%</strong>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon"><i class="fas fa-medal"></i></div>
                <div class="stat-info">
                    <span class="stat-label">현재 점수</span>
                    <strong class="stat-value" id="current-rank"><?php echo $score;?></strong>
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
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    <script>
    const USER_ID = <?php echo json_encode($uid); ?>;
</script>

    <script src="./history.js"></script>
</body>
</html>