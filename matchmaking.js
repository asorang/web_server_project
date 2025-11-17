// 1. 페이지(DOM)가 로드되면 "가짜" 매칭 시작
document.addEventListener('DOMContentLoaded', () => {
    
    // ★★★ (제거됨) 3초 뒤에 매칭이 성공했다는 시뮬레이션 ★★★
    // const matchmakingTimer = setTimeout(() => { ... }); 

    // (백엔드 연동) TODO: 웹소켓 서버를 완성하면 이 주석을 해제합니다.
    /*
    // 예시:
    // const websocket = new WebSocket('ws://localhost:8080'); // (백엔드 서버 주소)

    // (1) 서버에 접속 성공 시
    // websocket.onopen = () => {
    //    console.log('매칭 서버에 연결되었습니다.');
    //    // 서버에 '매칭 시작' 요청
    //    websocket.send(JSON.stringify({ type: 'start_matchmaking' }));
    // };

    // (2) 서버에서 메시지를 받았을 때
    // websocket.onmessage = (event) => {
    //    const data = JSON.parse(event.data);
    //    if (data.type === 'match_found') {
    //        alert('상대방을 찾았습니다! 게임을 시작합니다.');
    //        // (서버가 알려준 PVP 방으로 이동)
    //        window.location.href = `game_pvp.php?room_id=${data.roomId}`;
    //    }
    // };
    */
    
    // 3. 매칭 취소 버튼
    const cancelButton = document.getElementById('cancel-matchmaking');
    cancelButton.addEventListener('click', () => {
        // (제거됨) clearTimeout(matchmakingTimer); 
        
        // (신규) 웹소켓 연결이 있다면 끊음
        // if (websocket) { websocket.close(); } 
        
        alert('매칭이 취소되었습니다.');
        window.location.href = 'index.php'; // 홈으로 돌아가기
    });
});