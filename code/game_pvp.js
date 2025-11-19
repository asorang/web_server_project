// [Backend] 웹소켓 연결 초기화 (예: const socket = io();)

// 1. 페이지 로드 및 초기 설정
document.addEventListener('DOMContentLoaded', () => {
    const loggedInUser = sessionStorage.getItem('userNickname');
    const userRank = sessionStorage.getItem('userRank');
    const userRating = sessionStorage.getItem('userRating');
    
    const playerNameEl = document.getElementById('player-name-game');
    const playerRankEl = document.getElementById('player-rank-game');
    
    // [Backend] 서버로부터 현재 게임 방 정보(상대방 정보, 흑/백 여부) 수신 후 UI 업데이트 필요
    if (loggedInUser && userRank && userRating) {
        playerNameEl.innerText = loggedInUser + ' (흑돌)'; // 실제로는 서버에서 지정한 색상 표기
        playerRankEl.innerText = `${userRank} ${userRating}점`;
    } else {
        playerNameEl.innerText = '나 (흑돌)';
        playerRankEl.innerText = '(비로그인)';
    }
    
    // 상대방 정보는 매칭 완료 시 서버에서 받아와야 함
    document.getElementById('opponent-name-game').innerText = '상대방 (백돌)';
    document.getElementById('opponent-rank-game').innerText = '(정보 로딩 중)';
});

// 2. 캔버스 및 그리기 도구 설정
const canvas = document.getElementById('omok-board');
const ctx = canvas.getContext('2d');

const BOARD_SIZE = 15;
const LINE_COUNT = BOARD_SIZE - 1;
const GRID_SIZE = 40;
const PADDING = 20;
canvas.width = PADDING * 2 + LINE_COUNT * GRID_SIZE;
canvas.height = PADDING * 2 + LINE_COUNT * GRID_SIZE;

// 3. 게임 상태 변수
let isGameActive = true;
// [Backend] 보드 상태 배열은 서버와 동기화되어야 함
let boardState = Array(BOARD_SIZE).fill(0).map(() => Array(BOARD_SIZE).fill(0));

// 4. DOM 요소
const modalOverlay = document.getElementById('end-game-modal');
const modalMessage = document.getElementById('modal-message');

// 5. 오목판 그리기 함수 (화점, 좌표 포함 완전체)
function drawBoard() {
    // 배경
    ctx.fillStyle = '#f3d7a1'; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 선 그리기
    ctx.strokeStyle = '#000000'; 
    ctx.lineWidth = 1;
    for (let i = 0; i < BOARD_SIZE; i++) {
        const y = PADDING + i * GRID_SIZE;
        const x = PADDING + i * GRID_SIZE;
        // 가로선
        ctx.beginPath(); ctx.moveTo(PADDING, y); ctx.lineTo(canvas.width - PADDING, y); ctx.stroke(); 
        // 세로선
        ctx.beginPath(); ctx.moveTo(x, PADDING); ctx.lineTo(x, canvas.height - PADDING); ctx.stroke(); 
    }
    
    // 화점(점) 그리기
    const hotPoints = [[3, 3], [3, 11], [11, 3], [11, 11], [7, 7]];
    ctx.fillStyle = '#000000';
    hotPoints.forEach(([x, y]) => {
        const realX = PADDING + x * GRID_SIZE;
        const realY = PADDING + y * GRID_SIZE;
        ctx.beginPath(); ctx.arc(realX, realY, 5, 0, 2 * Math.PI); ctx.fill();
    });
    
    // 좌표 글자 그리기
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

// 6. 돌 그리기 함수
function drawStone(gridY, gridX, player) {
    const stoneX = PADDING + gridX * GRID_SIZE;
    const stoneY = PADDING + gridY * GRID_SIZE;
    
    // 1: 흑돌, 2: 백돌 (서버 규칙에 따름)
    const isBlack = (player === 1); 
    
    ctx.fillStyle = isBlack ? '#000000' : '#FFFFFF';
    ctx.beginPath();
    ctx.arc(stoneX, stoneY, GRID_SIZE / 2 - 2, 0, 2 * Math.PI);
    ctx.fill();
    
    // 백돌일 경우 테두리 추가
    if (!isBlack) {
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 1;
        ctx.stroke();
    }
}

// 7. 이벤트 리스너 (클릭 시 착수 요청)
canvas.addEventListener('click', (event) => {
    if (!isGameActive) return; 

    const rect = canvas.getBoundingClientRect(); 
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const gridX = Math.round((x - PADDING) / GRID_SIZE);
    const gridY = Math.round((y - PADDING) / GRID_SIZE);

    // 보드 범위 밖 클릭 무시
    if (gridX < 0 || gridX >= BOARD_SIZE || gridY < 0 || gridY >= BOARD_SIZE) return;

    // 이미 돌이 있는 자리 무시 (클라이언트 측 1차 검증)
    if (boardState[gridY][gridX] !== 0) {
        // alert('이미 돌이 놓인 자리입니다.'); // UX상 굳이 띄우지 않아도 됨
        return;
    }
    
    // [Backend] 서버로 착수 좌표 전송 (핵심 연동 포인트)
    // socket.emit('placeStone', { x: gridX, y: gridY });
    console.log(`[Frontend] 착수 요청 전송: y=${gridY}, x=${gridX}`);
    
    // 참고: 실제 돌 그리기(drawStone)는 서버에서 '착수 성공' 응답을 받았을 때 실행하는 것이 안전함
});


// [Backend] 서버로부터 착수 정보를 받았을 때 호출될 함수 (예시)
/*
socket.on('stonePlaced', (data) => {
    const { x, y, player } = data;
    boardState[y][x] = player;
    drawStone(y, x, player);
});
*/

// [Backend] 게임 종료 이벤트 수신 (예시)
/*
socket.on('gameEnded', (data) => {
    isGameActive = false;
    modalMessage.innerText = data.message;
    modalOverlay.style.display = 'flex';
});
*/


// 8. 버튼 이벤트 연결
document.getElementById('resign-button').addEventListener('click', () => {
    if (!isGameActive) return; 
    const isConfirmed = confirm('정말로 기권하시겠습니까?');
    if (isConfirmed) {
        // [Backend] 기권 이벤트 전송
        // socket.emit('resign');
        console.log('[Frontend] 기권 요청');
    }
});

document.getElementById('home-button').addEventListener('click', () => { window.location.href = 'index.php'; });
document.getElementById('modal-home-button').addEventListener('click', () => { window.location.href = 'index.php'; });

document.getElementById('rematch-pvp-button').addEventListener('click', () => {
    // [Backend] 재시합 요청 이벤트 전송
    // socket.emit('requestRematch');
    document.getElementById('rematch-pvp-button').innerText = '요청 중...';
    document.getElementById('rematch-pvp-button').disabled = true;
});

// 초기 보드 그리기 실행
drawBoard();