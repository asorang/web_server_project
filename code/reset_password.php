
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>비밀번호 재설정</title>
    <link rel="stylesheet" href="style.css">
</head>
<body class="login-page"> 
    <div class="signup-container"> 
        <h2>회원가입</h2>
        
        <form id="signup-form" action="./actionCodes/reset_passwordSQL.php" method="POST">
            
            <div class="input-group full-width">
                <label for="userID">아이디</label>
                <input type="text" id="userID" name="userID" required>
            </div>
            
            <div class="input-group full-width">
                <label for="newpassword">새 비밀번호</label>
                <input type="password" id="newPassword" name="newPassword" required>
            </div>
          
            <button type="submit" class="login-button">비밀번호 변경</button>
        </form>
        
        
    </div>
</body>
</html>