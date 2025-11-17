// 1. 페이지 로드 시 로그인 정보 설정
document.addEventListener('DOMContentLoaded', () => {
    // ... (이전과 동일: 닉네임, 급수, 점수 설정) ...
    const loggedInUser = sessionStorage.getItem('userNickname');
    const userRank = sessionStorage.getItem('userRank');
    const userRating = sessionStorage.getItem('userRating');
    const playerNameEl = document.getElementById('player-name-game');
    const playerRankEl = document.getElementById('player-rank-game');
    if (loggedInUser && userRank && userRating) {
        playerNameEl.innerText = loggedInUser + ' (흑돌)';
        playerRankEl.innerText = `${userRank} ${userRating}점`;
    } else {
        playerNameEl.innerText = '나 (흑돌)';
        playerRankEl.innerText = '(비로그인)';
    }
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

// 3. 타이머 및 게임 상태 변수
const TOTAL_TIME = 600; 
let playerTime = TOTAL_TIME;
let aiTime = TOTAL_TIME;
let currentPlayer = 'player'; 
let timerInterval = null; 
let isGameActive = true;

// ★★★ (신규) 4. 오목판 상태 (0: 빈칸, 1: 흑돌, 2: 백돌) ★★★
let boardState = [];

// 5. DOM 요소 (타이머, 모달)
const playerTimerDisplay = document.getElementById('player-timer');
const aiTimerDisplay = document.getElementById('ai-timer');
const modalOverlay = document.getElementById('end-game-modal');
const modalMessage = document.getElementById('modal-message');
const rematchButton = document.getElementById('rematch-button');
const modalHomeButton = document.getElementById('modal-home-button');

// 6. 오목판 그리기 함수 (drawBoard)
// ... (이전과 동일) ...
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
// (신규) 돌 그리기 (복기 로직에서 가져옴)
function drawStone(gridY, gridX, player) {
    const stoneX = PADDING + gridX * GRID_SIZE;
    const stoneY = PADDING + gridY * GRID_SIZE;
    const isBlack = (player === 1); 
    ctx.fillStyle = isBlack ? '#000000' : '#FFFFFF';
    ctx.beginPath();
    ctx.arc(stoneX, stoneY, GRID_SIZE / 2 - 2, 0, 2 * Math.PI);
    ctx.fill();
    if (!isBlack) {
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 1;
        ctx.stroke();
    }
}

// 7. 타이머 관련 함수
// ... (formatTime, updateTimerDisplay, startTimer - 이전과 동일) ...
function formatTime(seconds) { /* ... (동일) ... */ }
function updateTimerDisplay() { /* ... (동일) ... */ }
function startTimer() { /* ... (동일) ... */ }

// 8. 게임 종료 및 모달 함수
function showEndGameModal(message) {
    isGameActive = false; 
    clearInterval(timerInterval); 
    modalMessage.innerText = message; 
    modalOverlay.style.display = 'flex'; 
}
function endGame(winner) {
    const winnerName = (winner === 'player') ? '플레이어' : 'AI';
    showEndGameModal(`시간 초과! ${winnerName}님의 승리입니다!`);
}

// 9. 게임 초기화 함수
function resetGame() {
    playerTime = TOTAL_TIME;
    aiTime = TOTAL_TIME;
    currentPlayer = 'player'; 
    isGameActive = true;
    
    // ★★★ (신규) 오목판 상태 초기화 (15x15 배열을 0으로 채움) ★★★
    boardState = Array(BOARD_SIZE).fill(0).map(() => Array(BOARD_SIZE).fill(0));
    
    modalOverlay.style.display = 'none'; 
    drawBoard(); 
    updateTimerDisplay(); 
    startTimer(); 
}

// ★★★ (신규) 10. 승리 판정 함수 ★★★
function checkWin(player, lastX, lastY) {
    const directions = [
        { dx: 1, dy: 0 },  // 가로
        { dx: 0, dy: 1 },  // 세로
        { dx: 1, dy: 1 },  // 대각선 \
        { dx: 1, dy: -1 } // 대각선 /
    ];

    for (let dir of directions) {
        let count = 1; // 방금 놓은 돌 포함

        // (1) 정방향 (예: 오른쪽)
        for (let i = 1; i < 5; i++) {
            const x = lastX + i * dir.dx;
            const y = lastY + i * dir.dy;
            // 보드 안이고, 같은 플레이어 돌인지 확인
            if (x >= 0 && x < BOARD_SIZE && y >= 0 && y < BOARD_SIZE && boardState[y][x] === player) {
                count++;
            } else {
                break; // 연속이 끊김
            }
        }

        // (2) 역방향 (예: 왼쪽)
        for (let i = 1; i < 5; i++) {
            const x = lastX - i * dir.dx;
            const y = lastY - i * dir.dy;
            if (x >= 0 && x < BOARD_SIZE && y >= 0 && y < BOARD_SIZE && boardState[y][x] === player) {
                count++;
            } else {
                break; // 연속이 끊김
            }
        }

        if (count >= 5) {
            return true; // 5목 완성
        }
    }
    return false; // 5목 없음
}


// 11. 이벤트 리스너
// ★★★ (수정) 캔버스 클릭 ★★★
canvas.addEventListener('click', (event) => {
    if (!isGameActive || currentPlayer === 'ai') { return; }

    const rect = canvas.getBoundingClientRect(); 
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const gridX = Math.round((x - PADDING) / GRID_SIZE);
    const gridY = Math.round((y - PADDING) / GRID_SIZE);

    if (gridX < 0 || gridX >= BOARD_SIZE || gridY < 0 || gridY >= BOARD_SIZE) { return; }

    // ★ (신규) 이미 돌이 있는지 확인
    if (boardState[gridY][gridX] !== 0) {
        alert('이미 돌이 놓인 자리입니다.');
        return;
    }
    
    // (1) 플레이어(흑돌) 수 처리
    boardState[gridY][gridX] = 1; // 1 = 흑돌
    drawStone(gridY, gridX, 1);
    console.log(`플레이어 (흑)가 [${gridY}, ${gridX}]에 둠`);

    // (2) ★ 플레이어 승리 판정 ★
    if (checkWin(1, gridX, gridY)) {
        showEndGameModal('축하합니다! 승리하셨습니다!');
        return; // 게임 종료
    }
    
    // (3) AI 턴으로 넘기기
    currentPlayer = 'ai';
    startTimer(); 

    // (4) (시뮬레이션) 1초 뒤 AI가 응수
    setTimeout(() => {
        if (!isGameActive) return;

        // (수정) 가짜 AI 로직 (빈 자리를 찾을 때까지 옆으로 이동)
        let aiGridX = gridX + 1;
        let aiGridY = gridY;
        while (aiGridX < BOARD_SIZE && boardState[aiGridY][aiGridX] !== 0) {
            aiGridX++; // 이미 돌이 있으면 옆으로 한 칸 더
        }
        if (aiGridX >= BOARD_SIZE) { // 보드 끝에 닿으면
             aiGridX = gridX - 1; // 반대쪽 시도
             while (aiGridX >= 0 && boardState[aiGridY][aiGridX] !== 0) {
                 aiGridX--;
             }
        }
        // (간단한 예외 처리 - 둘 곳이 없으면 랜덤)
        if (aiGridX < 0 || aiGridX >= BOARD_SIZE || boardState[aiGridY][aiGridX] !== 0) {
             aiGridX = Math.floor(Math.random() * 15);
             aiGridY = Math.floor(Math.random() * 15);
             // (이것도 실패하면 그냥 턴을 넘김 - 실제로는 빈자리를 찾아야 함)
             if (boardState[aiGridY][aiGridX] !== 0) {
                 currentPlayer = 'player';
                 startTimer();
                 return;
             }
        }
        
        // (5) AI(백돌) 수 처리
        boardState[aiGridY][aiGridX] = 2; // 2 = 백돌
        drawStone(aiGridY, aiGridX, 2);
        console.log(`AI (백)가 [${aiGridY}, ${aiGridX}]에 둠`);
        
        // (6) ★ AI 승리 판정 ★
        if (checkWin(2, aiGridX, aiGridY)) {
            showEndGameModal('AI의 승리입니다!');
            return; // 게임 종료
        }

        // (7) 다시 플레이어 턴으로
        currentPlayer = 'player';
        startTimer(); 

    }, 1000); // 1초 딜레이
});

// "기권하기" 버튼
document.getElementById('resign-button').addEventListener('click', () => {
    if (!isGameActive) return; 
    const isConfirmed = confirm('정말로 기권하시겠습니까?');
    if (isConfirmed) {
        showEndGameModal('기권패했습니다. AI의 승리입니다!');
    }
});

// "홈으로 가기" 버튼 (모달/게임 공통)
document.getElementById('home-button').addEventListener('click', () => { window.location.href = 'index.php'; });
modalHomeButton.addEventListener('click', () => { window.location.href = 'index.php'; });

// "새로 시작하기" (모달) 버튼
rematchButton.addEventListener('click', () => {
    resetGame(); 
});


// 12. 페이지 로드 시 게임 시작
resetGame();