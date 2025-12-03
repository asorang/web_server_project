import mysql.connector
import numpy as np
import json
from collections import deque

DB_CONFIG = {
    'host': 'localhost',
    'user': 'root',
    'password': '',
    'database': 'DBTeam008',
    'autocommit': True
}

BOARD_SIZE = 15
REPLAY_FILE = "replay_buffer.json"
BUFFER_SIZE = 100000

# ----------------- DB -----------------
def get_db():
    return mysql.connector.connect(**DB_CONFIG)

def fetch_raw_games():
    conn = get_db()
    cur = conn.cursor(dictionary=True)
    cur.execute("SELECT * FROM RawGameLog ORDER BY CAST(game_id AS UNSIGNED), turn")
    for row in cur:  # 한 줄씩 처리
        yield row
    conn.close()

# ----------------- 보드 초기화 -----------------
def init_board():
    return np.zeros((BOARD_SIZE, BOARD_SIZE), dtype=np.uint8)

# ----------------- 경험 저장 -----------------
def process_game(game_moves, replay_buffer):
    board = init_board()
    prev_scores = {'user1': 1000, 'user2': 1000}

    for i, m in enumerate(game_moves):
        val = 1 if m['color']=='B' else 2
        board[m['x'], m['y']] = val
        state = board.copy()

        # reward 계산: 점수 증감 기반
        if m['color'] == m['user1_color']:
            score = m['user1_score'] or prev_scores['user1']
            reward = (score - prev_scores['user1']) / 1000.0
            prev_scores['user1'] = score
        else:
            score = m['user2_score'] or prev_scores['user2']
            reward = (score - prev_scores['user2']) / 1000.0
            prev_scores['user2'] = score

        # 마지막 수 보너스
        if i == len(game_moves)-1:
            reward += 1.0 if score > 2000 else -1.0

        next_board = board.copy()

        replay_buffer.append({
            "state": state.tolist(),
            "action": {"x": m['x'], "y": m['y']},
            "reward": reward,
            "next_state": next_board.tolist(),
            "score": score
        })

# ----------------- 저장 -----------------
def save_replay_buffer(buffer):
    with open(REPLAY_FILE, 'w', encoding='utf-8') as f:
        json.dump(list(buffer), f, indent=2)
    print(f"Replay buffer 저장 완료. 총 경험: {len(buffer)}")

# ----------------- 메인 -----------------
def generate_replay():
    replay_buffer = deque(maxlen=BUFFER_SIZE)
    current_game = []
    last_id = None

    for m in fetch_raw_games():
        if last_id and m['game_id'] != last_id:
            process_game(current_game, replay_buffer)
            current_game.clear()
        current_game.append(m)
        last_id = m['game_id']

    if current_game:
        process_game(current_game, replay_buffer)

    save_replay_buffer(replay_buffer)

if __name__ == "__main__":
    generate_replay()
