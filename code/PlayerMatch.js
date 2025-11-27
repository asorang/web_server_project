// 1. 캔버스 및 변수 설정
const canvas = document.getElementById('omok-board');
const ctx = canvas.getContext('2d');

const BOARD_SIZE = 15;
const GRID_SIZE = 40;
const PADDING = 20;
canvas.width = PADDING * 2 + (BOARD_SIZE - 1) * GRID_SIZE;
canvas.height = PADDING * 2 + (BOARD_SIZE - 1) * GRID_SIZE;

let isGameActive = true;
let boardState = Array(BOARD_SIZE).fill(0).map(() => Array(BOARD_SIZE).fill(0));

const modalOverlay = document.getElementById('end-game-modal');
const modalMessage = document.getElementById('modal-message');

// ★ [Backend] 여기에 웹소켓 연결 코드를 작성하세요.
// const socket = ...

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
    
    [[3, 3], [3, 11], [11, 3], [11, 11], [7, 7]].forEach(([x, y]) => {
        ctx.beginPath(); 
        ctx.arc(PADDING + x * GRID_SIZE, PADDING + y * GRID_SIZE, 4, 0, 2 * Math.PI); 
        ctx.fill();
    });
}

function drawStone(gridY, gridX, player) { 
    const x = PADDING + gridX * GRID_SIZE;
    const y = PADDING + gridY * GRID_SIZE;
    ctx.fillStyle = (player === 1) ? '#000' : '#fff';
    ctx.beginPath(); ctx.arc(x, y, 17, 0, 2 * Math.PI); ctx.fill();
    if (player === 2) { ctx.strokeStyle = '#ccc'; ctx.stroke(); }
}

// 3. 착수 이벤트
canvas.addEventListener('click', (event) => {
    if (!isGameActive) return; 

    const rect = canvas.getBoundingClientRect(); 
    const gridX = Math.round((event.clientX - rect.left - PADDING) / GRID_SIZE);
    const gridY = Math.round((event.clientY - rect.top - PADDING) / GRID_SIZE);

    if (gridX < 0 || gridX >= BOARD_SIZE || gridY < 0 || gridY >= BOARD_SIZE) return;
    if (boardState[gridY][gridX] !== 0) return;

    // ★ [Backend] 서버로 착수 메시지(좌표)를 전송하는 코드를 여기에 작성하세요.
    console.log(`[Frontend Request] 착수 요청 전송: (${gridX}, ${gridY})`);
    // socket.send(...)
});

// ★ [Backend] 서버로부터 상대방의 수(또는 내 수의 확정)를 받았을 때 처리하는 코드를 작성하세요.
/*
socket.onmessage = (event) => {
    // 받은 좌표로 drawStone(y, x, player) 실행
};
*/

// 버튼 이벤트
document.getElementById('resign-button').addEventListener('click', () => {
    if (confirm('기권하시겠습니까?')) {
        // [Backend] 기권 요청 전송
        console.log('[Frontend Request] 기권 요청');
    }
});
document.getElementById('home-button').addEventListener('click', () => location.href = 'main.php');
document.getElementById('modal-home-button').addEventListener('click', () => location.href = 'main.php');
document.getElementById('rematch-button').addEventListener('click', () => {
    // [Backend] 재시합 요청 전송
    console.log('[Frontend Request] 재시합 요청');
});

// 시작
drawBoard();