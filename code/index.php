<?php
    // 1. 세션을 시작합니다. (로그인 정보를 가져오기 위함)
    session_start();

    // 2. 로그인 여부 확인
    // 백엔드가 로그인 성공 시 $_SESSION['userID'] 같은 변수를 만들어뒀다고 가정합니다.
    $isLoggedIn = isset($_SESSION['userID']); 
    
    // 백엔드가 저장한 닉네임과 정보를 가져옵니다. (없으면 기본값)
    $nickname = isset($_SESSION['userNick']) ? $_SESSION['userNick'] : 'Guest';
    $rank = isset($_SESSION['userRank']) ? $_SESSION['userRank'] : '10급'; // 예시
    $score = isset($_SESSION['userScore']) ? $_SESSION['userScore'] : '1000점'; // 예시
?>
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>오목 게임 - 홈</title>
    <link rel="stylesheet" href="style.css">
</head>
<body class="home-page"> 
    
    <?php if ($isLoggedIn): ?>
    <div id="user-nickname">
        <span id="nickname-text"><?php echo $nickname; ?> 님</span>
        <div id="rank-info-header" class="rank-info"><?php echo $rank . " " . $score; ?></div> 
    </div>
    <?php endif; ?>

    <div class="home-container">
        <div class="main-content">
            
            <p class="welcome-message">오목을 플레이하세요.<br>실력을 향상시키세요.<br>즐기세요!</p>

            <div class="action-buttons">
                <?php if ($isLoggedIn): ?>
                    <button id="main-action-button" class="primary-button" onclick="location.href='game.php'">봇과 플레이</button>
                <?php else: ?>
                    <button id="main-action-button" class="primary-button" onclick="location.href='login.php'">로그인</button>
                <?php endif; ?>
                
                <button id="pvp-button" class="btn-blue" onclick="location.href='matchmaking.php'">온라인 대전</button>
                
                <button id="view-history-button" class="secondary-button" onclick="location.href='history.php'">기록 보기</button>
                <button id="settings-button" class="secondary-button" onclick="location.href='settings.php'">설정</button>
            </div>

            <div class="auth-links">
                <?php if (!$isLoggedIn): ?>
                    <button id="signup-button" class="text-button" onclick="location.href='signup.php'">회원가입</button>
                <?php endif; ?>
            </div>
        </div>
    </div>

    </body>
</html>