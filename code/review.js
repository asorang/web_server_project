// 1. 전역 변수 및 캔버스 설정
const canvas = document.getElementById('omok-board');
const ctx = canvas.getContext('2d');

const BOARD_SIZE = 15;
const GRID_SIZE = 40;
const PADDING = 20;
canvas.width = PADDING * 2 + (BOARD_SIZE - 1) * GRID_SIZE;
canvas.height = PADDING * 2 + (BOARD_SIZE - 1) * GRID_SIZE;
const letters = 'ABCDEFGHIJKLMNO'; // (참고용 변수, 실제 그리기엔 안 씀)

// DOM 요소
const btnPrev = document.getElementById('btn-prev');
const btnPlay = document.getElementById('btn-play');
const btnNext = document.getElementById('btn-next');
const movesListElement = document.getElementById('moves-list');

// 게임 데이터 변수
let allMoves = []; 
let currentMoveIndex = -1; 
let playInterval = null; 


// 2. 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', () => {
    // [Backend] 나중에 여기에 fetch 코드를 넣어서 DB 데이터를 allMoves에 넣으면 됩니다.
    /*
    const gameId = new URLSearchParams(window.location.search).get('gameId');
    fetch(`/api/games/${gameId}`)
      .then(res => res.json())
      .then(data => {
          allMoves = data.moves;
          populateMovesList();
          updateUI();
      });
    */
    
    console.log('[Frontend] 복기 데이터 로드 대기 중...');
    
    // 이벤트 리스너 연결
    btnPrev.addEventListener('click', doPrevMove);
    btnNext.addEventListener('click', doNextMove);
    btnPlay.addEventListener('click', togglePlay);

    drawBoard(); // 초기 빈 보드 그리기
});


// 3. 그리기 함수 (AIMatch와 디자인 통일됨)
function drawBoard() {
    // 색상 변경: AIMatch와 동일한 #e3c998 사용
    ctx.fillStyle = '#e3c998'; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.strokeStyle = '#000000'; ctx.lineWidth = 1;
    for (let i = 0; i < BOARD_SIZE; i++) {
        const p = PADDING + i * GRID_SIZE;
        // 가로선
        ctx.beginPath(); ctx.moveTo(PADDING, p); ctx.lineTo(canvas.width - PADDING, p); ctx.stroke(); 
        // 세로선
        ctx.beginPath(); ctx.moveTo(p, PADDING); ctx.lineTo(p, canvas.height - PADDING); ctx.stroke(); 
    }
    
    // 화점 그리기
    const hotPoints = [[3, 3], [3, 11], [11, 3], [11, 11], [7, 7]];
    ctx.fillStyle = '#000000';
    hotPoints.forEach(([x, y]) => {
        const rx = PADDING + x * GRID_SIZE;
        const ry = PADDING + y * GRID_SIZE;
        ctx.beginPath(); ctx.arc(rx, ry, 4, 0, 2 * Math.PI); ctx.fill();
    });

    // ★ 좌표(숫자/알파벳) 그리는 코드를 삭제했습니다. (AIMatch와 동일하게)
}

function drawStone(gridY, gridX, player) {
    const x = PADDING + gridX * GRID_SIZE;
    const y = PADDING + gridY * GRID_SIZE;
    
    // AIMatch와 동일한 돌 디자인 적용
    ctx.fillStyle = (player === 1) ? '#000' : '#fff'; // 1:흑, 2:백
    ctx.beginPath(); ctx.arc(x, y, 17, 0, 2 * Math.PI); ctx.fill();
    
    if (player === 2) { // 백돌 테두리
        ctx.strokeStyle = '#ccc'; ctx.lineWidth = 1; ctx.stroke();
    }
}


// 4. 복기 로직 함수들
function populateMovesList() {
    let htmlString = '';
    allMoves.forEach((move, index) => {
        const [y, x] = move;
        const player = (index % 2 === 0) ? '흑' : '백';
        // 좌표 텍스트용 (A1, B5 ...)
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
    // 처음부터 현재 순서까지만 다시 돌을 놓음
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
    
    // 리스트 하이라이트 처리
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