# ai_server_replay_defense.py
from flask import Flask, request, jsonify
import numpy as np
import copy, time
import json

app = Flask(__name__)

BOARD_SIZE = 15
EMPTY = 0
BLACK = 1
WHITE = 2

# -----------------------
# Replay Buffer 불러오기
# -----------------------
def load_replay_buffer(path="replay_buffer.json"):
    try:
        with open(path,'r',encoding='utf-8') as f:
            data = json.load(f)
        buffer = {k:int(v) for k,v in data.items()}
        return buffer
    except:
        return {}

REPLAY_BUFFER = load_replay_buffer()

# -----------------------
# 기본 유틸
# -----------------------
def in_bounds(x,y): return 0<=x<BOARD_SIZE and 0<=y<BOARD_SIZE

def is_win(board, player):
    dirs = [(1,0),(0,1),(1,1),(1,-1)]
    for y in range(BOARD_SIZE):
        for x in range(BOARD_SIZE):
            if board[y][x]!=player: continue
            for dx,dy in dirs:
                cnt=1
                nx, ny = x+dx, y+dy
                while in_bounds(nx,ny) and board[ny][nx]==player:
                    cnt+=1
                    nx+=dx; ny+=dy
                if cnt>=5: return True
    return False

# -----------------------
# Replay buffer + 수비 보너스 평가
# -----------------------
def evaluate_board_with_defense(board, ai_color, human_color, replay_buffer, defense_bonus=1500):
    score = 0
    dirs = [(1,0),(0,1),(1,1),(1,-1)]
    for y in range(BOARD_SIZE):
        for x in range(BOARD_SIZE):
            v = board[y][x]
            if v == EMPTY: continue
            key = f"{x}_{y}"
            cnt = replay_buffer.get(key, 0)
            score += cnt if v==ai_color else -cnt

            # 수비 로직: 상대 돌 3줄 이상이면 큰 점수
            if v == human_color:
                for dx,dy in dirs:
                    count = 1
                    nx, ny = x+dx, y+dy
                    while in_bounds(nx, ny) and board[ny][nx]==human_color:
                        count+=1
                        nx+=dx; ny+=dy
                    nx, ny = x-dx, y-dy
                    while in_bounds(nx, ny) and board[ny][nx]==human_color:
                        count+=1
                        nx-=dx; ny-=dy
                    if count >= 3:
                        score += defense_bonus
    return score

# -----------------------
# 후보 생성
# -----------------------
def generate_candidates(board, distance=4):
    nearby = set()
    h, w = len(board), len(board[0])
    for y in range(h):
        for x in range(w):
            if board[y][x]!=EMPTY:
                for dy in range(-distance,distance+1):
                    for dx in range(-distance,distance+1):
                        nx, ny = x+dx, y+dy
                        if 0<=nx<w and 0<=ny<h and board[ny][nx]==EMPTY:
                            nearby.add((nx,ny))
    if not nearby:
        return [(w//2, h//2)]
    
    def neighbor_count(pos):
        x,y = pos
        cnt=0
        for dy in range(-1,2):
            for dx in range(-1,2):
                nx, ny = x+dx, y+dy
                if 0<=nx<w and 0<=ny<h and board[ny][nx]!=EMPTY:
                    cnt+=1
        return -cnt
    return sorted(list(nearby), key=neighbor_count)

# -----------------------
# Minimax Alpha-Beta
# -----------------------
def minimax(board, depth, alpha, beta, maximizing, ai_color, human_color, start_time, time_limit=1.0):
    if time.time()-start_time>time_limit:
        return evaluate_board_with_defense(board, ai_color, human_color, REPLAY_BUFFER), None
    if is_win(board, ai_color): return 100000,None
    if is_win(board, human_color): return -100000,None
    if depth==0: return evaluate_board_with_defense(board, ai_color, human_color, REPLAY_BUFFER), None

    candidates = generate_candidates(board)
    best_move = None

    if maximizing:
        max_eval = -1e9
        for mx,my in candidates:
            board[my][mx]=ai_color
            val,_=minimax(board, depth-1, alpha, beta, False, ai_color, human_color, start_time, time_limit)
            board[my][mx]=EMPTY
            if val>max_eval:
                max_eval=val
                best_move=(mx,my)
            alpha = max(alpha,val)
            if beta<=alpha: break
        return max_eval,best_move
    else:
        min_eval = 1e9
        for mx,my in candidates:
            board[my][mx]=human_color
            val,_=minimax(board, depth-1, alpha, beta, True, ai_color, human_color, start_time, time_limit)
            board[my][mx]=EMPTY
            if val<min_eval:
                min_eval=val
                best_move=(mx,my)
            beta = min(beta,val)
            if beta<=alpha: break
        return min_eval,best_move

# -----------------------
# AI Move API
# -----------------------
@app.route('/ai_move',methods=['POST'])
def ai_move():
    payload=request.get_json()
    board = payload.get('board')
    human_color_str = payload.get('player_stone','B')
    user_move = payload.get('player_move',None)

    color_map={'B':BLACK,'W':WHITE}
    human_color=color_map.get(human_color_str,BLACK)
    ai_color=WHITE if human_color==BLACK else BLACK

    # board 문자열->int
    for y in range(BOARD_SIZE):
        for x in range(BOARD_SIZE):
            v = board[y][x]
            if v=='B': board[y][x]=BLACK
            elif v=='W': board[y][x]=WHITE
            else: board[y][x]=EMPTY

    # 사용자 수 적용
    if user_move:
        ux, uy = user_move['x'], user_move['y']
        if board[uy][ux]==EMPTY:
            board[uy][ux]=human_color
        if is_win(board,human_color):
            return jsonify({"ai_move":None,"game_over":True,"winner_color":human_color_str,"message":"플레이어 승리"})

    board_copy=copy.deepcopy(board)
    start=time.time()
    _, move = minimax(board_copy, 3, -1e9,1e9,True, ai_color, human_color, start, 0.9)

    if move is None:
        # fallback: 첫 빈칸
        found=False
        for yy in range(BOARD_SIZE):
            for xx in range(BOARD_SIZE):
                if board_copy[yy][xx]==EMPTY:
                    move=(xx,yy)
                    found=True
                    break
            if found: break

    ax, ay = move
    board[ay][ax]=ai_color

    if is_win(board,ai_color):
        return jsonify({"ai_move":{"x":ax,"y":ay},"game_over":True,"winner_color": 'B' if ai_color==BLACK else 'W',"message":"AI 승리"})

    return jsonify({"ai_move":{"x":ax,"y":ay},"game_over":False,"winner":None,"message":"게임 진행 중"})

if __name__=='__main__':
    app.run(port=5000,debug=True)
