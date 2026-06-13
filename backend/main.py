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
    hsPercentage = round(calculate_hsPercentage(kills, headshots), 2)
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
    recent_hsPercentage = round(calculate_hsPercentage(recent_kills, recent_headshots), 2)
    recent_adr = calculate_adr(recent_dmg_dealt, recent_total_rounds)
    recent_per_match_kills = get_per_match_kills(recent_matches, recent_kill_event_rows)
    recent_ast = calculate_ast(recent_matches, recent_per_match_kills)
 
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




@app.get('/stats/matches')
def get_match_stats():
    conn = get_connection()
    cursor = conn.cursor()

    # Pull match data from database
    cursor.execute("""
        SELECT *
        FROM matches
        ORDER by demo_id
        DESC LIMIT ?
    """, (COMPARE_AGAINST_LAST,))

    matches = cursor.fetchall()


    # Pull player data from database
    cursor.execute("""
        SELECT *
        FROM kill_events
        WHERE attacker_name = ? OR attacked_name = ? OR assister_name = ?
    """, (PLAYER_NAME, PLAYER_NAME, PLAYER_NAME))

    kill_events = cursor.fetchall()


    # Close db connection
    cursor.close()


    # Isolate kill events where event["demo_id"] matches match["demo_id"]
    per_match_kill_events = []
    per_match_adr = []
    
    for index, match in enumerate(matches):
        current_id = match["demo_id"]
        current_events = []
        for event in kill_events:
            if event["demo_id"] == current_id:
                current_events.append(event)

        per_match_kill_events.append(current_events)

    for index, match in enumerate(matches):
        current_adr = 0;
        current_dmg = 0;
        rounds_played = match["total_rounds"]

        current_match_events = per_match_kill_events[index]
        for event in current_match_events:
            if event["attacker_name"] == PLAYER_NAME:
                current_dmg += event['dmg_dealt']

        current_adr = round((current_dmg / rounds_played), 2)
        current_match_stats = {
            "demo_id": match["demo_id"],
            "map_name": match["map_name"],
            "adr": current_adr,
            "total_matches": COMPARE_AGAINST_LAST,
        }

        per_match_adr.append(current_match_stats)


    return per_match_adr




@app.get('/stats/map-win-rate')
def get_winRate_per_map():
    conn = get_connection
    cursor = conn.cursor

    cursor.execute("""
        SELECT *
        FROM matches
    """)

    matches = cursor.fetchall()

    cursor.close()

    print(f"Match Info: {matches}")
        
