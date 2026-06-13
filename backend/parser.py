from typing import TypedDict, NotRequired
from demoparser2 import DemoParser
from watcher import get_path_to_demos, scan_directory 
from dotenv import load_dotenv
from pathlib import Path  
from config import DEMO_DIRECTORY, PLAYER_NAME
import pandas as pd 
import os

load_dotenv()

class Position(TypedDict):
    x_position: float | None
    y_position: float | None
    z_position: float | None

class RoundStats(TypedDict):
    round_num: int | None
    attacker: str
    attacker_pos: Position
    attacker_last_place_name: str
    attacker_team_name: str
    attacked: str
    attacked_pos: Position
    attacked_last_place_name: str
    assister: str
    assister_pos: Position
    assister_last_place_name: str
    weapon_used: str
    kill_distance: str
    headshot: bool
    dmg_dealt: NotRequired[float]
    dmg_received: NotRequired[float]

demo_directory: str = Path(DEMO_DIRECTORY)
#print(f'Demo Directory: {demo_directory}')
#parser = DemoParser(demo_paths)

#With these set option, you can run python3/parser.py | less -S to view entire data frame.
#Otherwise, can comment these options out.
pd.set_option('display.max_rows', None)
pd.set_option('display.max_columns', None)
pd.set_option('display.max_colwidth', None)


def get_map_info(parser) -> str:
    # Get df of map headers
    df = parser.parse_header()
    map_name: str = df["map_name"]
    
    # Get df of round events and df of player info
    df = parser.parse_event("round_end", other=["winner", "total_rounds_played"])
    round_end_ticks = df['tick'].tolist()
    player_ticks = parser.parse_ticks(["team_num", "name"], ticks=round_end_ticks)
    player_data = player_ticks[player_ticks["name"] == PLAYER_NAME]

    player_team_round_wins = 0
    player_team_round_losses = 0
    player_ct_round_wins = 0
    player_ct_round_losses = 0
    player_t_round_wins = 0
    player_t_round_losses = 0

    for index, r in enumerate(player_data.itertuples()):
        current_side = ''
        if r.team_num == 2:
            current_side = 'T'
        elif r.team_num == 3:
            current_side = 'CT'

        winning_side = df["winner"]

        if current_side == winning_side[index]:
            player_team_round_wins += 1
            if current_side == 'T':
                player_t_round_wins += 1
            else:
                player_ct_round_wins += 1
        else:
            player_team_round_losses += 1
            if current_side == 'T':
                player_t_round_losses += 1
            else:
                player_ct_round_losses += 1


    # Match won 0 == win, 1 == loss, 2 == draw
    match_status = ''

    if player_team_round_wins > player_team_round_losses:
        match_status = 'Won'
    elif player_team_round_wins < player_team_round_losses:
        match_status = 'Loss'
    elif player_team_round_wins == player_team_round_losses:
        match_status = 'Draw'

    total_rounds_played = max(df["total_rounds_played"])

    map_info = {
        "map_name": map_name,
        "match_status": match_status,
        "total_rounds_played": total_rounds_played,
        "ct_round_wins": player_ct_round_wins,
        "ct_round_losses": player_ct_round_losses,
        "t_round_wins": player_t_round_wins,
        "t_round_losses": player_t_round_losses
    }
    


    return map_info



def get_death_events(parser):
    # Create data frame based on player_death events and filter based on if a specific user was involved in the event
    df = parser.parse_event("player_death", player=["X", "Y", "Z", "last_place_name", "team_name", "total_rounds_played", "round_freeze_end", "hitgroup"])
    round_wins = parser.parse_event("round_end", other=["round", "winner"])
    #filtered_df = df.loc[(df["attacker_name"] == "Cereal") | (df["user_name"] == "Cereal") | (df["assister_name"] == "Cereal")]

    # Iterate over each row in the filtered data frame and create a list of dictionaries with the key value pairs listed below
    my_kda_events: list[RoundStats] = []
    total_rounds = 1

    for row in df.itertuples():
        if row.total_rounds_played + 1 > total_rounds:
            total_rounds = row.total_rounds_played + 1


        currentRound = {
                "round_num": row.total_rounds_played + 1,
                "round_winner": None,
                "attacker_name": row.attacker_name,
                "attacked_name": row.user_name,
                "assister_name": row.assister_name,
                "attacker_team_name": row.attacker_team_name,
                "attacked_team_name": row.user_team_name,
                "assister_team_name": row.assister_team_name,
                "attacker_pos": {"x": row.attacker_X, "y": row.attacker_Y, "z": row.attacker_Z},
                "attacked_pos": {"x": row.user_X, "y": row.user_Y, "z": row.user_Z},
                "assister_pos": {"x": row.assister_X, "y": row.assister_Y, "z": row.assister_Z},
                "attacker_last_place_name": row.attacker_last_place_name,
                "attacked_last_place_name": row.user_last_place_name,
                "assister_last_place_name": row.assister_last_place_name,
                "weapon_used": row.weapon,
                "kill_distance": row.distance,
                "headshot": row.headshot,
                "hit_group": row.hitgroup,
                "dmg_dealt": row.dmg_armor + row.dmg_health if row.attacker_name == PLAYER_NAME else None,
                "dmg_received": row.dmg_armor + row.dmg_health if row.user_name == PLAYER_NAME else None,
                "tick": row.tick,
                "demo_id": None,
                "map_name": None,
            }
    
        my_kda_events.append(currentRound)
        for event in my_kda_events:
            event["total_rounds_played"] = total_rounds

    # Return the list of dictionaries from above
    return my_kda_events


def get_info_to_upload():
    # Scan demo directory for .dem.bz2 files, decompress them to .dem and return paths to each demo in a list for processing
    scan_directory(demo_directory)
    paths_to_demos = get_path_to_demos(demo_directory)
    per_match_player_death_events = []
    map_info = []
    
    for index, path in enumerate(paths_to_demos):
        print(f"Parsing: {path}")
        parser = DemoParser(path)
#
#        print(f"Map Info: {get_map_info(parser)}")
        current_map_info = get_map_info(parser)
        current_map_info["demo_id"] = path.split("/")[-1].split(".")[0]
        map_info.append(current_map_info)
#        map_info.append({"map_name": get_map_info(parser), "demo_id": path.split("/")[-1].split(".")[0]})
#        demo_id = map_info[index]["demo_path"].split("/")[-1].split(".")[0]
        death_events = get_death_events(parser)
        for event in death_events:
            event["map_name"] = map_info[index]["map_name"]
            event["demo_id"] = map_info[index]["demo_id"]

        per_match_player_death_events.append(death_events)

        for index, match in enumerate(per_match_player_death_events):
            if index < len(map_info):
                map_info[index]["total_rounds_played"] = match[index]["total_rounds_played"]
                map_info[index]["match_winner"] = match[index]["round_winner"]
            else:
                break

    print("\n") 

    return map_info, per_match_player_death_events


#get_info_to_upload()


    
