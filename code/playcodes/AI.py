# ai_server_replay_defense.py
from flask import Flask, request, jsonify
import numpy as np
import copy, time
import torch
import torch.nn as nn

app = Flask(__name__)

BOARD_SIZE = 15
EMPTY = 0
BLACK = 1
WHITE = 2

# -----------------------
# PolicyNet (2채널 입력)
# -----------------------
class PolicyNet(nn.Module):
    def __init__(self):
        super().__init__()
        self.net = nn.Sequential(
            nn.Conv2d(2, 32, 3, padding=1),
            nn.ReLU(),
            nn.Conv2d(32, 64, 3, padding=1),
            nn.ReLU(),
            nn.Flatten(),
            nn.Linear(64 * BOARD_SIZE * BOARD_SIZE, 512),
            nn.ReLU(),
            nn.Linear(512, BOARD_SIZE * BOARD_SIZE)
        )

    def forward(self, x):
        return self.net(x)


# -----------------------
# 모델 로드 (state_dict 또는 전체 객체 모두 지원)
# -----------------------
MODEL_PATH = "./code/api/policy_full.pth"

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

def load_bc_model(path):
    try:
        loaded = torch.load(path, map_location=device)
    except Exception as e:
        raise RuntimeError(f"모델 파일 로드 실패: {e}")

    if isinstance(loaded, nn.Module):
        model = loaded
    elif isinstance(loaded, dict):
        model = PolicyNet()
        # 다양한 키 포맷 지원
        if "model_state_dict" in loaded:
            state = loaded["model_state_dict"]
        elif "state_dict" in loaded:
            state = loaded["state_dict"]
        else:
            state = loaded
        model.load_state_dict(state)
    else:
        raise RuntimeError("알 수 없는 모델 파일 포맷")

    model.to(device)
    model.eval()
    return model

try:
    BC_MODEL = load_bc_model(MODEL_PATH)
    print("BC model loaded, device:", device)
except Exception as e:
    BC_MODEL = None
    print("BC model load failed:", e)


# -----------------------
# 보드 → 모델 입력 변환 (원본 보드 훼손하지 않음)
# 채널0: ai 돌, 채널1: 상대 돌
# 반환: torch tensor shape (1,2,15,15) on device
# -----------------------
def board_to_tensor(board, ai_color, human_color):
    arr = np.zeros((2, BOARD_SIZE, BOARD_SIZE), dtype=np.float32)
    for y in range(BOARD_SIZE):
        for x in range(BOARD_SIZE):
            v = board[y][x]
            if v == ai_color:
                arr[0, y, x] = 1.0
            elif v == human_color:
                arr[1, y, x] = 1.0
    t = torch.from_numpy(arr).unsqueeze(0).to(device)
    return t


# -----------------------
# 유틸
# -----------------------
def in_bounds(x, y):
    return 0 <= x < BOARD_SIZE and 0 <= y < BOARD_SIZE

def is_win(board, player):
    dirs = [(1,0),(0,1),(1,1),(1,-1)]
    for y in range(BOARD_SIZE):
        for x in range(BOARD_SIZE):
            if board[y][x] != player: continue
            for dx,dy in dirs:
                cnt = 1
                nx, ny = x+dx, y+dy
                while in_bounds(nx, ny) and board[ny][nx] == player:
                    cnt += 1
                    nx += dx; ny += dy
                nx, ny = x-dx, y-dy
                while in_bounds(nx, ny) and board[ny][nx] == player:
                    cnt += 1
                    nx -= dx; ny -= dy
                if cnt >= 5:
                    return True
    return False


# -----------------------
# 라인 정보: (cnt, forward_open, backward_open)
# (x,y)에 돌 놓았을 때 한 방향(dx,dy)으로 연속 개수 및 양끝 빈칸 여부
# -----------------------
def line_info(board, x, y, dx, dy, player):
    cnt = 1
    fx, fy = x+dx, y+dy
    while in_bounds(fx, fy) and board[fy][fx] == player:
        cnt += 1
        fx += dx; fy += dy
    forward_open = in_bounds(fx, fy) and board[fy][fx] == EMPTY

    bx, by = x-dx, y-dy
    while in_bounds(bx, by) and board[by][bx] == player:
        cnt += 1
        bx -= dx; by -= dy
    backward_open = in_bounds(bx, by) and board[by][bx] == EMPTY

    return cnt, forward_open, backward_open


# -----------------------
# 즉시 승리 체크 (임시로 놓아서 검사)
# -----------------------
def is_immediate_win(board, x, y, player):
    if board[y][x] != EMPTY:
        return False
    board[y][x] = player
    win = False
    dirs = [(1,0),(0,1),(1,1),(1,-1)]
    for dx,dy in dirs:
        cnt = 1
        nx, ny = x+dx, y+dy
        while in_bounds(nx, ny) and board[ny][nx] == player:
            cnt += 1; nx += dx; ny += dy
        nx, ny = x-dx, y-dy
        while in_bounds(nx, ny) and board[ny][nx] == player:
            cnt += 1; nx -= dx; ny -= dy
        if cnt >= 5:
            win = True
            break
    board[y][x] = EMPTY
    return win


# -----------------------
# 열린3/open4 판별 (간단판)
# -----------------------
def detect_open3_open4(board, x, y, player):
    dirs = [(1,0),(0,1),(1,1),(1,-1)]
    open3 = False
    open4 = False
    for dx,dy in dirs:
        cnt, f_open, b_open = line_info(board, x, y, dx, dy, player)
        if cnt == 3 and f_open and b_open:
            open3 = True
        if cnt == 4 and (f_open or b_open):
            open4 = True
    return open3, open4


# -----------------------
# 통합 휴리스틱 (공격 + 방어, open3/open4 포함)
# 로그잇(logit) 보정값 반환
# attack_scale, defense_scale 로 균형 조절
# -----------------------
def heuristic_logits_full(board, ai_color, human_color, attack_scale=1.0, defense_scale=1.5, center_bonus_scale=0.25):
    h = np.zeros(BOARD_SIZE * BOARD_SIZE, dtype=np.float32)
    dirs = [(1,0),(0,1),(1,1),(1,-1)]
    cx, cy = (BOARD_SIZE-1)//2, (BOARD_SIZE-1)//2

    for y in range(BOARD_SIZE):
        for x in range(BOARD_SIZE):
            idx = y*BOARD_SIZE + x
            if board[y][x] != EMPTY:
                h[idx] = -1e9
                continue

            # 중심 보너스 (작게)
            dist = abs(x-cx) + abs(y-cy)
            h[idx] += center_bonus_scale * max(0.0, (10.0 - dist))

            # 공격 평가 (ai가 여기 둘 때)
            atk_score = 0.0
            for dx,dy in dirs:
                cnt, f_open, b_open = line_info(board, x, y, dx, dy, ai_color)
                if cnt >= 5:
                    atk_score += 1000.0
                elif cnt == 4:
                    if f_open and b_open:
                        atk_score += 600.0
                    else:
                        atk_score += 200.0
                elif cnt == 3:
                    if f_open and b_open:
                        atk_score += 40.0
                    else:
                        atk_score += 8.0
                elif cnt == 2:
                    if f_open and b_open:
                        atk_score += 4.0

            # 방어 평가 (human이 여기 둔다고 가정했을 때)
            def_score = 0.0
            threats = 0
            for dx,dy in dirs:
                cnt, f_open, b_open = line_info(board, x, y, dx, dy, human_color)
                if cnt >= 5:
                    def_score += 1000.0
                    threats += 1
                elif cnt == 4:
                    if f_open and b_open:
                        def_score += 500.0
                    else:
                        def_score += 100.0
                    threats += 1
                elif cnt == 3:
                    if f_open and b_open:
                        def_score += 50.0
                        threats += 1
                    else:
                        def_score += 10.0

            if threats >= 2:
                def_score += 600.0

            h[idx] += attack_scale * atk_score + defense_scale * def_score

    return h


# -----------------------
# 선택 로직: 즉시 이김/즉시 차단 우선 -> model logits + heuristic 합산
# -----------------------
def choose_move_full(board, ai_color, human_color, bc_model=None):
    # 1) 즉시 승리
    for y in range(BOARD_SIZE):
        for x in range(BOARD_SIZE):
            if board[y][x] != EMPTY: continue
            if is_immediate_win(board, x, y, ai_color):
                return x, y

    # 2) 즉시 막아야 함
    for y in range(BOARD_SIZE):
        for x in range(BOARD_SIZE):
            if board[y][x] != EMPTY: continue
            if is_immediate_win(board, x, y, human_color):
                return x, y

    # 3) 모델 logits
    if bc_model is None:
        model_logits = np.zeros(BOARD_SIZE * BOARD_SIZE, dtype=np.float32)
    else:
        inp = board_to_tensor(board, ai_color, human_color)
        with torch.no_grad():
            model_logits = bc_model(inp)[0].cpu().numpy()

    # 4) 휴리스틱
    h_logits = heuristic_logits_full(board, ai_color, human_color,
                                     attack_scale=1.0, defense_scale=1.5,
                                     center_bonus_scale=0.25)

    # 5) mask 이미 둔 칸
    for y in range(BOARD_SIZE):
        for x in range(BOARD_SIZE):
            if board[y][x] != EMPTY:
                idx = y*BOARD_SIZE + x
                model_logits[idx] = -1e9
                h_logits[idx] = -1e9

    # 6) 합산 및 안정화
    final_logits = model_logits + (0.8*h_logits)
    final_logits = np.clip(final_logits, -1000.0, 1000.0)

    # 7) 소량 노이즈 (동점 완화)
    final_logits += np.random.normal(scale=1e-6, size=final_logits.shape)

    # 8) 선택
    idx = int(np.argmax(final_logits))
    x, y = idx % BOARD_SIZE, idx // BOARD_SIZE
    return x, y


# -----------------------
# AI Move API
# -----------------------
@app.route('/ai_move', methods=['POST'])
def ai_move():
    payload = request.get_json()
    board_in = payload.get('board')
    human_color_str = payload.get('player_stone', 'B')
    user_move = payload.get('player_move', None)

    color_map = {'B': BLACK, 'W': WHITE}
    human_color = color_map.get(human_color_str, BLACK)
    ai_color = WHITE if human_color == BLACK else BLACK

    # 원본 보드 훼손 금지: 문자열 보드 -> 정수 보드 복사 생성
    board = [[EMPTY for _ in range(BOARD_SIZE)] for _ in range(BOARD_SIZE)]
    for y in range(BOARD_SIZE):
        for x in range(BOARD_SIZE):
            v = board_in[y][x]
            if v == 'B':
                board[y][x] = BLACK
            elif v == 'W':
                board[y][x] = WHITE
            else:
                board[y][x] = EMPTY

    # 사용자 수 적용
    if user_move:
        ux, uy = user_move['x'], user_move['y']
        if 0 <= ux < BOARD_SIZE and 0 <= uy < BOARD_SIZE and board[uy][ux] == EMPTY:
            board[uy][ux] = human_color
        if is_win(board, human_color):
            return jsonify({"ai_move": None, "game_over": True, "winner_color": human_color_str, "message": "플레이어 승리"})

    board_copy = copy.deepcopy(board)

    # 선택 (BC_MODEL 사용)
    ax, ay = choose_move_full(board, ai_color, human_color, bc_model=BC_MODEL)

    # 안전 fallback
    if not (0 <= ax < BOARD_SIZE and 0 <= ay < BOARD_SIZE) or board_copy[ay][ax] != EMPTY:
        found = False
        for yy in range(BOARD_SIZE):
            for xx in range(BOARD_SIZE):
                if board_copy[yy][xx] == EMPTY:
                    ax, ay = xx, yy
                    found = True
                    break
            if found:
                break

    board[ay][ax] = ai_color

    if is_win(board, ai_color):
        return jsonify({"ai_move": {"x": ax, "y": ay}, "game_over": True, "winner_color": 'B' if ai_color == BLACK else 'W', "message": "AI 승리"})

    return jsonify({"ai_move": {"x": ax, "y": ay}, "game_over": False, "winner_color": None, "message": "게임 진행 중"})


if __name__ == '__main__':
    app.run(port=5000, debug=True)
