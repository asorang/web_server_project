// 1. 캔버스 설정
const canvas = document.getElementById('omok-board');
const ctx = canvas.getContext('2d');

const BOARD_SIZE = 15;
const GRID_SIZE = 40;
const PADDING = 20;
canvas.width = PADDING * 2 + (BOARD_SIZE - 1) * GRID_SIZE;
canvas.height = PADDING * 2 + (BOARD_SIZE - 1) * GRID_SIZE;

let isGameActive = true;
let boardState = Array(BOARD_SIZE).fill(0).map(() => Array(BOARD_SIZE).fill(0));
let currentPlayer = 1; // 1: 플레이어(흑), 2: AI(백)

let lastMove = null;

// 시간 관련 변수
const TIME_LIMIT = 600; // 10분
let playerTime = TIME_LIMIT;
let aiTime = TIME_LIMIT;
let timerInterval = null;

// UI 요소
const playerCard = document.getElementById('player-card');
const aiCard = document.getElementById('ai-card');
const playerTimerDisplay = document.getElementById('player-timer');
const aiTimerDisplay = document.getElementById('ai-timer');

const modalOverlay = document.getElementById('end-game-modal');
const modalMessage = document.getElementById('modal-message');
const modalTitle = document.getElementById('modal-title');

// 2. 유틸리티 함수
function formatTime(seconds) {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
}

function updateTurnUI() {
    if (currentPlayer === 1) {
        playerCard.classList.add('active-turn');
        aiCard.classList.remove('active-turn');
    } else {
        aiCard.classList.add('active-turn');
        playerCard.classList.remove('active-turn');
    }
}

function startTimer() {
    if (timerInterval) clearInterval(timerInterval);
    
    playerTimerDisplay.innerText = formatTime(playerTime);
    aiTimerDisplay.innerText = formatTime(aiTime);

    timerInterval = setInterval(() => {
        if (!isGameActive) { clearInterval(timerInterval); return; }

        if (currentPlayer === 1) {
            playerTime--;
            playerTimerDisplay.innerText = formatTime(playerTime);
            if (playerTime <= 0) showEndGameModal('시간 패', 'AI의 승리입니다.');
        } else {
            aiTime--;
            aiTimerDisplay.innerText = formatTime(aiTime);
            if (aiTime <= 0) showEndGameModal('시간 승', '플레이어 승리!');
        }
    }, 1000);
}

// 3. 그리기 함수
function drawBoard() {
    // 배경색
    ctx.fillStyle = '#e3c998'; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 선 그리기
    ctx.strokeStyle = '#000000'; ctx.lineWidth = 1;
    for (let i = 0; i < BOARD_SIZE; i++) {
        const p = PADDING + i * GRID_SIZE;
        ctx.beginPath(); ctx.moveTo(PADDING, p); ctx.lineTo(canvas.width - PADDING, p); ctx.stroke(); 
        ctx.beginPath(); ctx.moveTo(p, PADDING); ctx.lineTo(p, canvas.height - PADDING); ctx.stroke(); 
    }
    
    // ★ 수정됨: 화점 그리기 전 검은색으로 변경 ★
    ctx.fillStyle = '#000000'; 
    [[3, 3], [3, 11], [11, 3], [11, 11], [7, 7]].forEach(([x, y]) => {
        const rx = PADDING + x * GRID_SIZE; const ry = PADDING + y * GRID_SIZE;
        ctx.beginPath(); ctx.arc(rx, ry, 4, 0, 2 * Math.PI); ctx.fill();
    });
}

function drawStone(gridY, gridX, player, isLast = false) {
    const x = PADDING + gridX * GRID_SIZE;
    const y = PADDING + gridY * GRID_SIZE;
    
    ctx.fillStyle = (player === 1) ? '#000' : '#fff';
    ctx.beginPath(); ctx.arc(x, y, 17, 0, 2 * Math.PI); ctx.fill();
    
    if (player === 2) { ctx.strokeStyle = '#ccc'; ctx.lineWidth = 1; ctx.stroke(); }

    if (isLast) {
        ctx.fillStyle = 'red';
        ctx.beginPath(); ctx.arc(x, y, 4, 0, 2 * Math.PI); ctx.fill();
    }
}

// [Backend 전용] 착수 처리 헬퍼 함수
function updateBoardWithMove(y, x, player) {
    if (lastMove) {
        drawStone(lastMove.y, lastMove.x, lastMove.player, false);
    }
    boardState[y][x] = player;
    drawStone(y, x, player, true);
    lastMove = { y: y, x: x, player: player };
    currentPlayer = (player === 1) ? 2 : 1;
    updateTurnUI();
}

function showEndGameModal(title, message) {
    isGameActive = false;
    clearInterval(timerInterval);
    playerCard.classList.remove('active-turn');
    aiCard.classList.remove('active-turn');
    
    modalTitle.innerText = title;
    modalMessage.innerText = message;
    modalOverlay.style.display = 'flex';
}

// 4. 착수 이벤트
canvas.addEventListener('click', (event) => {
    if (!isGameActive || currentPlayer === 2) return;

    const rect = canvas.getBoundingClientRect(); 
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const gridX = Math.round((x - PADDING) / GRID_SIZE);
    const gridY = Math.round((y - PADDING) / GRID_SIZE);

    if (gridX < 0 || gridX >= BOARD_SIZE || gridY < 0 || gridY >= BOARD_SIZE) return;
    if (boardState[gridY][gridX] !== 0) return; 

    // [Backend] AI 서버로 착수 요청 전송
    console.log(`[Frontend Request] 난이도: ${CURRENT_LEVEL}, 착수: (${gridX}, ${gridY})`);
    
    // (참고: 화면 갱신은 서버 응답 후 updateBoardWithMove() 호출로 이루어짐)
});

// 버튼 이벤트
document.getElementById('resign-button').addEventListener('click', () => {
    if (isGameActive && confirm('기권하시겠습니까?')) showEndGameModal('기권패', 'AI의 승리입니다.');
});
document.getElementById('home-button').addEventListener('click', () => location.href = 'main.php');
document.getElementById('modal-home-button').addEventListener('click', () => location.href = 'main.php');
document.getElementById('rematch-button').addEventListener('click', () => location.reload());

// 게임 시작
drawBoard();
updateTurnUI(); // 초기 턴(흑돌) 표시
startTimer();   // 타이머 시작