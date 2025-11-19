document.addEventListener('DOMContentLoaded', () => {
    
    // [Backend] 1. 웹소켓 연결 또는 매칭 큐 API 호출
    // emit('joinQueue', { userId, rank })
    console.log('매칭 큐 진입 요청');

    // [Backend] 2. 매칭 성공 이벤트 수신 시 게임 페이지로 이동
    // on('matchFound', (roomId) => { window.location.href = `game_pvp.php?room=${roomId}`; })

    // 매칭 취소 버튼
    document.getElementById('cancel-matchmaking').addEventListener('click', () => {
        // [Backend] 매칭 취소 이벤트 전송
        // emit('leaveQueue')
        console.log('매칭 취소 요청');
        window.location.href = 'index.php';
    });
});