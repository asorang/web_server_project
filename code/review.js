// 1. 전역 변수 및 캔버스 설정
const canvas = document.getElementById('omok-board');
const ctx = canvas.getContext('2d');

const BOARD_SIZE = 15;
const GRID_SIZE = 40;
const PADDING = 20;
canvas.width = PADDING * 2 + (BOARD_SIZE - 1) * GRID_SIZE;
canvas.height = PADDING * 2 + (BOARD_SIZE - 1) * GRID_SIZE;
const letters = 'ABCDEFGHIJKLMNO';

// DOM 요소
const btnPrev = document.getElementById('btn-prev');
const btnPlay = document.getElementById('btn-play');
const btnNext = document.getElementById('btn-next');
const movesListElement = document.getElementById('moves-list');

// 게임 데이터 변수
let allMoves = []; // [[7, 7], [7, 8], ...]
let currentMoveIndex = -1; 
let playInterval = null; 


// 2. 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', () => {
    // [Backend] URL 파라미터(예: ?gameId=123)를 읽어 서버에서 해당 게임의 상세 기록을 가져와야 함
    // const gameId = new URLSearchParams(window.location.search).get('gameId');
    
    // fetch(`/api/games/${gameId}`)
    //  .then(res => res.json())
    //  .then(data => {
    //      allMoves = data.moves;
    //      populateMovesList();
    //      updateUI();
    //  });
    
    console.log('[Frontend] 복기 데이터 로드 대기 중...');
    
    // 이벤트 리스너 연결
    btnPrev.addEventListener('click', doPrevMove);
    btnNext.addEventListener('click', doNextMove);
    btnPlay.addEventListener('click', togglePlay);

    drawBoard(); // 초기 빈 보드 그리기
});


// 3. 그리기 함수 (완전체)
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
    ctx.beginPath();
    ctx.arc(stoneX, stoneY, GRID_SIZE / 2 - 2, 0, 2 * Math.PI);
    ctx.fill();
    if (!isBlack) {
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 1;
        ctx.stroke();
    }
}


// 4. 복기 로직 함수들 (데이터만 들어오면 작동하도록 유지)
function populateMovesList() {
    let htmlString = '';
    allMoves.forEach((move, index) => {
        const [y, x] = move;
        const player = (index % 2 === 0) ? '흑' : '백';
        const moveCoord = `${letters[x]}${y + 1}`; 
        htmlString += `<li data-index="${index}">${index + 1}. ${player}: ${moveCoord}</li>`;
    });
    movesListElement.innerHTML = htmlString;
}

function doNextMove() {
    if (currentMoveIndex >= allMoves.length - 1) {
        stopPlay(); 
        return; 
    }
    currentMoveIndex++;
    const [y, x] = allMoves[currentMoveIndex];
    const player = (currentMoveIndex % 2 === 0) ? 1 : 2; 
    drawStone(y, x, player);
    updateUI();
}

function doPrevMove() {
    if (currentMoveIndex < 0) return; 
    
    currentMoveIndex--;
    drawBoard(); // 판을 싹 지우고 다시 그림
    for (let i = 0; i <= currentMoveIndex; i++) {
        const [y, x] = allMoves[i];
        const player = (i % 2 === 0) ? 1 : 2;
        drawStone(y, x, player);
    }
    updateUI();
}

function togglePlay() {
    if (playInterval) {
        stopPlay();
    } else {
        btnPlay.innerText = '일시정지 (❚❚)';
        playInterval = setInterval(() => {
            doNextMove(); 
        }, 1000); 
    }
}

function stopPlay() {
    clearInterval(playInterval);
    playInterval = null;
    btnPlay.innerText = '재생 (▶)';
}

function updateUI() {
    btnPrev.disabled = (currentMoveIndex < 0);
    btnNext.disabled = (currentMoveIndex >= allMoves.length - 1);
    movesListElement.querySelectorAll('li').forEach(li => {
        li.classList.remove('active-move');
    });
    if (currentMoveIndex >= 0) {
        const activeLi = movesListElement.querySelector(`li[data-index="${currentMoveIndex}"]`);
        if (activeLi) {
            activeLi.classList.add('active-move');
            activeLi.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }
}