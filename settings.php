<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>설정</title>
    <link rel="stylesheet" href="style.css">
</head>
<body class="settings-page"> 

    <div class="settings-container">
        <h1>설정</h1>
        <p>게임 환경을 설정합니다. (현재는 UI만 구현된 상태입니다)</p>

        <div class="settings-group">
            <h2>오디오</h2>
            <div class="setting-item">
                <label for="bgm-volume">배경음 (BGM)</label>
                <input type="range" id="bgm-volume" name="bgm-volume" min="0" max="100" value="50">
            </div>
            <div class="setting-item">
                <label for="sfx-volume">효과음 (SFX)</label>
                <input type="range" id="sfx-volume" name="sfx-volume" min="0" max="100" value="80">
            </div>
        </div>

        <div class="settings-group">
            <h2>계정</h2>
            <div class="setting-item">
                <label>로그아웃</label>
                <button id="logout-btn-settings" class="btn-secondary">로그아웃</button>
            </div>
            <div class="setting-item">
                <label>계정 탈퇴</label>
                <button id="delete-account-btn" class="btn-danger">계정 탈퇴하기</button>
            </div>
        </div>
        
        <div class="links">
            <a href="index.php" id="home-link">홈으로 돌아가기</a>
        </div>
    </div>
    
    <script src="settings.js"></script> 
</body>
</html>