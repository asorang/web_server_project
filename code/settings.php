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
            <a href="index.php">홈으로 돌아가기</a>
        </div>
    </div>
    <script src="settings.js"></script> 
</body>
</html>