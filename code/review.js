const canvas = document.getElementById("omok-board");
const ctx = canvas.getContext("2d");

const BOARD_SIZE = 15;
const CELL_SIZE = 30;
canvas.width = canvas.height = BOARD_SIZE * CELL_SIZE;

let moves = [];
let currentMove = 0;
let playTimer = null;

// 바둑판 그리기
function drawBoard() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "#000";
    for (let i = 0; i < BOARD_SIZE; i++) {
        ctx.beginPath();
        ctx.moveTo(CELL_SIZE / 2, CELL_SIZE / 2 + i * CELL_SIZE);
        ctx.lineTo(canvas.width - CELL_SIZE / 2, CELL_SIZE / 2 + i * CELL_SIZE);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(CELL_SIZE / 2 + i * CELL_SIZE, CELL_SIZE / 2);
        ctx.lineTo(CELL_SIZE / 2 + i * CELL_SIZE, canvas.height - CELL_SIZE / 2);
        ctx.stroke();
    }
}

// 돌 그리기
function drawStone(x, y, color) {
    const px = CELL_SIZE / 2 + x * CELL_SIZE;
    const py = CELL_SIZE / 2 + y * CELL_SIZE;

    ctx.beginPath();
    ctx.arc(px, py, CELL_SIZE / 2 - 2, 0, Math.PI * 2);
    ctx.fillStyle = color === "B" ? "black" : "white";
    ctx.fill();
    ctx.stroke();
}

// 턴 카운터 갱신
function updateMoveCounter() {
    const counter = document.getElementById("move-count");
    if (!counter) return;

    counter.textContent = currentMove + " / " + moves.length;
}

// 게임 불러오기
async function loadGame(gameId) {
    try {
        const response = await fetch(`./api/bringGameLog.php?gameId=${gameId}`);
        const data = await response.json();

        console.log("받은 데이터:", data);

        moves = data.moves || [];

        // UI 업데이트
        document.getElementById("p1-name").textContent = data.meta.user_id1;
        document.getElementById("p2-name").textContent = data.meta.user_id2;
        document.getElementById("game-result").textContent =
            data.meta.winner === "B" ? "흑 승" : "백 승";
        document.getElementById("total-moves").textContent = moves.length;

        fillMoveList(moves);

        drawBoard();
        currentMove = 0;
        updateMoveCounter();
    } catch (e) {
        console.error("게임 불러오기 실패:", e);
    }
}

// 수순 목록 채우기
function fillMoveList(moves) {
    const list = document.getElementById("moves-list");
    list.innerHTML = "";

    moves.forEach(m => {
        const li = document.createElement("li");
        li.textContent = `${m.turn}수 - (${m.x}, ${m.y}) ${m.color === "B" ? "흑" : "백"}`;
        list.appendChild(li);
    });
}

// 수순 적용해서 보드 다시 그림
function redrawMoves() {
    drawBoard();
    for (let i = 0; i < currentMove; i++) {
        const m = moves[i];
        drawStone(m.x, m.y, m.color);
    }
    updateMoveCounter();
}

// 다음 수
function nextMove() {
    if (currentMove >= moves.length) return;
    currentMove++;
    redrawMoves();
}

// 이전 수
function prevMove() {
    if (currentMove <= 0) return;
    currentMove--;
    redrawMoves();
}

// 자동 재생
function autoPlay() {
    if (playTimer) {
        clearInterval(playTimer);
        playTimer = null;
        document.getElementById("btn-play").innerHTML = `<i class="fas fa-play"></i> 재생`;
        return;
    }

    document.getElementById("btn-play").innerHTML = `<i class="fas fa-pause"></i> 정지`;

    playTimer = setInterval(() => {
        if (currentMove >= moves.length) {
            clearInterval(playTimer);
            playTimer = null;
            document.getElementById("btn-play").innerHTML = `<i class="fas fa-play"></i> 재생`;
            return;
        }
        nextMove();
    }, 500);
}

// 초기 설정
window.onload = function () {
    const gameId = new URLSearchParams(location.search).get("gameId");
    if (gameId) loadGame(gameId);
    else drawBoard();

    // 버튼 연결
    document.getElementById("btn-prev").onclick = prevMove;
    document.getElementById("btn-next").onclick = nextMove;
    document.getElementById("btn-play").onclick = autoPlay;
};
