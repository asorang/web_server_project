// 1. HTML 요소 가져오기
const loginForm = document.getElementById('login-form');
const usernameInput = document.getElementById('username'); 
const passwordInput = document.getElementById('password');

// 2. 폼(form) 제출 이벤트 리스너
loginForm.addEventListener('submit', (event) => {
    
    event.preventDefault(); 

    const username = usernameInput.value; 
    const password = passwordInput.value; 

    if (username === "" || password === "") {
        alert('아이디와 비밀번호를 모두 입력하세요.');
        return;
    }

    // 가짜 DB (localStorage)에서 닉네임 조회
    const storedNickname = localStorage.getItem(username);
    
    if (storedNickname) {
        // (시뮬레이션) 로그인 성공!
        
        // ★★★ (수정) 닉네임, 급수, 점수를 세션에 저장 ★★★
        sessionStorage.setItem('userNickname', storedNickname);
        sessionStorage.setItem('userRank', '10급'); // (가짜) 급수
        sessionStorage.setItem('userRating', '1500'); // (가짜) 점수
        // (userImage는 프로필 기능 복원 시 추가)

        alert(storedNickname + '님, 환영합니다!');
        
        window.location.href = 'index.php'; 

    } else {
        // (시뮬레이션) 로그인 실패
        alert('시뮬레이션: 아이디가 존재하지 않습니다. 회원가입을 먼저 해주세요.');
        usernameInput.focus();
    }
});