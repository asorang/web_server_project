// ----------------------
// 캔버스 설정
// ----------------------
const canvas = document.getElementById('omok-board');
const ctx = canvas.getContext('2d');

const BOARD_SIZE = 15;
const GRID_SIZE = 40;
const PADDING = 20;

canvas.width = PADDING * 2 + (BOARD_SIZE - 1) * GRID_SIZE;
canvas.height = PADDING * 2 + (BOARD_SIZE - 1) * GRID_SIZE;

let isGameActive = true;
let boardState = Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(null));
let turnCount = 0;
let board_moves = [];
let currentTurn = 'B'; // Player1(B) / Player2(W)
let lastMove = null;

const modalOverlay = document.getElementById('end-game-modal');
const modalMessage = document.getElementById('modal-message');

// ----------------------
// 보드 그리기
// ----------------------
function drawBoard() {
    ctx.fillStyle = '#e3c998';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1;

    for (let i = 0; i < BOARD_SIZE; i++) {
        const p = PADDING + i * GRID_SIZE;
        ctx.beginPath(); ctx.moveTo(PADDING, p); ctx.lineTo(canvas.width - PADDING, p); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(p, PADDING); ctx.lineTo(p, canvas.height - PADDING); ctx.stroke();
    }

    const hotPoints = [[3,3],[3,11],[11,3],[11,11],[7,7]];
    ctx.fillStyle = '#000';
    hotPoints.forEach(([x,y]) => {
        const rx = PADDING + x*GRID_SIZE;
        const ry = PADDING + y*GRID_SIZE;
        ctx.beginPath(); ctx.arc(rx, ry, 4, 0, 2*Math.PI); ctx.fill();
    });
}

// ----------------------
// 돌 그리기
// ----------------------
function drawStone(gY, gX, stoneType) {
    const x = PADDING + gX * GRID_SIZE;
    const y = PADDING + gY * GRID_SIZE;

    ctx.fillStyle = stoneType === 'B' ? '#000' : '#fff';
    ctx.beginPath();
    ctx.arc(x, y, 17, 0, 2*Math.PI);
    ctx.fill();

    if (stoneType === 'W') {
        ctx.strokeStyle = '#ccc';
        ctx.lineWidth = 1;
        ctx.stroke();
    }

    // 마지막 수 하이라이트
    if (lastMove && lastMove.x === gX && lastMove.y === gY) {
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(x, y, 20, 0, 2*Math.PI);
        ctx.stroke();
    }
}

// ----------------------
// 착수 기록
// ----------------------
function onPlayerMove(x, y, color) {
    turnCount++;
    board_moves.push({ turn: turnCount, x, y, color });
}

// ----------------------
// 턴 전환
// ----------------------
function switchTurn() {
    currentTurn = currentTurn === 'B' ? 'W' : 'B';
}

// ----------------------
// 승리 체크 (5목)
// ----------------------
function checkWin(x, y, color) {
    const directions = [
        { dx: 1, dy: 0 },
        { dx: 0, dy: 1 },
        { dx: 1, dy: 1 },
        { dx: 1, dy: -1 }
    ];

    for (let { dx, dy } of directions) {
        let count = 1;
        for (let d = 1; d <= 4; d++) {
            const nx = x + dx * d;
            const ny = y + dy * d;
            if (boardState[ny]?.[nx] === color) count++;
            else break;
        }
        for (let d = 1; d <= 4; d++) {
            const nx = x - dx * d;
            const ny = y - dy * d;
            if (boardState[ny]?.[nx] === color) count++;
            else break;
        }
        if (count >= 5) return true;
    }
    return false;
}

// ----------------------
// 게임 종료 모달
// ----------------------
function showEndGameModal(message, winnerStoneType) {
    isGameActive = false;
    modalMessage.innerText = message;
    modalOverlay.style.display = 'flex';

    sendGameResult(
        CURRENT_GAME_ID,
        winnerStoneType,
        'normal',
        USER_ID,
        2,
        'B',
        'W'
    );

    board_moves = [];
    turnCount = 0;
}

// ----------------------
// DB 업데이트 (승자 기록)
// ----------------------

// ----------------------
// 게임 기록 전송
// ----------------------
function sendGameResult(gameId, winner, game_if, user1_id, user2_id, user1_color, user2_color) {
    const payload = {
        game_id: gameId,
        winner,
        game_if,
        user1_id,
        user2_id,
        user1_color,
        user2_color,
        user1_score: 0,
        user2_score: 0,
        board_moves
    };

    fetch("../api/updateGameData.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    })
    .then(res => res.json())
    .then(() => {
        board_moves = [];
        turnCount = 0;
    })
    .catch(err => console.error("송신 실패:", err));
}

// ----------------------
// 클릭 이벤트
// ----------------------
canvas.addEventListener('click', (event) => {
    if (!isGameActive) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const gridX = Math.round((x - PADDING) / GRID_SIZE);
    const gridY = Math.round((y - PADDING) / GRID_SIZE);

    if (gridX < 0 || gridX >= BOARD_SIZE || gridY < 0 || gridY >= BOARD_SIZE) return;
    if (boardState[gridY][gridX] !== null) return;

    // 착수
    boardState[gridY][gridX] = currentTurn;
    lastMove = { x: gridX, y: gridY }; // 마지막 수 갱신
    drawBoard();

    // 기존 돌 다시 그림
    for (let y = 0; y < BOARD_SIZE; y++) {
        for (let x = 0; x < BOARD_SIZE; x++) {
            if (boardState[y][x]) drawStone(y, x, boardState[y][x]);
        }
    }

    onPlayerMove(gridX, gridY, currentTurn);

    // 승리 체크
    if (checkWin(gridX, gridY, currentTurn)) {
        showEndGameModal(`${currentTurn === 'B' ? 'Player1' : 'Player2'} 승리!`, currentTurn);
        return;
    }

    switchTurn();
});

// ----------------------
// 초기 렌더링
// ----------------------
drawBoard();
