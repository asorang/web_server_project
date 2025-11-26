<?php
    session_start();
    
    // 로그인 체크
    $isLoggedIn = isset($_SESSION['uid']);
    $nickname = isset($_SESSION['userNick']) ? $_SESSION['userNick'] : 'Guest';
?>
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gomoku.com - 무료 온라인 오목</title>
    <link rel="stylesheet" href="style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>
    <nav class="navbar">
        <div class="nav-container">
            <a href="main.php" class="logo"><i class="fas fa-chess-board"></i> Gomoku</a>
            
            <ul class="nav-menu">
                <li><a href="main.php" class="nav-link active">홈</a></li>
                <?php if ($isLoggedIn): ?>
                    <li><a href="history.php" class="nav-link">기록</a></li>
                    <li><a href="settings.php" class="nav-link">설정</a></li>
                <?php endif; ?>
            </ul>

            <div class="nav-auth">
                <?php if ($isLoggedIn): ?>
                    <span class="nav-user-info"><i class="fas fa-user-circle"></i> <?php echo $nickname; ?>님</span>
                <?php else: ?>
                    <a href="login.php" class="btn-outline">로그인</a>
                    <a href="signup.php" class="btn-solid">회원가입</a>
                <?php endif; ?>
            </div>
        </div>
    </nav>

    <section class="hero">
        <div class="hero-content">
            <h1>무료 온라인 오목</h1>
            <p>클래식한 오목 게임의 새로운 경험.<br>전 세계 플레이어와 실시간으로 대결하거나<br>스마트 AI에 도전하세요!</p>
            
            <div class="hero-buttons">
                <?php if ($isLoggedIn): ?>
                    <button class="btn-play-single" onclick="openSingleSetup()">
                        <div class="btn-icon"><i class="fas fa-robot"></i></div>
                        <div class="btn-text">
                            <span class="btn-title">싱글 플레이</span>
                            <span class="btn-desc">AI와 대결하기</span>
                        </div>
                    </button>
                    
                    <button class="btn-play-online" onclick="openMatchmaking()">
                        <div class="btn-icon"><i class="fas fa-globe"></i></div>
                        <div class="btn-text">
                            <span class="btn-title">온라인 대전</span>
                            <span class="btn-desc">유저와 매칭하기</span>
                        </div>
                    </button>
                <?php else: ?>
                    <button class="btn-play-single" onclick="location.href='login.php'">
                        <div class="btn-icon"><i class="fas fa-lock"></i></div>
                        <div class="btn-text">
                            <span class="btn-title">싱글 플레이</span>
                            <span class="btn-desc">로그인이 필요합니다</span>
                        </div>
                    </button>
                    <button class="btn-play-online" onclick="location.href='login.php'">
                        <div class="btn-icon"><i class="fas fa-lock"></i></div>
                        <div class="btn-text">
                            <span class="btn-title">온라인 대전</span>
                            <span class="btn-desc">로그인이 필요합니다</span>
                        </div>
                    </button>
                <?php endif; ?>
            </div>
        </div>

        <div class="hero-image">
            <img src="main_image.png" alt="오목 메인 이미지">
        </div>
    </section>

    <section class="features">
        <div class="feature-card">
            <i class="fas fa-brain feature-icon"></i>
            <h3>스마트 AI</h3>
            <p>초보자부터 고수까지<br>맞춤형 난이도 제공</p>
        </div>
        <div class="feature-card highlight">
            <i class="fas fa-bolt feature-icon"></i>
            <h3>빠른 매칭</h3>
            <p>기다림 없이 바로 시작하는<br>실시간 대전 시스템</p>
        </div>
        <div class="feature-card">
            <i class="fas fa-chart-line feature-icon"></i>
            <h3>전적 분석</h3>
            <p>나의 승률과 기록을<br>한눈에 확인하세요</p>
        </div>
    </section>

    <div id="single-modal" class="modal-overlay">
        <div class="matchmaking-container"> <h2>AI 난이도 선택</h2>
            <p style="color: #ccc; margin-bottom: 15px;">도전할 상대의 실력을 선택하세요.</p>
            
            <div class="difficulty-list" style="width: 100%; display: flex; flex-direction: column; gap: 10px; margin-bottom: 15px;">
                <button onclick="startGame('easy')" class="btn-diff easy">
                    <span>🌱 초급</span> <span>(입문자용)</span>
                </button>
                <button onclick="startGame('medium')" class="btn-diff medium">
                    <span>⚔️ 중급</span> <span>(숙련자용)</span>
                </button>
                <button onclick="startGame('hard')" class="btn-diff hard">
                    <span>🔥 상급</span> <span>(고수용)</span>
                </button>
            </div>

            <button id="cancel-matchmaking" onclick="closeSingleSetup()">취소</button>
        </div>
    </div>

    <div id="match-modal" class="modal-overlay">
        <div class="matchmaking-container">
            <h2>대전 상대 찾는 중...</h2>
            <div class="spinner"></div>
            <p style="color: #bababa; font-size: 14px; margin-top: 10px;">상대를 찾고 있습니다.</p>
            <button id="cancel-matchmaking" onclick="closeMatchmaking()">매칭 취소</button>
        </div>
    </div>

    <script>
        // 싱글 플레이 모달 열기/닫기
        function openSingleSetup() {
            document.getElementById('single-modal').style.display = 'flex';
        }
        function closeSingleSetup() {
            document.getElementById('single-modal').style.display = 'none';
        }

        // 게임 시작 (난이도 값을 가지고 이동)
        function startGame(level) {
            // game.php로 이동하면서 난이도 정보를 보냄 (예: game.php?level=hard)
            location.href = 'game.php?level=' + level;
        }

        // 온라인 매칭 모달 열기/닫기
        function openMatchmaking() {
            document.getElementById('match-modal').style.display = 'flex';
        }
        function closeMatchmaking() {
            document.getElementById('match-modal').style.display = 'none';
        }
    </script>

</body>
</html>