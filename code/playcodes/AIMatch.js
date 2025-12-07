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

// PHP에서 전달된 돌 정보 → B/W로 변환
const PLAYER_STONE_TYPE = (PLAYER_STONE === "black") ? 'B' : 'W';
const AI_STONE_TYPE = (AI_STONE === "black") ? 'B' : 'W';

const modalOverlay = document.getElementById('end-game-modal');
const modalMessage = document.getElementById('modal-message');
let game_if = 'resign'

let board_moves = [];
let turnCount = 0;

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

function drawStone(gY, gX, stoneType) {
    const x = PADDING + gX * GRID_SIZE;
    const y = PADDING + gY * GRID_SIZE;

    if (stoneType === 'B') ctx.fillStyle = '#000';
    else ctx.fillStyle = '#fff';

    ctx.beginPath();
    ctx.arc(x, y, 17, 0, 2*Math.PI);
    ctx.fill();

    if (stoneType === 'W') {
        ctx.strokeStyle = '#ccc';
        ctx.lineWidth = 1;
        ctx.stroke();
    }
}

// ----------------------
// 마지막 수 하이라이트
// ----------------------
function highlightLastMove() {
    if (board_moves.length === 0) return;

    const lastMove = board_moves[board_moves.length - 1];
    const x = PADDING + lastMove.x * GRID_SIZE;
    const y = PADDING + lastMove.y * GRID_SIZE;

    ctx.strokeStyle = 'red';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, 2*Math.PI);
    ctx.stroke();
}

// ----------------------
// 전체 돌 그리기 + 하이라이트
// ----------------------
function drawAllStones() {
    drawBoard();
    for (let y = 0; y < BOARD_SIZE; y++) {
        for (let x = 0; x < BOARD_SIZE; x++) {
            if (boardState[y][x] !== null) {
                drawStone(y, x, boardState[y][x]);
            }
        }
    }
    highlightLastMove();
}

// ----------------------
// DB 및 게임 기록
// ----------------------
async function updateUserRating(winner) {
    await fetch('../api/updateUserRating.php', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({winner: winner})
    });
}

async function saveSummaryLog(gameId, user1, user2, user1Color, user2Color, winnerColor) {
    await fetch('../api/updateSummary.php', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            game_id: gameId,
            user_id1: user1,
            user_id2: user2,
            user1_color: user1Color,
            user2_color: user2Color,
            winner: winnerColor
        })
    });
}

function onPlayerMove(x, y, color) {
    turnCount++;
    board_moves.push({ turn: turnCount, x, y, color }); // color = 'B' or 'W'
}

function sendGameResult(gameId, winner, game_if, user1_id, user2_id, user1_color, user2_color) {
    const payload = {
        game_id: gameId,
        winner: winner,
        game_if: game_if,
        user1_id: user1_id,
        user2_id: user2_id,
        user1_color: user1_color,
        user2_color: user2_color,
        user1_score: PLAYERSCORE,
        user2_score: AISCORE,
        board_moves: board_moves
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
// 게임 종료 처리
// ----------------------
function showEndGameModal(message, winnerStoneType) {
    isGameActive = false;

    modalMessage.innerText = message;
    modalOverlay.style.display = 'flex';

    const winColorStone = winnerStoneType; // 이미 'B' or 'W'

    if(winnerStoneType === PLAYER_STONE_TYPE){
        updateUserRating('player');
    }
    else{
        updateUserRating('ai');
    }
    
    saveSummaryLog(
        CURRENT_GAME_ID,
        USER_ID, 
        1, 
        PLAYER_STONE_TYPE,
        AI_STONE_TYPE, 
        winColorStone);

    sendGameResult(
        CURRENT_GAME_ID,
        winColorStone,
        game_if,
        USER_ID,
        1,                  // AI는 항상 id = 1
        PLAYER_STONE_TYPE,
        AI_STONE_TYPE
    );
}


// ----------------------
// 서버 API 호출 + 돌 그리기
// ----------------------
async function sendMoveToServer(mx, my) {
    // 1) 플레이어 착수
    boardState[my][mx] = PLAYER_STONE_TYPE;
    onPlayerMove(mx, my, PLAYER_STONE_TYPE);
    drawAllStones();

    // 2) 서버 전송 payload
    const payload = {
        board: boardState,
        player_move: { x: mx, y: my },
        difficulty: CURRENT_LEVEL,
        player_stone: PLAYER_STONE_TYPE
    };

    let data;
    try {
        const res = await fetch('./callAI.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        data = await res.json();
    } catch (e) {
        console.error('AI 서버 오류:', e);
        alert("AI 서버와 통신 실패함.");
        return;
    }

    // 3) 플레이어 승리 체크
    if (data.game_over && data.winner_color === PLAYER_STONE_TYPE) {
        game_if = 'normal';
        showEndGameModal(data.message, PLAYER_STONE_TYPE);
        return;
    }

    // 4) AI 착수
    if (data.ai_move) {
        const ax = data.ai_move.x;
        const ay = data.ai_move.y;
        boardState[ay][ax] = AI_STONE_TYPE;
        onPlayerMove(ax, ay, AI_STONE_TYPE);
        drawAllStones();
    }

    // 5) AI 승리 체크
    if (data.game_over && data.winner_color === AI_STONE_TYPE) {
        game_if = 'normal';
        showEndGameModal(data.message, AI_STONE_TYPE);
    }
}

// ----------------------
// AI 선공 처리
// ----------------------
async function aiFirstMoveIfNeeded() {
    if (AI_STONE_TYPE === 'B') {
        const res = await fetch('./callAI.php', {
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({
                board: boardState,
                difficulty: CURRENT_LEVEL,
                player_stone: PLAYER_STONE_TYPE,
                player_move: null
            })
        });

        const data = await res.json();
        if (data.ai_move) {
            const ax = data.ai_move.x;
            const ay = data.ai_move.y;
            boardState[ay][ax] = AI_STONE_TYPE;
            onPlayerMove(ax, ay, AI_STONE_TYPE);
            drawAllStones();
        }

        if (data.game_over && data.winner_color === AI_STONE_TYPE) {
            showEndGameModal(data.message, AI_STONE_TYPE);
        }
    }
}

// ----------------------
// 클릭 처리
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

    sendMoveToServer(gridX, gridY);
});

// ----------------------
// 초기 렌더링
// ----------------------
drawBoard();
aiFirstMoveIfNeeded();