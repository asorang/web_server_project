<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>오목 게임 - 홈</title>
    <link rel="stylesheet" href="style.css">
</head>
<body class="home-page"> 
    
    <div id="user-nickname" style="display: none;">
        <span id="nickname-text"></span>
        <div id="rank-info-header" class="rank-info"></div> 
    </div>

    <div class="home-container">
        <div class="main-content">
            
            <p class="welcome-message">오목을 플레이하세요.<br>실력을 향상시키세요.<br>즐기세요!</p>

            <div class="action-buttons">
                <button id="main-action-button" class="primary-button">봇과 플레이</button>
                
                <button id="pvp-button" class="btn-blue">온라인 대전</button>
                
                <button id="view-history-button" class="secondary-button">기록 보기</button>
                <button id="settings-button" class="secondary-button">설정</button>
            </div>

            <div class="auth-links">
                <button id="signup-button" class="text-button">회원가입</button>
            </div>
        </div>
    </div>

    <script src="index.js"></script>
</body>
</html>