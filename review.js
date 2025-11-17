// 1. 전역 변수 및 캔버스 설정
const canvas = document.getElementById('omok-board');
const ctx = canvas.getContext('2d');
// ... (캔버스 설정 동일) ...
const BOARD_SIZE = 15;
const LINE_COUNT = BOARD_SIZE - 1;
const GRID_SIZE = 40;
const PADDING = 20;
canvas.width = PADDING * 2 + LINE_COUNT * GRID_SIZE;
canvas.height = PADDING * 2 + LINE_COUNT * GRID_SIZE;
const letters = 'ABCDEFGHIJKLMNO';

// DOM 요소
const btnPrev = document.getElementById('btn-prev');
const btnPlay = document.getElementById('btn-play');
const btnNext = document.getElementById('btn-next');
const movesListElement = document.getElementById('moves-list');

// 게임 데이터 (비어있음)
let allMoves = []; 
let currentMoveIndex = -1; 
let playInterval = null; 


// 2. 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', () => {
    
    // ★★★ (수정) URL에서 'game_id' 추출 ★★★
    const urlParams = new URLSearchParams(window.location.search);
    const gameId = urlParams.get('game_id');

    if (!gameId) {
        alert('복기할 게임 ID가 없습니다. 기록 목록으로 돌아갑니다.');
        window.location.href = 'history.php';
        return;
    }
    
    // ★★★ (제거됨) 가짜 sessionStorage 로직 ★★★
    // const gameDataString = sessionStorage.getItem('gameToReview');

    // B. 이벤트 리스너 연결
    btnPrev.addEventListener('click', doPrevMove);
    btnNext.addEventListener('click', doNextMove);
    btnPlay.addEventListener('click', togglePlay);

    // C. 빈 보드 그리기
    drawBoard(); 
    movesListElement.innerHTML = '<li>수순을 불러오는 중...</li>';

    
    // (백엔드 연동) TODO: 'get_review.php'를 완성하면 이 주석을 해제합니다.
    /*
    fetch('api/get_review.php?game_id=' + gameId)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                allMoves = data.moves; // 백엔드에서 받은 실제 좌표 리스트

                // D. (이전과 동일) 데이터가 온 후에 UI를 채움
                populateMovesList(); // 수순 리스트 채우기
                updateUI(); // 버튼 상태 업데이트
            } else {
                alert('게임 데이터를 불러오는 데 실패했습니다: ' + data.message);
                window.location.href = 'history.php';
            }
        })
        .catch(error => {
            console.error('서버 통신 오류:', error);
            alert('서버와 통신할 수 없습니다.');
        });
    */
});

// 3. 그리기 함수
// (drawBoard, drawStone - 뼈대 함수는 남겨둠)
function drawBoard() {
    ctx.fillStyle = '#f3d7a1'; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#000000'; 
    ctx.lineWidth = 1;
    for (let i = 0; i < BOARD_SIZE; i++) {
        const y = PADDING + i * GRID_SIZE;
        const x = PADDING + i * GRID_SIZE;
        ctx.beginPath(); ctx.moveTo(PADDING, y); ctx.lineTo(canvas.width - PADDING, y); ctx.stroke(); 
        ctx.beginPath(); ctx.moveTo(x, PADDING); ctx.lineTo(x, canvas.height - PADDING,); ctx.stroke(); 
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
    ctx.beginPath();
    ctx.arc(stoneX, stoneY, GRID_SIZE / 2 - 2, 0, 2 * Math.PI);
    ctx.fill();
    if (!isBlack) {
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 1;
        ctx.stroke();
    }
}


// 4. 복기 로직 함수
// (populateMovesList, doNextMove, doPrevMove, togglePlay, stopPlay, updateUI - 뼈대 함수는 남겨둠)
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
    if (currentMoveIndex < 0) {
        return; 
    }
    currentMoveIndex--;
    drawBoard(); 
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