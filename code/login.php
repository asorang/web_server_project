<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>오목 게임 - 로그인</title>
    <link rel="stylesheet" href="style.css">
</head>
<body class="login-page"> 

    <div class="login-container">
        <h2>로그인</h2>
        
        <form id="login-form" action="./actionCodes/loginSQL.php" method="POST">
            
            <div class="input-group">
                <label for="userID">아이디</label>
                <input type="text" id="userID" name="userID" required>
            </div>
            
            <div class="input-group">
                <label for="userPassword">비밀번호</label>
                <input type="password" id="userPassword" name="userPassword" required>
            </div>
            
            <button type="submit" class="login-button">로그인</button>
        </form>
        
        <div class="links">
            <a href="signup.php">회원가입</a>
            <span class="separator">|</span>
            <a href="index.php">홈으로 돌아가기</a>
        </div>
    </div>
    
    
</body>
</html>