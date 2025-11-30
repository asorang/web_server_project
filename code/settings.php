<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <title>환경 설정 - Gomoku</title>
    <link rel="stylesheet" href="style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body class="settings-page"> 
    <div class="settings-container">
        <div class="settings-header">
            <h1><i class="fas fa-cog"></i> 환경 설정</h1>
        </div>
        
        <div class="settings-body">
            <section class="settings-section">
                <h2><i class="fas fa-user"></i> 계정 정보</h2>
                <div class="profile-card">
                    <div class="info-row">
                        <label>닉네임</label>
                        <input type="text" value="" placeholder="DB 데이터" readonly>
                    </div>
                    <div class="info-row">
                        <label>아이디</label>
                        <input type="text" value="" placeholder="DB 데이터" readonly>
                    </div>
                    <div class="info-row">
                        <label>이름</label>
                        <input type="text" value="" placeholder="DB 데이터" readonly>
                    </div>
                    <div class="info-row">
                        <label>가입일</label>
                        <input type="text" value="" placeholder="DB 데이터" readonly>
                    </div>
                    <div class="info-row">
                        <label>현재 점수</label>
                        <input type="text" value="" placeholder="DB 데이터" readonly style="color: #00FFFF;">
                    </div>
                </div>
            </section>

            <section class="settings-section">
                <h2><i class="fas fa-volume-up"></i> 게임 설정</h2>
                <form action="./actionCodes/save_settings.php" method="POST">
                    <div class="audio-control">
                        <label for="bgm-volume">배경음 (BGM)</label>
                        <div class="range-wrapper">
                            <i class="fas fa-music"></i>
                            <input type="range" id="bgm-volume" name="bgm-volume" min="0" max="100" value="50">
                        </div>
                    </div>
                    <div class="audio-control">
                        <label for="sfx-volume">효과음 (SFX)</label>
                        <div class="range-wrapper">
                            <i class="fas fa-chess-pawn"></i>
                            <input type="range" id="sfx-volume" name="sfx-volume" min="0" max="100" value="80">
                        </div>
                    </div>
                    <button type="submit" class="btn-save"><i class="fas fa-save"></i> 설정 저장</button>
                </form>
            </section>

            <section class="settings-section danger-zone">
                <h2><i class="fas fa-exclamation-triangle"></i> 위험 구역</h2>
                <div class="danger-box">
                    <p>계정을 삭제하면 모든 기록과 점수가 영구적으로 사라집니다.</p>
                    <button id="delete-account-btn" class="btn-delete">계정 탈퇴하기</button>
                </div>
            </section>
        </div>

        <div class="settings-footer">
            <a href="main.php" class="btn-back"><i class="fas fa-arrow-left"></i> 홈으로 돌아가기</a>
        </div>
    </div>

    <script src="settings.js"></script> 
</body>
</html>