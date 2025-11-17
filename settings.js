// 1. 페이지(DOM)가 로드되면, 버튼에 이벤트 리스너를 추가합니다.
document.addEventListener('DOMContentLoaded', () => {
    
    const logoutButton = document.getElementById('logout-btn-settings');
    const deleteButton = document.getElementById('delete-account-btn');

    // 2. 설정 페이지의 "로그아웃" 버튼 기능 (index.js와 동일)
    logoutButton.addEventListener('click', () => {
        // (세션 스토리지) 로그인 상태만 삭제
        sessionStorage.removeItem('userNickname');
        sessionStorage.removeItem('userImage'); 
        alert('로그아웃 되었습니다.');
        window.location.href = 'index.php'; // 홈으로 이동
    });


    // 3. ★★★ "계정 탈퇴" 버튼 기능 ★★★
    deleteButton.addEventListener('click', () => {
        
        // (A) 정말로 탈퇴할 것인지 확인창 띄우기
        const isConfirmed = confirm('정말로 계정을 탈퇴하시겠습니까?\n모든 게임 기록과 회원 정보가 영구적으로 삭제됩니다.');

        if (isConfirmed) {
            // (B) "확인"을 눌렀을 때 (시뮬레이션)
            
            // (1. 가짜 DB) 회원가입 정보(localStorage) 삭제
            // (실제로는 백엔드가 DB에서 삭제)
            
            // 로그인한 아이디 찾기 (localStorage에서 닉네임으로 아이디를 역추적)
            const loggedInNickname = sessionStorage.getItem('userNickname');
            let userIdToRemove = null;
            
            // localStorage를 순회하며 닉네임이 일치하는 아이디(Key)를 찾음
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (localStorage.getItem(key) === loggedInNickname) {
                    userIdToRemove = key;
                    break;
                }
            }
            if (userIdToRemove) {
                localStorage.removeItem(userIdToRemove); // 가짜 DB에서 삭제
                console.log('시뮬레이션: LocalStorage에서 ' + userIdToRemove + ' 삭제 완료');
            }

            // (2. 로그인 세션) 로그인 상태(sessionStorage) 삭제
            sessionStorage.clear(); // 세션 스토리지 전체 삭제
            
            alert('계정 탈퇴가 완료되었습니다. 이용해주셔서 감사합니다.');
            
            // (3) 홈으로 이동 (이제 로그아웃된 상태)
            window.location.href = 'index.php';
            
            // (C) "취소"를 눌렀을 때
        } else {
            alert('계정 탈퇴가 취소되었습니다.');
        }
    });

});