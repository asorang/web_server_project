import mysql.connector
import json
import numpy as np

BOARD_SIZE = 15

DB_CONFIG = {
    'host': 'localhost',
    'user': 'root',
    'password': '',
    'database': 'DBTeam008'
}

def fetch_games_from_db():
    conn = mysql.connector.connect(**DB_CONFIG)
    cur = conn.cursor(dictionary=True)

    sql = """
        SELECT *
        FROM RawGameLog
        ORDER BY game_id, turn
    """
    cur.execute(sql)

    games = {}
    for row in cur:
        gid = row["game_id"]
        if gid not in games:
            games[gid] = []
        games[gid].append(row)

    conn.close()
    return games


if __name__ == "__main__":
    games = fetch_games_from_db()

    with open("./code/api/games.json", "w", encoding="utf-8") as f:
        json.dump(games, f, indent=2, ensure_ascii=False, default=str)

    print("export 완료: raw_games.json")
    print("총 게임 수:", len(games))
