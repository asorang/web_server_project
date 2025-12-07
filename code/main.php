<?php
require "./actionCodes/DB.php";
session_start();
$uid = $_SESSION['uid'] ?? 0 ;
$stmt = $conn->prepare("SELECT score, games_played, win_rate FROM userRating WHERE uid = ?");
    $stmt->bind_param( "i", $uid);
    $stmt->execute();
    $stmt->store_result();   
      
    if ($stmt->num_rows === 1) {
        $stmt->bind_result($score,$games_played,$win_rate); // 컬럼 값을 변수에 바인딩
        $stmt->fetch();
        $_SESSION['score'] = $score;
        $_SESSION['played'] = $games_played;
        $_SESSION['win_rate'] = $win_rate;
      }    
      $stmt->close();
    // 로그인 체크
    $isLoggedIn = isset($_SESSION['uid']);
    $nickname = isset($_SESSION['userNick']) ? $_SESSION['userNick'] : (isset($_SESSION['nickname']) ? $_SESSION['nickname'] : 'Guest');
    $score = $_SESSION['score'] ?? 500;
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
                    <div class="my-score-box">
                        <span class="score-text"><i class="fas fa-trophy"></i> <?php echo $score ?>점</span>
                        <span class="grade-badge">급수</span>
                    </div>

                    <div class="profile-dropdown">
                        <div class="profile-trigger" onclick="toggleProfileMenu()">
                            <i class="fas fa-user-circle"></i> <?php echo $nickname; ?>님 <i class="fas fa-caret-down"></i>
                        </div>
                        <div id="profile-menu" class="dropdown-content">
                            <a href="logout.php" class="dropdown-item"><i class="fas fa-sign-out-alt"></i> 로그아웃</a>
                        </div>
                    </div>
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
                    
                    <button class="btn-play-online" onclick="location.href='./playcodes/PlayerMatch.php'">
                        <div class="btn-icon"><i class="fas fa-user-friends"></i></div>
                        <div class="btn-text">
                            <span class="btn-title">친선 대전</span>
                            <span class="btn-desc">친구와 2인용 하기</span>
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
                            <span class="btn-title">친선 대전</span>
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
        <div class="matchmaking-container">
            <h2>AI 난이도 선택</h2>
            <p style="color: #ccc; margin-bottom: 15px;">도전할 급수를 선택하세요.</p>
            
            <div class="difficulty-list scrollable-list">
                <button onclick="startGame('seed')" class="btn-diff seed">
                    <div class="diff-left"><span class="diff-name">🌱 새싹</span><span class="diff-grade">14급 ~ 11급</span></div><span class="diff-score">~ 799점</span>
                </button>
                <button onclick="startGame('beginner')" class="btn-diff beginner">
                    <div class="diff-left"><span class="diff-name">🐣 초급</span><span class="diff-grade">10급 ~ 7급</span></div><span class="diff-score">800 ~ 1199점</span>
                </button>
                <button onclick="startGame('intermediate')" class="btn-diff intermediate">
                    <div class="diff-left"><span class="diff-name">⚔️ 중급</span><span class="diff-grade">6급 ~ 4급</span></div><span class="diff-score">1200 ~ 1499점</span>
                </button>
                <button onclick="startGame('advanced')" class="btn-diff advanced">
                    <div class="diff-left"><span class="diff-name">🏅 고급</span><span class="diff-grade">3급 ~ 1급</span></div><span class="diff-score">1500 ~ 1799점</span>
                </button>
                <button onclick="startGame('super')" class="btn-diff super">
                    <div class="diff-left"><span class="diff-name">💎 초고급</span><span class="diff-grade">1단 ~ 3단</span></div><span class="diff-score">1800 ~ 2099점</span>
                </button>
                <button onclick="startGame('hell')" class="btn-diff hell">
                    <div class="diff-left"><span class="diff-name">👹 극악</span><span class="diff-grade">4단 ~ 5단</span></div><span class="diff-score">2100 ~ 2299점</span>
                </button>
                <button onclick="startGame('pro')" class="btn-diff pro">
                    <div class="diff-left"><span class="diff-name">👑 프로</span><span class="diff-grade">6단 ~ 7단</span></div><span class="diff-score">2300 ~ 2799점</span>
                </button>
            </div>

            <button id="cancel-matchmaking" onclick="closeSingleSetup()" style="margin-top: 15px;">취소</button>
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
        const USER_ID = <?php echo json_encode($uid); ?>;
        // 프로필 메뉴 토글 (추가됨)
        function toggleProfileMenu() {
            var menu = document.getElementById("profile-menu");
            menu.classList.toggle("show");
        }

        // 화면 다른 곳 클릭 시 메뉴 닫기 (추가됨)
        window.onclick = function(event) {
            if (!event.target.matches('.profile-trigger') && !event.target.matches('.profile-trigger *')) {
                var dropdowns = document.getElementsByClassName("dropdown-content");
                for (var i = 0; i < dropdowns.length; i++) {
                    var openDropdown = dropdowns[i];
                    if (openDropdown.classList.contains('show')) {
                        openDropdown.classList.remove('show');
                    }
                }
            }
        }

        function openSingleSetup() {
            document.getElementById('single-modal').style.display = 'flex';
        }
        function closeSingleSetup() {
            document.getElementById('single-modal').style.display = 'none';
        }
        function startGame(level) {
            location.href = './playcodes/AIMatch.php?level=' + level;
        }
        function openMatchmaking() {
            document.getElementById('match-modal').style.display = 'flex';
        }
        function closeMatchmaking() {
            document.getElementById('match-modal').style.display = 'none';
        }
    </script>
</body>
</html>