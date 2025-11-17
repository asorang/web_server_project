// 1. "가짜 데이터" (Mock Data)
const mockHistoryData = [
    { 
        id: 1, 
        opponent: 'AI (백돌)', 
        result: '승리', 
        date: '2025-11-09',
        moves: [[7, 7], [7, 8], [8, 8], [8, 7], [6, 6], [6, 7], [9, 9], [9, 8], [5, 5]] 
    },
    { 
        id: 2, 
        opponent: 'AI (백돌)', 
        result: '패배', 
        date: '2025-11-08',
        moves: [[7, 7], [7, 8], [8, 8], [6, 8], [9, 9], [5, 8], [10, 10]] 
    },
    { 
        id: 3, 
        opponent: 'AI (백돌)', 
        result: '승리', 
        date: '2025-11-07',
        moves: [[6, 6], [5, 5], [6, 7], [5, 6], [6, 8], [5, 7], [6, 9], [5, 9], [6, 10]]
    }
];

// 2. 페이지(DOM)가 로드되면, 가짜 데이터를 테이블에 주입합니다.
document.addEventListener('DOMContentLoaded', () => {
    
    const tableBody = document.getElementById('history-table-body');
    const totalRecordTextEl = document.getElementById('total-record-text'); 
    const winRateTextEl = document.getElementById('win-rate-text'); // ★★★ (신규) ★★★

    // 총 전적 계산 로직
    let totalWins = 0;
    let totalLosses = 0;
    mockHistoryData.forEach(record => {
        if (record.result === '승리') {
            totalWins++;
        } else if (record.result === '패배') {
            totalLosses++;
        }
    });

    // ★★★ (신규) 승률 계산 로직 ★★★
    const totalGames = totalWins + totalLosses;
    // 0으로 나누는 오류 방지 (총 게임이 0이면 승률 0%)
    const winRate = (totalGames === 0) ? 0 : (totalWins / totalGames) * 100;
    // ★★★ (여기까지) ★★★

    // 계산된 전적을 텍스트 한 줄로 삽입
    totalRecordTextEl.innerText = `총 전적: ${totalWins}승 ${totalLosses}패`;
    // (신규) 승률 삽입 (소수점 첫째 자리까지)
    winRateTextEl.innerText = `승률: ${winRate.toFixed(1)}%`;


    // (기존) 테이블 채우기
    if (mockHistoryData.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="3">아직 게임 기록이 없습니다.</td></tr>';
        totalRecordTextEl.innerText = '총 전적: 0승 0패';
        winRateTextEl.innerText = '승률: 0.0%'; // (신규)
        return;
    }

    let htmlString = ''; 
    mockHistoryData.forEach(record => {
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

    // (기존) 테이블 클릭 이벤트
    tableBody.addEventListener('click', (event) => {
        const tr = event.target.closest('.review-link');
        
        if (tr) {
            const gameId = parseInt(tr.dataset.gameId, 10);
            const gameData = mockHistoryData.find(game => game.id === gameId);
            
            if (gameData) {
                sessionStorage.setItem('gameToReview', JSON.stringify(gameData));
                window.location.href = 'review.php'; 
            }
        }
    });
});