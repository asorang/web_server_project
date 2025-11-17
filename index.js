// (핵심) 페이지가 로드될 때(DOMContentLoaded) 로그인 상태를 즉시 확인
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. 필요한 HTML 요소들을 모두 가져옵니다.
    const nicknameDisplayDiv = document.getElementById('user-nickname'); 
    const nicknameText = document.getElementById('nickname-text'); 
    const rankInfoEl = document.getElementById('rank-info-header');

    const mainActionButton = document.getElementById('main-action-button');
    const pvpButton = document.getElementById('pvp-button'); // ★★★ (신규) ★★★
    const historyButton = document.getElementById('view-history-button');
    const settingsButton = document.getElementById('settings-button'); 
    const signupButton = document.getElementById('signup-button');
    
    // 2. 세션 스토리지에서 정보 가져오기
    const loggedInUser = sessionStorage.getItem('userNickname'); 
    const userRank = sessionStorage.getItem('userRank'); 
    const userRating = sessionStorage.getItem('userRating'); 

    if (loggedInUser && userRank && userRating) {
        // 3. ★★★ 로그인 된 상태 ★★★
        nicknameText.innerText = loggedInUser + ' 님';
        rankInfoEl.innerText = `${userRank} ${userRating}점`;
        nicknameDisplayDiv.style.display = 'flex'; 
        
        mainActionButton.innerText = '봇과 플레이'; // ★★★ (수정) ★★★
        signupButton.style.display = 'none'; 

    } else {
        // 4. ★★★ 로그아웃 된 상태 ★★★
        nicknameDisplayDiv.style.display = 'none'; 
        mainActionButton.innerText = '로그인'; // (로그아웃 시에는 "로그인" 유지)
        pvpButton.innerText = '온라인 대전'; // (로그아웃 시에도 "온라인 대전" 유지)
        signupButton.style.display = 'block';
    }

    // 5. 버튼들에 클릭 이벤트를 할당합니다.
    
    // "봇과 플레이" / "로그인" 버튼
    mainActionButton.addEventListener('click', () => {
        if (loggedInUser) {
            window.location.href = 'game.php'; // 로그인 -> 봇 게임 시작
        } else {
            window.location.href = 'login.php'; // 로그아웃 -> 로그인 페이지로
        }
    });

    // ★★★ (신규) "온라인 대전" 버튼 ★★★
    pvpButton.addEventListener('click', () => {
        if (loggedInUser) {
            window.location.href = 'matchmaking.php'; // 로그인 -> 매칭 페이지
        } else {
            alert('로그인이 필요합니다.'); // 로그아웃 -> 경고창
        }
    });

    historyButton.addEventListener('click', () => {
        if (loggedInUser) {
            window.location.href = 'history.php'; 
        } else {
            alert('로그인이 필요합니다.'); 
        }
    });

    settingsButton.addEventListener('click', () => {
        if (loggedInUser) {
            window.location.href = 'settings.php'; 
        } else {
            alert('로그인이 필요합니다.'); 
        }
    });

    signupButton.addEventListener('click', () => {
        window.location.href = 'signup.php';
    });
});