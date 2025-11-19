const loginForm = document.getElementById('login-form');
const usernameInput = document.getElementById('username'); 
const passwordInput = document.getElementById('password');

loginForm.addEventListener('submit', (event) => {
    event.preventDefault(); 
    const username = usernameInput.value; 
    const password = passwordInput.value; 

    // [Backend] 로그인 API 호출
    // Method: POST /api/login
    // Body: { username, password }
    // Response: { token, nickname, rank, rating }
    
    console.log('로그인 요청:', username);
    
    // TODO: 백엔드 응답 성공 시 아래 로직 실행
    /*
    sessionStorage.setItem('userNickname', response.nickname);
    sessionStorage.setItem('userRank', response.rank);
    sessionStorage.setItem('userRating', response.rating);
    window.location.href = 'index.php';
    */
});