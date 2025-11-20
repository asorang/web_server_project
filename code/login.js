const loginForm = document.getElementById('login-form');
const idInput = document.getElementById('userID'); 
const pwInput = document.getElementById('userPassword');

loginForm.addEventListener('submit', (event) => {
    // 입력값 가져오기 (공백 제거)
    const idValue = idInput.value.trim();
    const pwValue = pwInput.value.trim();

    // 프론트엔드 유효성 검사: 빈칸 확인
    if (idValue === "" || pwValue === "") {
        alert('아이디와 비밀번호를 모두 입력하세요.');
        event.preventDefault(); // 전송 막기
        return;
    }

    // 검사 통과 시 form의 action 경로로 POST 전송됨
});