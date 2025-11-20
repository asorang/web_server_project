const signupForm = document.getElementById('signup-form');

signupForm.addEventListener('submit', (event) => {
    
    // 비밀번호 확인을 위한 요소 가져오기
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;

    // 비밀번호 일치 검사
    if (password !== passwordConfirm) {
        alert('비밀번호가 일치하지 않습니다. 다시 확인해주세요.');
        document.getElementById('password').focus(); 
        event.preventDefault(); // 전송 막기
        return;
    }

    // 검사 통과 시 form submit (POST 전송)
});