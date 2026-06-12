from fastapi import FastAPI 
from fastapi.middleware.cors import CORSMiddleware
from db import get_connection
from app import ingest_demos
from config import PLAYER_NAME, COMPARE_AGAINST_LAST
from stats import calculate_kda, calculate_hsPercentage, calculate_adr, get_per_match_kills, calculate_ast, compare_stat 

ingest_demos()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)



@app.get("/stats/summary")
def get_summary_stats():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT * 
        FROM kill_events
        WHERE attacker_name = ? OR attacked_name = ? OR assister_name = ?
    """, (PLAYER_NAME, PLAYER_NAME, PLAYER_NAME))

    kill_event_rows = cursor.fetchall()

    cursor.execute("""
        SELECT * FROM matches
    """)

    matches = cursor.fetchall()


    cursor.execute("SELECT * FROM matches ORDER by demo_id DESC LIMIT ?", (COMPARE_AGAINST_LAST,))
    recent_matches = cursor.fetchall()
    recent_match_ids = [row["demo_id"] for row in recent_matches]
    placeholders = ",".join("?" * len(recent_match_ids))

    cursor.execute(f"""
        SELECT * FROM kill_events 
        WHERE (attacker_name = ? OR attacked_name = ? OR assister_name = ?)
        AND demo_id IN ({placeholders})
    """, (PLAYER_NAME, PLAYER_NAME, PLAYER_NAME, *recent_match_ids))

    recent_kill_event_rows = cursor.fetchall()

    conn.close()


    kills = 0;
    recent_kills = 0;
    deaths = 0;
    recent_deaths = 0;
    assists = 0;
    recent_assists = 0;
    headshots = 0;
    recent_headshots = 0;
    dmg_dealt = 0;
    recent_dmg_dealt = 0;

    total_rounds = 0;
    recent_total_rounds = 0;

    for row in kill_event_rows:
#        print(f"Row: {row}")
        if row["attacker_name"] == PLAYER_NAME:
            kills += 1
            dmg_dealt += row["dmg_dealt"]
            if row["headshot"]:
                headshots += 1
        if row["attacked_name"] == PLAYER_NAME:
            deaths += 1
        if row["assister_name"] == PLAYER_NAME:
            assists += 1

    for match in matches:
        total_rounds += match["total_rounds"]

    kd = round(calculate_kda(kills, deaths, assists), 2)
    hsPercentage = calculate_hsPercentage(kills, headshots)
    adr = calculate_adr(dmg_dealt, total_rounds)
    per_match_kills = get_per_match_kills(matches, kill_event_rows)
    ast = calculate_ast(matches, per_match_kills)


    for row in recent_kill_event_rows:
        if row["attacker_name"] == PLAYER_NAME:
            recent_kills += 1
            recent_dmg_dealt += row["dmg_dealt"]
            if row["headshot"]:
                recent_headshots += 1
        if row["attacked_name"] == PLAYER_NAME:
            recent_deaths += 1
        if row["assister_name"] == PLAYER_NAME:
            recent_assists += 1

    for match in recent_matches:
        recent_total_rounds += match["total_rounds"]

    recent_kd = round(calculate_kda(recent_kills, recent_deaths, recent_assists), 2)
    recent_hsPercentage = calculate_hsPercentage(recent_kills, recent_headshots)
    recent_adr = calculate_adr(recent_dmg_dealt, recent_total_rounds)
    recent_per_match_kills = get_per_match_kills(recent_matches, recent_kill_event_rows)
    recent_ast = calculate_ast(recent_matches, recent_per_match_kills)

    print(f"Recent kd: {recent_kd}")
    
    kd_delta = compare_stat(kd, recent_kd)
    hsPercentage_delta = compare_stat(hsPercentage, recent_hsPercentage)
    adr_delta = compare_stat(adr, recent_adr)
    ast_delta = compare_stat(ast, recent_ast)

    return {
        "kd": kd,
        "hsPercentage": hsPercentage,
        "adr": adr,
        "ast": ast,
        "recent_kd": recent_kd,
        "recent_hsPercentage": recent_hsPercentage,
        "recent_adr": recent_adr,
        "recent_per_match_kills": recent_per_match_kills,
        "recent_ast": recent_ast,
        "kd_delta": kd_delta,
        "hsPercentage_delta": hsPercentage_delta,
        "adr_delta": adr_delta,
        "ast_delta": ast_delta,
        "compare_against_last": COMPARE_AGAINST_LAST
    }
