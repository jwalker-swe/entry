import sqlite3 
import os
from pathlib import Path 
from dotenv import load_dotenv
from config import DB_PATH

# Connect to database
# Create database file if it doesn't exist
load_dotenv()

#DB_PATH = os.getenv("DB_PATH", str(Path(__file__).parent.parent / "entry.db"))

def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def create_tables(conn):
    cursor = conn.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS matches (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            demo_id TEXT UNIQUE NOT NULL,
            map_name TEXT,
            total_rounds INTEGER
        )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS kill_events (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            match_id INTEGER NOT NULL,
            demo_id TEXT NOT NULL,
            map_name TEXT,
            round_num INTEGER,
            attacker_name TEXT,
            attacked_name TEXT,
            assister_name TEXT,
            attacker_team_name TEXT,
            attacked_team_name TEXT,
            assister_team_name TEXT,
            attacker_x REAL,
            attacker_y REAL,
            attacker_z REAL,
            attacked_x REAL,
            attacked_y REAL,
            attacked_z REAL,
            assister_x REAL,
            assister_y REAL,
            assister_z REAL,
            attacker_last_place_name TEXT,
            attacked_last_place_name TEXT,
            assister_last_place_name TEXT,
            weapon_used TEXT,
            kill_distance REAL,
            headshot INTEGER,
            hit_group TEXT,
            dmg_dealt REAL,
            dmg_received REAL,
            tick INTEGER,
            FOREIGN KEY (match_id) REFERENCES matches(id)
        )
    """)

    conn.commit()

def insert_match(conn, demo_id: str, map_name: str, total_rounds: int) -> int | None:
    cursor = conn.cursor()

    try:
        print("Updating Database Match Info...")
        cursor.execute('''
            INSERT INTO matches (
                demo_id,
                map_name,
                total_rounds
            ) VALUES (
                ?,
                ?,
                ?
            )
        ''', (demo_id, map_name, total_rounds))

        conn.commit()
        return cursor.lastrowid

    except sqlite3.IntegrityError:
        print(f"Match {demo_id} already in database, skipping.\n")
        return None


def insert_kill_events(conn, match_id: int, events: list):
    print("Uploading Database KDA Info...: ")
    cursor = conn.cursor()
    rows = [
            (
                match_id,
                e["demo_id"],
                e["map_name"],
                e["round_num"],
                e["attacker_name"],
                e["attacked_name"],
                e["assister_name"],
                e["attacker_team_name"],
                e["attacked_team_name"],
                e["assister_team_name"],
                e["attacker_pos"]["x"],
                e["attacker_pos"]["y"],
                e["attacker_pos"]["z"],
                e["attacked_pos"]["x"],
                e["attacked_pos"]["y"],
                e["attacked_pos"]["z"],
                e["assister_pos"]["x"],
                e["assister_pos"]["y"],
                e["assister_pos"]["z"],
                e["attacker_last_place_name"],
                e["attacked_last_place_name"],
                e["assister_last_place_name"],
                e["weapon_used"],
                e["kill_distance"],
                1 if e["headshot"] else 0,
                e["hit_group"],
                e["dmg_dealt"],
                e["dmg_received"],
                e["tick"]
                )
                for e in events
            ]

    cursor.executemany('''
        INSERT INTO kill_events (
            match_id,
            demo_id,
            map_name,
            round_num,
            attacker_name,
            attacked_name,
            assister_name,
            attacker_team_name,
            attacked_team_name,
            assister_team_name,
            attacker_x,
            attacker_y,
            attacker_z,
            attacked_x,
            attacked_y,
            attacked_z,
            assister_x,
            assister_y,
            assister_z,
            attacker_last_place_name,
            attacked_last_place_name,
            assister_last_place_name,
            weapon_used,
            kill_distance,
            headshot,
            hit_group,
            dmg_dealt,
            dmg_received,
            tick
        ) VALUES (
            ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? 
        )
    ''', rows)

    conn.commit()
