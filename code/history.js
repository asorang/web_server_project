document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.getElementById('history-table-body');

    // [Backend] 유저 전적 리스트 API 호출
    // GET /api/user/history
    // Response: [ {id:1, result:'win', date:'...'}, ... ]
    
    console.log('전적 데이터 요청');

    // TODO: 응답받은 데이터로 tableBody에 tr 추가 (반복문)
    
    // 리스트 클릭 시 상세(복기) 페이지로 이동
    tableBody.addEventListener('click', (event) => {
        const tr = event.target.closest('tr');
        if (tr) {
            const gameId = tr.dataset.gameId;
            // [Backend] 상세 게임 데이터를 가져와서 복기 페이지로 넘김
            window.location.href = `review.php?gameId=${gameId}`;
        }
    });
});