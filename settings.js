// 1. 페이지(DOM)가 로드되면, 버튼에 이벤트 리스너를 추가합니다.
document.addEventListener('DOMContentLoaded', () => {
    
    const logoutButton = document.getElementById('logout-btn-settings');
    const deleteButton = document.getElementById('delete-account-btn');

    // 2. "로그아웃" 버튼 기능
    logoutButton.addEventListener('click', () => {
        
        // ★★★ (제거됨) 가짜 로그아웃(sessionStorage) 로직 ★★★
        // sessionStorage.clear();
        // alert('로그아웃 되었습니다.');
        // window.location.href = 'index.php'; 

        // (백엔드 연동) TODO: 'logout_api.php'를 완성하면 주석 해제합니다.
        /*
        fetch('api/logout_api.php', { method: 'POST' })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    sessionStorage.clear(); // (프론트엔드에서도 세션 비움)
                    alert('로그아웃 되었습니다.');
                    window.location.href = 'index.php';
                }
            });
        */
    });


    // 3. "계정 탈퇴" 버튼 기능
    deleteButton.addEventListener('click', () => {
        
        const isConfirmed = confirm('정말로 계정을 탈퇴하시겠습니까?\n모든 게임 기록과 회원 정보가 영구적으로 삭제됩니다.');

        if (isConfirmed) {
            
            // ★★★ (제거됨) 가짜 계정탈퇴(localStorage/sessionStorage) 로직 ★★★
            // localStorage.removeItem(...);
            // sessionStorage.clear();
            // alert('계정 탈퇴가 완료되었습니다.');
            // window.location.href = 'index.php';

            // (백엔드 연동) TODO: 'delete_account_api.php'를 완성하면 주석 해제합니다.
            /*
            fetch('api/delete_account_api.php', { method: 'POST' })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        localStorage.clear(); 
                        sessionStorage.clear(); 
                        alert('계정 탈퇴가 완료되었습니다.');
                        window.location.href = 'index.php';
                    } else {
                        alert('계정 탈퇴 실패: ' + data.message);
                    }
                });
            */

        } else {
            alert('계정 탈퇴가 취소되었습니다.');
        }
    });

});