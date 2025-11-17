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

    // 4. 프론트엔드 유효성 검사
    if (!username || !password || !passwordConfirm || !nickname || !name || !phone || !dob || !gender) {
        alert('모든 필드를 입력해주세요.');
        return;
    }
    if (password !== passwordConfirm) {
        alert('비밀번호가 일치하지 않습니다. 다시 확인해주세요.');
        passwordInput.focus(); 
        return;
    }

    // 5. ★★★ (수정) 가짜 DB (localStorage)에 아이디/닉네임 저장 ★★★
    // (백엔드가 없어도 로그인 시 닉네임을 찾을 수 있도록 시뮬레이션)
    
    // (A) 이미 아이디가 있는지 확인
    if (localStorage.getItem(username)) {
        alert('시뮬레이션: 이미 사용 중인 아이디입니다.');
        usernameInput.focus();
        return;
    }

    // (B) 아이디를 Key로, 닉네임을 Value로 저장
    localStorage.setItem(username, nickname);
    // (실제로는 { pw: password, name: name ... } 객체를 저장해야 함)
    
    console.log('회원가입 시도 (백엔드로 보낼 데이터):');
    console.log({ username, password, nickname, name, phone, dob, gender });
    
    alert(nickname + '님, 환영합니다! 회원가입이 완료되었습니다.');

    // 가입 성공 시 로그인 페이지로 이동
    window.location.href = 'login.php';
});