// 1. 페이지 로드 시 UI 설정
document.addEventListener('DOMContentLoaded', () => {
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

// 2. 캔버스 설정
const canvas = document.getElementById('omok-board');
const ctx = canvas.getContext('2d');

const BOARD_SIZE = 15;
const LINE_COUNT = BOARD_SIZE - 1;
const GRID_SIZE = 40;
const PADDING = 20;
canvas.width = PADDING * 2 + LINE_COUNT * GRID_SIZE;
canvas.height = PADDING * 2 + LINE_COUNT * GRID_SIZE;

let isGameActive = true;
let boardState = Array(BOARD_SIZE).fill(0).map(() => Array(BOARD_SIZE).fill(0));

const modalOverlay = document.getElementById('end-game-modal');
const modalMessage = document.getElementById('modal-message');

// 3. 그리기 함수 (PVP와 동일)
function drawBoard() {
    ctx.fillStyle = '#f3d7a1'; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#000000'; 
    ctx.lineWidth = 1;
    for (let i = 0; i < BOARD_SIZE; i++) {
        const y = PADDING + i * GRID_SIZE;
        const x = PADDING + i * GRID_SIZE;
        ctx.beginPath(); ctx.moveTo(PADDING, y); ctx.lineTo(canvas.width - PADDING, y); ctx.stroke(); 
        ctx.beginPath(); ctx.moveTo(x, PADDING); ctx.lineTo(x, canvas.height - PADDING); ctx.stroke(); 
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

function drawStone(gridY, gridX, player) {
    const stoneX = PADDING + gridX * GRID_SIZE;
    const stoneY = PADDING + gridY * GRID_SIZE;
    const isBlack = (player === 1); 
    ctx.fillStyle = isBlack ? '#000000' : '#FFFFFF';
    ctx.beginPath(); ctx.arc(stoneX, stoneY, GRID_SIZE / 2 - 2, 0, 2 * Math.PI); ctx.fill();
    if (!isBlack) { ctx.strokeStyle = '#000000'; ctx.lineWidth = 1; ctx.stroke(); }
}

function showEndGameModal(message) {
    isGameActive = false;
    modalMessage.innerText = message;
    modalOverlay.style.display = 'flex';
}

// 4. 이벤트 리스너
canvas.addEventListener('click', (event) => {
    if (!isGameActive) return;

    const rect = canvas.getBoundingClientRect(); 
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const gridX = Math.round((x - PADDING) / GRID_SIZE);
    const gridY = Math.round((y - PADDING) / GRID_SIZE);

    if (gridX < 0 || gridX >= BOARD_SIZE || gridY < 0 || gridY >= BOARD_SIZE) return;
    if (boardState[gridY][gridX] !== 0) {
        alert('이미 돌이 놓인 자리입니다.');
        return;
    }
    
    // (1) 플레이어(흑) 착수 표시 (AI 대전은 즉시 표시해도 무방)
    boardState[gridY][gridX] = 1; 
    drawStone(gridY, gridX, 1);
    
    // (2) [Backend] AI 서버에 '내 수' 전송 및 'AI 수' 요청
    // fetch('/api/ai/move', { method: 'POST', body: JSON.stringify({ board: boardState }) })
    //   .then(res => res.json())
    //   .then(data => {
    //       // AI가 둔 수 처리
    //       const { aiX, aiY } = data;
    //       boardState[aiY][aiX] = 2;
    //       drawStone(aiY, aiX, 2);
    //       // 승패 판정 등...
    //   });
    
    console.log(`[Frontend] AI에게 수 요청: 플레이어가 [${gridY}, ${gridX}]에 둠`);
});

document.getElementById('resign-button').addEventListener('click', () => {
    if (!isGameActive) return; 
    if (confirm('정말로 기권하시겠습니까?')) {
        showEndGameModal('기권패했습니다. AI의 승리입니다.');
    }
});

document.getElementById('home-button').addEventListener('click', () => { window.location.href = 'index.php'; });
document.getElementById('modal-home-button').addEventListener('click', () => { window.location.href = 'index.php'; });
document.getElementById('rematch-button').addEventListener('click', () => {
    // 게임 초기화 (새로고침)
    window.location.reload();
});

// 게임 시작
drawBoard();