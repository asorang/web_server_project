// (핵심) 페이지가 로드될 때(DOMContentLoaded) 버튼에 링크만 연결합니다.
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. 필요한 HTML 요소들을 모두 가져옵니다.
    const mainActionButton = document.getElementById('main-action-button');
    const pvpButton = document.getElementById('pvp-button');
    const historyButton = document.getElementById('view-history-button');
    const settingsButton = document.getElementById('settings-button'); 
    const signupButton = document.getElementById('signup-button');
    
    // 2. ★★★ (제거됨) 로그인 상태 확인(sessionStorage) 로직 ★★★
    // 닉네임, 급수, 점수 표시 로직이 모두 삭제되었습니다.
    // (백엔드 연동)
    // TODO: 이 페이지 로드 시, 백엔드에 '내 정보'를 fetch로 요청해서
    // 닉네임/급수/점수/로그인 상태를 받아와서 UI를 업데이트해야 합니다.
    /*
    fetch('api/get_user_info.php')
        .then(response => response.json())
        .then(data => {
            if (data.isLoggedIn) {
                // (로그인 된 상태 UI)
                const nicknameDisplayDiv = document.getElementById('user-nickname'); 
                const nicknameText = document.getElementById('nickname-text'); 
                const rankInfoEl = document.getElementById('rank-info-header');
                
                nicknameText.innerText = data.nickname + ' 님';
                rankInfoEl.innerText = `${data.rank} ${data.rating}점`;
                nicknameDisplayDiv.style.display = 'flex'; 
                
                document.getElementById('main-action-button').innerText = '봇과 플레이';
                document.getElementById('signup-button').style.display = 'none';
            } else {
                // (로그아웃 된 상태 UI)
                document.getElementById('main-action-button').innerText = '로그인';
                document.getElementById('signup-button').style.display = 'block';
            }
        });
    */

    
    // 3. 버튼들에 클릭 이벤트를 할당합니다.
    
    // "봇과 플레이" 버튼
    // (수정) 로그인 여부를 묻지 않고, 누르면 'game.php'로 갑니다.
    // (백엔드 연동) TODO: 'game.php' 페이지 자체가 로그인 여부를 확인해야 함
    mainActionButton.addEventListener('click', () => {
        // (로그인 확인 로직이 있던 if (loggedInUser) ... else ... 삭제됨)
        window.location.href = 'game.php'; 
    });

    // "온라인 대전" 버튼
    pvpButton.addEventListener('click', () => {
        // (로그인 확인 로직 삭제됨)
        // (백엔드 연동) TODO: 'matchmaking.php' 페이지 자체가 로그인 여부를 확인해야 함
        window.location.href = 'matchmaking.php'; 
    });

    // "기록 보기" 버튼
    historyButton.addEventListener('click', () => {
        // (로그인 확인 로직 삭제됨)
        window.location.href = 'history.php'; 
    });

    // "설정" 버튼
    settingsButton.addEventListener('click', () => {
        // (로그인 확인 로직 삭제됨)
        window.location.href = 'settings.php'; 
    });

    // "회원가입" 버튼
    signupButton.addEventListener('click', () => {
        window.location.href = 'signup.php';
    });
});