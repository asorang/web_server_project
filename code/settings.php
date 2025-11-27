<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <title>설정</title>
    <link rel="stylesheet" href="style.css">
</head>
<body class="settings-page"> 
    <div class="settings-container">
        <h1>설정</h1>
        
        <form action="save_settings.php" method="POST">
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
            <div class="settings-group" style="text-align: center; border-bottom: none;">
                <button type="submit" class="btn-primary" style="width: 100%;">설정 저장하기</button>
            </div>
        </form>

        <div class="settings-group">
            <h2>계정</h2>
            <div class="setting-item">
                <label>계정 탈퇴</label>
                <button id="delete-account-btn" class="btn-danger">계정 탈퇴하기</button>
            </div>
        </div>
        <div class="links"><a href="main.php">홈으로 돌아가기</a></div>
    </div>
    <script src="settings.js"></script> 
</body>
</html>