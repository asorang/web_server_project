// ★★★ (제거됨) 1. "가짜 데이터" (Mock Data) ★★★
// const mockHistoryData = [ ... ];

// 2. 페이지(DOM)가 로드되면, "진짜" 데이터를 가져옵니다.
document.addEventListener('DOMContentLoaded', () => {
    
    const tableBody = document.getElementById('history-table-body');
    const totalRecordTextEl = document.getElementById('total-record-text'); 
    const winRateTextEl = document.getElementById('win-rate-text'); 

    // ★★★ (수정) "계산 중..." 텍스트로 초기화 ★★★
    totalRecordTextEl.innerText = '총 전적: 불러오는 중...';
    winRateTextEl.innerText = '승률: 불러오는 중...';
    tableBody.innerHTML = '<tr><td colspan="3">기록을 불러오는 중...</td></tr>';

    
    // (백엔드 연동) TODO: 'get_history.php'를 완성하면 이 주석을 해제합니다.
    /*
    fetch('api/get_history.php') // (로그인 정보는 세션 쿠키로 자동 전송됨)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                
                // (1. 전적 요약 계산)
                const totalWins = data.summary.wins;
                const totalLosses = data.summary.losses;
                const totalGames = totalWins + totalLosses;
                const winRate = (totalGames === 0) ? 0 : (totalWins / totalGames) * 100;
                
                totalRecordTextEl.innerText = `총 전적: ${totalWins}승 ${totalLosses}패`;
                winRateTextEl.innerText = `승률: ${winRate.toFixed(1)}%`;

                // (2. 테이블 채우기)
                if (data.history.length === 0) {
                    tableBody.innerHTML = '<tr><td colspan="3">아직 게임 기록이 없습니다.</td></tr>';
                    return;
                }
                
                let htmlString = ''; 
                data.history.forEach(record => {
                    const resultClass = (record.result === '승리') ? 'result-win' : 'result-loss';
                    htmlString += `
                        <tr class="review-link" data-game-id="${record.id}" title="클릭해서 복기하기">
                            <td>${record.opponent}</td>
                            <td class="${resultClass}">${record.result}</td>
                            <td>${record.date}</td>
                        </tr>
                    `;
                });
                tableBody.innerHTML = htmlString;

                // (3. 테이블 클릭 이벤트)
                tableBody.addEventListener('click', (event) => {
                    const tr = event.target.closest('.review-link');
                    if (tr) {
                        const gameId = tr.dataset.gameId; 
                        window.location.href = `review.php?game_id=${gameId}`; 
                    }
                });

            } else {
                totalRecordTextEl.innerText = '총 전적: -';
                winRateTextEl.innerText = '승률: -';
                tableBody.innerHTML = '<tr><td colspan="3">기록을 불러오는 데 실패했습니다.</td></tr>';
            }
        })
        .catch(error => {
            console.error('서버 통신 오류:', error);
            totalRecordTextEl.innerText = '총 전적: -';
            winRateTextEl.innerText = '승률: -';
            tableBody.innerHTML = '<tr><td colspan="3">서버와 통신할 수 없습니다.</td></tr>';
        });
    */
});