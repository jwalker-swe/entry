from typing import TypedDict, NotRequired
from demoparser2 import DemoParser
import pandas as pd 
import os

class Position(TypedDict):
    x_position: float | None
    y_position: float | None

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

demo_paths: str = "/home/jordan/workspace/jwalker/entry/demos/match730_003822397632173572324_1715874826_404.dem"
parser = DemoParser(demo_paths)


# With these set option, you can run python3/parser.py | less -S to view entire data frame.
# Otherwise, can comment these options out.
# pd.set_option('display.max_rows', None)
# pd.set_option('display.max_columns', None)
# pd.set_option('display.max_colwidth', None)

def calculate_position_on_map(game_x_pos, game_y_pos, x_pos, y_pos) -> dict[float, float]:
    pixel_x = (game_x - pos_x) / scale
    pixel_y = (game_y - pos_y) / (scale * -1)

    pixel_cordinates: {
            x_cord: pixel_x,
            y_cord: pixel_y
        };

    return pixel_cordinates



def get_map_name(parser) -> str:
    df = parser.parse_header()
    map_name: str = df["map_name"]


    return map_name



def get_death_events(parser):
    # Create data frame based on player_death events and filter based on if a specific user was involved in the event
    df = parser.parse_event("player_death", player=["X", "Y", "last_place_name", "team_name", "total_rounds_played", "round"])
    filtered_df = df.loc[(df["attacker_name"] == "Cereal") | (df["user_name"] == "Cereal") | (df["assister_name"] == "Cereal")]

    # Iterate over each row in the filtered data frame and create a list of dictionaries with the key value pairs listed below
    my_kda_events: list[RoundStats] = []

    for row in filtered_df.itertuples():
        currentRound = {
                "round_num": row.total_rounds_played,
                "attacker": row.attacker_name,
                "attacked": row.user_name,
                "weapon_used": row.weapon,
                "attacker_pos": {row.attacker_X, row.attacker_Y},
                "attacker_last_place_name": row.attacker_last_place_name,
                "attacker_team_name": row.attacker_team_name,
                "attacked_pos": {row.user_X, row.user_Y},
                "attacked_last_place_name": row.user_last_place_name,
                "assister": row.assister_name,
                "assister_pos": {row.assister_X, row.assister_Y},
                "assister_last_place_name": row.assister_last_place_name,
                "kill_distance": row.distance,
                "headshot": row.headshot,
                "dmg_dealt": row.dmg_armor + row.dmg_health if row.attacker_name == "Cereal" else None,
                "dmg_received": row.dmg_armor + row.dmg_health if row.user_name == "Cereal" else None
            }
    
        my_kda_events.append(currentRound)

    # Return the list of dictionaries from above
    return my_kda_events



get_death_events(parser)
