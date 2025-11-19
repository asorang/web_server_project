document.addEventListener('DOMContentLoaded', () => {
    // [Backend] 페이지 로드 시 세션/쿠키 확인하여 로그인 상태 동기화 필요
    
    const loggedInUser = sessionStorage.getItem('userNickname');
    const userRank = sessionStorage.getItem('userRank');
    const userRating = sessionStorage.getItem('userRating');

    const nicknameDisplayDiv = document.getElementById('user-nickname'); 
    const signupButton = document.getElementById('signup-button');
    const mainBtn = document.getElementById('main-action-button');

    if (loggedInUser) {
        // 로그인 상태 UI
        document.getElementById('nickname-text').innerText = loggedInUser + ' 님';
        document.getElementById('rank-info-header').innerText = `${userRank} ${userRating}점`;
        nicknameDisplayDiv.style.display = 'flex';
        signupButton.style.display = 'none';
        mainBtn.innerText = '봇과 플레이';
    } else {
        // 비로그인 상태 UI
        nicknameDisplayDiv.style.display = 'none';
        mainBtn.innerText = '로그인';
    }

    // 이벤트 리스너
    document.getElementById('main-action-button').addEventListener('click', () => {
        window.location.href = loggedInUser ? 'game.php' : 'login.php';
    });

    document.getElementById('pvp-button').addEventListener('click', () => {
        if (!loggedInUser) return alert('로그인이 필요합니다.');
        window.location.href = 'matchmaking.php';
    });

    document.getElementById('view-history-button').addEventListener('click', () => {
        if (!loggedInUser) return alert('로그인이 필요합니다.');
        window.location.href = 'history.php';
    });

    document.getElementById('settings-button').addEventListener('click', () => {
        if (!loggedInUser) return alert('로그인이 필요합니다.');
        window.location.href = 'settings.php';
    });

    signupButton.addEventListener('click', () => window.location.href = 'signup.php');
});