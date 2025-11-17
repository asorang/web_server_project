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

    // ★★★ (제거됨) 가짜 로그인(localStorage, sessionStorage) 로직 ★★★
    // const storedNickname = localStorage.getItem(username);
    // if (storedNickname) { ... } else { ... }

    // ★★★ (신규) 실제 백엔드 연동 자리 ★★★
    // (백엔드 연동) TODO: 'login_api.php'를 완성하면 이 주석을 해제합니다.
    
    console.log('백엔드 API 호출 준비:', username, password);

    /*
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);

    fetch('api/login_api.php', { // (예시 API 경로)
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // (백엔드) 로그인 성공 시, 백엔드가 보내준 닉네임/급수/점수/이미지 저장
            // (참고: 실제로는 세션 쿠키를 사용하므로 JS에서 저장할 필요 없을 수 있음)
            sessionStorage.setItem('userNickname', data.nickname); 
            sessionStorage.setItem('userRank', data.rank); 
            sessionStorage.setItem('userRating', data.rating); 

            alert(data.nickname + '님, 환영합니다!');
            window.location.href = 'index.php';
        } else {
            // (백엔드) 로그인 실패
            alert('로그인 실패: ' + data.message);
        }
    })
    .catch(error => {
        console.error('서버 통신 오류:', error);
        alert('서버와 통신할 수 없습니다.');
    });
    */
});