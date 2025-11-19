document.addEventListener('DOMContentLoaded', () => {
    const logoutButton = document.getElementById('logout-btn-settings');
    const deleteButton = document.getElementById('delete-account-btn');

    logoutButton.addEventListener('click', () => {
        sessionStorage.clear();
        alert('로그아웃 되었습니다.');
        window.location.href = 'index.php';
    });

    deleteButton.addEventListener('click', () => {
        if (confirm('정말로 계정을 탈퇴하시겠습니까?')) {
            // [Backend] 회원 탈퇴 API 호출
            // Method: DELETE /api/user/me
            // Header: Authorization Token 필요
            
            console.log('탈퇴 요청 전송');

            // TODO: 성공 시 로그아웃 처리 및 홈으로 이동
            /*
            sessionStorage.clear();
            window.location.href = 'index.php';
            */
        }
    });
});