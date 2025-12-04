// 1. 캔버스 설정
const canvas = document.getElementById('omok-board');
const ctx = canvas.getContext('2d');

const BOARD_SIZE = 15;
const GRID_SIZE = 40;
const PADDING = 20;
canvas.width = PADDING * 2 + (BOARD_SIZE - 1) * GRID_SIZE;
canvas.height = PADDING * 2 + (BOARD_SIZE - 1) * GRID_SIZE;

// 게임 상태 변수
let isGameActive = true;
let boardState = Array(BOARD_SIZE).fill(0).map(() => Array(BOARD_SIZE).fill(0));
let currentPlayer = 1; // 1: 흑돌, 2: 백돌
let lastMove = null; 

// ★ 시간 관련 변수 추가 ★
const TIME_LIMIT = 600; // 10분 (초 단위)
let p1Time = TIME_LIMIT;
let p2Time = TIME_LIMIT;
let timerInterval = null;

// UI 요소
const p1Card = document.getElementById('p1-card');
const p2Card = document.getElementById('p2-card');
const p1TimerDisplay = document.getElementById('p1-timer');
const p2TimerDisplay = document.getElementById('p2-timer');

const modalOverlay = document.getElementById('end-game-modal');
const modalMessage = document.getElementById('modal-message');
const modalTitle = document.getElementById('modal-title');

// 2. 유틸리티 함수 (시간 포맷, 턴 UI)
function formatTime(seconds) {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
}

function updateTurnUI() {
    if (currentPlayer === 1) {
        p1Card.classList.add('active-turn');
        p2Card.classList.remove('active-turn');
    } else {
        p2Card.classList.add('active-turn');
        p1Card.classList.remove('active-turn');
    }
}

// ★ 타이머 시작 함수 ★
function startTimer() {
    // 기존 타이머가 있다면 제거 (중복 방지)
    if (timerInterval) clearInterval(timerInterval);

    // 초기 시간 표시
    p1TimerDisplay.innerText = formatTime(p1Time);
    p2TimerDisplay.innerText = formatTime(p2Time);

    timerInterval = setInterval(() => {
        if (!isGameActive) {
            clearInterval(timerInterval);
            return;
        }

        // 현재 턴인 플레이어의 시간 감소
        if (currentPlayer === 1) {
            p1Time--;
            p1TimerDisplay.innerText = formatTime(p1Time);
            if (p1Time <= 0) {
                clearInterval(timerInterval);
                showEndGameModal('시간 패', '백돌(Player 2) 승리!');
            }
        } else {
            p2Time--;
            p2TimerDisplay.innerText = formatTime(p2Time);
            if (p2Time <= 0) {
                clearInterval(timerInterval);
                showEndGameModal('시간 패', '흑돌(Player 1) 승리!');
            }
        }
    }, 1000);
}

// 3. 그리기 함수
function drawBoard() {
    ctx.fillStyle = '#e3c998'; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#000000'; ctx.lineWidth = 1;
    for (let i = 0; i < BOARD_SIZE; i++) {
        const p = PADDING + i * GRID_SIZE;
        ctx.beginPath(); ctx.moveTo(PADDING, p); ctx.lineTo(canvas.width - PADDING, p); ctx.stroke(); 
        ctx.beginPath(); ctx.moveTo(p, PADDING); ctx.lineTo(p, canvas.height - PADDING); ctx.stroke(); 
    }
    const hotPoints = [[3, 3], [3, 11], [11, 3], [11, 11], [7, 7]];
    ctx.fillStyle = '#000000';
    hotPoints.forEach(([x, y]) => {
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
    if (isLast) { ctx.fillStyle = 'red'; ctx.beginPath(); ctx.arc(x, y, 4, 0, 2 * Math.PI); ctx.fill(); }
}

function showEndGameModal(title, message) {
    isGameActive = false;
    clearInterval(timerInterval); // ★ 게임 끝나면 타이머 정지
    p1Card.classList.remove('active-turn');
    p2Card.classList.remove('active-turn');
    modalTitle.innerText = title;
    modalMessage.innerText = message;
    modalOverlay.style.display = 'flex';
}

function checkWin(y, x, player) {
    const directions = [[0, 1], [1, 0], [1, 1], [1, -1]];
    for (const [dy, dx] of directions) {
        let count = 1;
        for (let i = 1; i < 5; i++) {
            const ny = y + dy * i, nx = x + dx * i;
            if (ny < 0 || ny >= BOARD_SIZE || nx < 0 || nx >= BOARD_SIZE || boardState[ny][nx] !== player) break;
            count++;
        }
        for (let i = 1; i < 5; i++) {
            const ny = y - dy * i, nx = x - dx * i;
            if (ny < 0 || ny >= BOARD_SIZE || nx < 0 || nx >= BOARD_SIZE || boardState[ny][nx] !== player) break;
            count++;
        }
        if (count >= 5) return true;
    }
    return false;
}

// 4. 착수 이벤트
canvas.addEventListener('click', (event) => {
    if (!isGameActive) return;

    const rect = canvas.getBoundingClientRect(); 
    const gridX = Math.round((event.clientX - rect.left - PADDING) / GRID_SIZE);
    const gridY = Math.round((event.clientY - rect.top - PADDING) / GRID_SIZE);

    if (gridX < 0 || gridX >= BOARD_SIZE || gridY < 0 || gridY >= BOARD_SIZE) return;
    if (boardState[gridY][gridX] !== 0) return;

    if (lastMove) drawStone(lastMove.y, lastMove.x, lastMove.player, false);

    boardState[gridY][gridX] = currentPlayer;
    drawStone(gridY, gridX, currentPlayer, true);

    lastMove = { y: gridY, x: gridX, player: currentPlayer };

    if (checkWin(gridY, gridX, currentPlayer)) {
        const winner = (currentPlayer === 1) ? '흑돌(Player 1)' : '백돌(Player 2)';
        setTimeout(() => showEndGameModal('게임 종료', `${winner} 승리!`), 100);
        return;
    }

    // 턴 변경
    currentPlayer = (currentPlayer === 1) ? 2 : 1;
    updateTurnUI();
    // (참고: 타이머는 setInterval 안에서 currentPlayer 변수를 보고 알아서 깎으므로 별도 조작 불필요)
});

// 버튼 이벤트
document.getElementById('resign-button').addEventListener('click', () => {
    if (!isGameActive) return;
    if (confirm('현재 턴 플레이어가 기권하시겠습니까?')) {
        const winner = (currentPlayer === 1) ? '백돌(Player 2)' : '흑돌(Player 1)';
        showEndGameModal('기권패', `${winner} 승리!`);
    }
});
document.getElementById('home-button').addEventListener('click', () => location.href = 'main.php');
document.getElementById('modal-home-button').addEventListener('click', () => location.href = 'main.php');
document.getElementById('rematch-button').addEventListener('click', () => location.reload());

// 게임 시작
drawBoard();
updateTurnUI();
startTimer(); // ★ 시간 측정 시작 ★