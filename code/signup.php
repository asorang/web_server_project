<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>오목 게임 - 회원가입</title>
    <link rel="stylesheet" href="style.css">
</head>
<body class="login-page"> 
    <div class="signup-container"> 
        <h2>회원가입</h2>
        
        <form id="signup-form" action="./actionCodes/signupSQL.php" method="POST">
            
            <div class="input-group full-width">
                <label for="userID">아이디</label>
                <input type="text" id="userID" name="userID" required>
            </div>
            
            <div class="input-group full-width">
                <label for="password">비밀번호</label>
                <input type="password" id="password" name="password" required>
            </div>
            
            <div class="input-group full-width">
                <label for="password-confirm">비밀번호 확인</label>
                <input type="password" id="password-confirm" name="password-confirm" required>
            </div>

            <div class="input-group">
                <label for="userNick">닉네임</label>
                <input type="text" id="userNick" name="userNick" required>
            </div>

            <div class="input-group">
                <label for="username">이름</label>
                <input type="text" id="username" name="username" required>
            </div>

            <div class="input-group">
                <label for="phone">전화번호</label>
                <input type="tel" id="phone" name="phone" placeholder="010-1234-5678">
            </div>

            <div class="input-group">
                <label for="userBirth">생년월일</label>
                <input type="date" id="userBirth" name="userBirth" required>
            </div>

            <div class="input-group full-width">
                <label>성별</label>
                <div class="gender-options">
                    <input type="radio" id="gender-male" name="userGender" value="male" required>
                    <label for="gender-male">남성</label>
                    
                    <input type="radio" id="gender-female" name="userGender" value="female">
                    <label for="gender-female">여성</label>
                </div>
            </div>
            
            <button type="submit" class="login-button">가입하기</button>
        </form>
        
        <div class="links">
            <a href="login.php">이미 계정이 있으신가요? (로그인)</a>
        </div>
    </div>
</body>
</html>