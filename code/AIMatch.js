// 1. 캔버스 설정
const canvas = document.getElementById('omok-board');
const ctx = canvas.getContext('2d');

const BOARD_SIZE = 15;
const GRID_SIZE = 40;
const PADDING = 20;
canvas.width = PADDING * 2 + (BOARD_SIZE - 1) * GRID_SIZE;
canvas.height = PADDING * 2 + (BOARD_SIZE - 1) * GRID_SIZE;

let isGameActive = true;
// [Backend] 이 배열도 서버와 동기화 필요
let boardState = Array(BOARD_SIZE).fill(0).map(() => Array(BOARD_SIZE).fill(0));

const modalOverlay = document.getElementById('end-game-modal');
const modalMessage = document.getElementById('modal-message');

// 2. 그리기 함수
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
        const rx = PADDING + x * GRID_SIZE;
        const ry = PADDING + y * GRID_SIZE;
        ctx.beginPath(); ctx.arc(rx, ry, 4, 0, 2 * Math.PI); ctx.fill();
    });
}

function drawStone(gridY, gridX, player) {
    const x = PADDING + gridX * GRID_SIZE;
    const y = PADDING + gridY * GRID_SIZE;
    ctx.fillStyle = (player === 1) ? '#000' : '#fff';
    ctx.beginPath(); ctx.arc(x, y, 17, 0, 2 * Math.PI); ctx.fill();
    
    if (player === 2) { // 백돌 테두리
        ctx.strokeStyle = '#ccc'; ctx.lineWidth = 1; ctx.stroke();
    }
}

function showEndGameModal(message) {
    isGameActive = false;
    modalMessage.innerText = message;
    modalOverlay.style.display = 'flex';
}

// 3. 이벤트 리스너 (착수 요청)
canvas.addEventListener('click', (event) => {
    if (!isGameActive) return;

    const rect = canvas.getBoundingClientRect(); 
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    const gridX = Math.round((x - PADDING) / GRID_SIZE);
    const gridY = Math.round((y - PADDING) / GRID_SIZE);

    if (gridX < 0 || gridX >= BOARD_SIZE || gridY < 0 || gridY >= BOARD_SIZE) return;
    if (boardState[gridY][gridX] !== 0) return; // 이미 돌이 있으면 무시
    
    // ★ [Backend] 여기에 AI 서버로 착수 요청(fetch/axios)을 보내는 코드를 작성하세요.
    // 현재 선택된 난이도는 변수 'CURRENT_LEVEL'에 들어있습니다.
    console.log(`[Frontend Request] 난이도: ${CURRENT_LEVEL}, 착수 좌표: (${gridX}, ${gridY})`);
    
    // (참고: 서버 응답이 오면 boardState 업데이트 후 drawStone(gridY, gridX, 1)을 호출하세요)
});

// 버튼 이벤트
document.getElementById('resign-button').addEventListener('click', () => {
    if (isGameActive && confirm('기권하시겠습니까?')) showEndGameModal('기권패. AI 승리.');
});
document.getElementById('home-button').addEventListener('click', () => location.href = 'main.php');
document.getElementById('modal-home-button').addEventListener('click', () => location.href = 'main.php');
document.getElementById('rematch-button').addEventListener('click', () => location.reload());

// 시작
drawBoard();