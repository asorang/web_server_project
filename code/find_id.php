<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>오목 게임 - 아이디 찾기</title>
    <link rel="stylesheet" href="style.css">
</head>
<body class="login-page"> 

    <div class="find-container">
        <h2>아이디 찾기</h2>
        <p class="find-desc">가입 시 등록한 이름과 전화번호를 입력하세요.</p>
        
        <form action="./actionCodes/findIdSQL.php" method="POST">
            
            <div class="find-input-group">
                <label for="username">이름</label>
                <input type="text" id="username" name="username" required>
            </div>
            
            <div class="find-input-group">
                <label for="phone">전화번호</label>
                <input type="tel" id="phone" name="phone" placeholder="010-1234-5678" required>
            </div>
            
            <button type="submit" class="btn-find-submit">아이디 찾기</button>
        </form>
        
        <div class="find-links">
            <a href="login.php">로그인으로 돌아가기</a>
            <span class="separator">|</span>
            <a href="find_pw.php">비밀번호 찾기</a>
        </div>
    </div>
    
</body>
</html>