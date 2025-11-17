// 1. 페이지(DOM)가 로드되면 "가짜" 매칭 시작
document.addEventListener('DOMContentLoaded', () => {
    
    // 2. 3초 뒤에 매칭이 성공했다고 시뮬레이션
    const matchmakingTimer = setTimeout(() => {
        alert('상대방을 찾았습니다! 게임을 시작합니다.');
        
        // ★★★ (신규) "온라인 대전(PVP)" 전용 게임방으로 이동 ★★★
        window.location.href = 'game_pvp.php'; 

    }, 3000); // 3초 (3000ms)

    
    // 3. 매칭 취소 버튼
    const cancelButton = document.getElementById('cancel-matchmaking');
    cancelButton.addEventListener('click', () => {
        clearTimeout(matchmakingTimer); // 3초 타이머 취소
        alert('매칭이 취소되었습니다.');
        window.location.href = 'index.php'; // 홈으로 돌아가기
    });
});