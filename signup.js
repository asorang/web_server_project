// 1. HTML 요소 가져오기 (모든 필드)
const signupForm = document.getElementById('signup-form');
const usernameInput = document.getElementById('username'); 
const passwordInput = document.getElementById('password');
const passwordConfirmInput = document.getElementById('password-confirm');
const nicknameInput = document.getElementById('nickname');
const nameInput = document.getElementById('name');
const phoneInput = document.getElementById('phone');
const dobInput = document.getElementById('dob');

// 2. 폼(form) 제출 이벤트 리스너
signupForm.addEventListener('submit', (event) => {
    
    event.preventDefault();

    // 3. 입력된 값 가져오기
    const username = usernameInput.value;
    const password = passwordInput.value;
    const passwordConfirm = passwordConfirmInput.value;
    const nickname = nicknameInput.value;
    const name = nameInput.value;
    const phone = phoneInput.value;
    const dob = dobInput.value;
    const genderInput = document.querySelector('input[name="gender"]:checked');
    const gender = genderInput ? genderInput.value : null;

    // 4. (유지) 프론트엔드 유효성 검사
    if (!username || !password || !passwordConfirm || !nickname || !name || !phone || !dob || !gender) {
        alert('모든 필드를 입력해주세요.');
        return;
    }
    if (password !== passwordConfirm) {
        alert('비밀번호가 일치하지 않습니다. 다시 확인해주세요.');
        passwordInput.focus(); 
        return;
    }

    // ★★★ (제거됨) 가짜 회원가입(localStorage) 로직 ★★★
    // if (localStorage.getItem(username)) { ... }
    // localStorage.setItem(username, nickname);
    // alert(nickname + '님, 환영합니다!');
    // window.location.href = 'login.php';

    // ★★★ (신규) 실제 백엔드 연동 자리 ★★★
    // (백엔드 연동) TODO: 'signup_api.php'를 완성하면 이 주석을 해제합니다.
    
    console.log('백엔드 API 호출 준비: (모든 폼 데이터)');

    /*
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    formData.append('nickname', nickname);
    formData.append('name', name);
    formData.append('phone', phone);
    formData.append('dob', dob);
    formData.append('gender', gender);

    fetch('api/signup_api.php', { // (예시 API 경로)
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.');
            window.location.href = 'login.php';
        } else {
            alert('회원가입 실패: ' + data.message); // 예: "이미 사용 중인 아이디입니다."
        }
    })
    .catch(error => {
        console.error('서버 통신 오류:', error);
        alert('서버와 통신할 수 없습니다.');
    });
    */
});