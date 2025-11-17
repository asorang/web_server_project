// 1. 페이지 로드 시 로그인 정보 설정
document.addEventListener('DOMContentLoaded', () => {
    // ★★★ (제거됨) 닉네임/급수 로직 ★★★
    // (백엔드 연동) TODO: 'game.php' 페이지가 로드될 때 
    // fetch로 '내 정보'와 'AI 정보'를 받아와서 채워야 합니다.
    
    document.getElementById('player-name-game').innerText = '나 (흑돌)';
    document.getElementById('player-rank-game').innerText = '(?급 | ????점)';
});


// 2. 캔버스 및 그리기 도구
const canvas = document.getElementById('omok-board');
const ctx = canvas.getContext('2d');
// ... (캔버스 설정 동일) ...
const BOARD_SIZE = 15;
const LINE_COUNT = BOARD_SIZE - 1;
const GRID_SIZE = 40;
const PADDING = 20;
canvas.width = PADDING * 2 + LINE_COUNT * GRID_SIZE;
canvas.height = PADDING * 2 + LINE_COUNT * GRID_SIZE;

// ★★★ (제거됨) 3. 타이머 및 게임 상태 변수 ★★★
// ★★★ (제거됨) 4. 오목판 상태 (boardState) ★★★

// 5. DOM 요소 (모달은 남겨둠)
const modalOverlay = document.getElementById('end-game-modal');
const modalMessage = document.getElementById('modal-message');
const rematchButton = document.getElementById('rematch-button');
const modalHomeButton = document.getElementById('modal-home-button');


// 6. 오목판 그리기 함수 (drawBoard)
// (오목판을 그리는 기능은 유지)
function drawBoard() {
    ctx.fillStyle = '#f3d7a1'; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#000000'; 
    ctx.lineWidth = 1;
    for (let i = 0; i < BOARD_SIZE; i++) {
        const y = PADDING + i * GRID_SIZE;
        const x = PADDING + i * GRID_SIZE;
        ctx.beginPath(); ctx.moveTo(PADDING, y); ctx.lineTo(canvas.width - PADDING, y); ctx.stroke(); 
        ctx.beginPath(); ctx.moveTo(x, PADDING); ctx.lineTo(x, canvas.height - PADDING,); ctx.stroke(); 
    }
    const hotPoints = [[3, 3], [3, 11], [11, 3], [11, 11], [7, 7]];
    ctx.fillStyle = '#000000';
    hotPoints.forEach(([x, y]) => {
        const realX = PADDING + x * GRID_SIZE;
        const realY = PADDING + y * GRID_SIZE;
        ctx.beginPath(); ctx.arc(realX, realY, 5, 0, 2 * Math.PI); ctx.fill();
    });
    ctx.fillStyle = '#333'; ctx.font = '14px Arial'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    const letters = 'ABCDEFGHIJKLMNO';
    for (let i = 0; i < BOARD_SIZE; i++) {
        const x = PADDING + i * GRID_SIZE;
        const y = PADDING + i * GRID_SIZE;
        ctx.fillText(letters[i], x, PADDING / 2); 
        ctx.fillText(letters[i], x, canvas.height - (PADDING / 2)); 
        ctx.fillText(String(i + 1), PADDING / 2, y); 
        ctx.fillText(String(i + 1), canvas.width - (PADDING / 2), y); 
    }
}
// (돌 그리기 함수는 남겨둠 - 백엔드 응답 시 필요)
function drawStone(gridY, gridX, player) { /* ... (game.js와 동일) ... */ }

// ★★★ (제거됨) 7. 타이머 관련 함수 ★★★
// ★★★ (제거됨) 8. 게임 종료 및 모달 함수 ★★★
// ★★★ (제거됨) 9. 게임 초기화 함수 ★★★
// ★★★ (제거됨) 10. 승리 판정 함수 ★★★


// 11. 이벤트 리스너
// ★★★ (수정) 캔버스 클릭 (좌표만 콘솔에 찍음) ★★★
canvas.addEventListener('click', (event) => {
    // if (!isGameActive || currentPlayer === 'ai') { return; } (제거)

    const rect = canvas.getBoundingClientRect(); 
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const gridX = Math.round((x - PADDING) / GRID_SIZE);
    const gridY = Math.round((y - PADDING) / GRID_SIZE);

    if (gridX < 0 || gridX >= BOARD_SIZE || gridY < 0 || gridY >= BOARD_SIZE) { return; }

    // ★ (제거됨) 이미 돌이 있는지 확인 (boardState가 없음)
    // ★ (제거됨) 돌 그리기 (drawStone)
    // ★ (제거됨) 승리 판정 (checkWin)
    // ★ (제거됨) 턴 넘기기, AI 시뮬레이션

    console.log(`플레이어 클릭: [${gridY}, ${gridX}]`);
    
    // (백엔드 연동) TODO: 'play_ai_api.php'를 완성하면 이 주석을 해제합니다.
    /*
    fetch('api/play_ai_api.php', {
        method: 'POST',
        body: JSON.stringify({ move: [gridY, gridX] })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // 1. 내가 둔 돌 그리기
            drawStone(gridY, gridX, 1); 
            // 2. AI가 둔 돌 그리기
            drawStone(data.aiMove[0], data.aiMove[1], 2);
            // 3. (승리 확인)
            if (data.gameStatus === 'win_player') {
                // (모달 팝업 함수가 없으므로 임시 alert)
                alert('축하합니다! 승리하셨습니다!');
                // showEndGameModal('축하합니다! 승리하셨습니다!');
            } else if (data.gameStatus === 'win_ai') {
                alert('AI의 승리입니다!');
                // showEndGameModal('AI의 승리입니다!');
            }
        }
    });
    */
});

// "기권하기" 버튼
document.getElementById('resign-button').addEventListener('click', () => {
    const isConfirmed = confirm('정말로 기권하시겠습니까?');
    if (isConfirmed) {
        alert('기권패했습니다. AI의 승리입니다!');
        // (백엔드 연동) TODO: 'resign_api.php'를 fetch로 호출해야 함
        // showEndGameModal('기권패했습니다. AI의 승리입니다!');
    }
});

// "홈으로 가기" 버튼 (모달/게임 공통)
document.getElementById('home-button').addEventListener('click', () => { window.location.href = 'index.php'; });
modalHomeButton.addEventListener('click', () => { window.location.href = 'index.php'; });

// "새로 시작하기" (모달) 버튼
rematchButton.addEventListener('click', () => {
    window.location.reload(); 
});


// 12. 페이지 로드 시 게임 시작
drawBoard(); // 오목판만 그리기