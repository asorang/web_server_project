const signupForm = document.getElementById('signup-form');

signupForm.addEventListener('submit', (event) => {
    event.preventDefault();

    // 입력값 가져오기
    const formData = {
        username: document.getElementById('username').value,
        password: document.getElementById('password').value,
        nickname: document.getElementById('nickname').value,
        name: document.getElementById('name').value,
        phone: document.getElementById('phone').value,
        dob: document.getElementById('dob').value,
        gender: document.querySelector('input[name="gender"]:checked')?.value
    };
    
    const pwConfirm = document.getElementById('password-confirm').value;

    if (formData.password !== pwConfirm) {
        alert('비밀번호가 일치하지 않습니다.');
        return;
    }

    // [Backend] 회원가입 API 호출
    // Method: POST /api/signup
    // Body: JSON.stringify(formData)
    
    console.log('회원가입 데이터 전송:', formData);

    // TODO: 백엔드 응답 성공 시 window.location.href = 'login.php';
});