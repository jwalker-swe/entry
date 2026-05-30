from typing import TypedDict
from parser import get_death_events, get_map_name
from demoparser2 import DemoParser
import pandas as pd 
import os

demo_paths: str = "/home/jordan/workspace/jwalker/entry/demos/match730_003822397632173572324_1715874826_404.dem"
    
parser = DemoParser(demo_paths)

map_name = get_map_name(parser)
death_events = get_death_events(parser)


def calculate_kda(death_events):
    my_kills = []
    my_deaths = []
    my_assists = []

    for event in death_events: 
        if event["attacker"] == "Cereal":
            my_kills.append(event)
        elif event["attacked"] == "Cereal":
            my_deaths.append(event)
        elif event["assister"] == "Cereal":
            my_assists.append(event)

    my_kd: float = len(my_kills) / len(my_deaths)
    my_kd = round(my_kd, 2)

    my_kda: float = (len(my_kills) + len(my_assists)) / len(my_deaths)
    my_kda = round(my_kda, 2)
    total_kills = len(my_kills)
    total_deaths = len(my_deaths)
    total_assists = len(my_assists)

    return {"kd": my_kd, "kda": my_kda, "kills": total_kills, "deaths": total_deaths, "assists": total_assists}



def calculate_headshot_percentage(death_events):
    my_kills = []
    headshot_total = []

    for event in death_events:
        if event["attacker"] == "Cereal":
            my_kills.append(event)

    total_kills = len(my_kills)
    
    for kill in my_kills:
        if kill["headshot"]:
            headshot_total.append(kill)

    headshot_percentage: float = len(headshot_total) / total_kills
    headshot_percentage = round(headshot_percentage, 2) * 100

    return headshot_percentage



def find_primary_weapon_used(death_events):
    my_kills = []
    weapon_kill_tracker = {}

    for event in death_events:
        if event["attacker"] == "Cereal":
            my_kills.append(event)

    for kill in my_kills:
        weapon_kill_tracker[kill["weapon_used"]] = weapon_kill_tracker.get(kill["weapon_used"], 0) + 1

    sorted_weapon_kill_tracker = dict(sorted(weapon_kill_tracker.items(), key=lambda item: item[1], reverse=True))

    primary_weapon = ""
    kills_with_primary_weapon = 0

    for index, weapon in enumerate(sorted_weapon_kill_tracker):
        if index == 0:
            primary_weapon = weapon
            kills_with_primary_weapon = sorted_weapon_kill_tracker[weapon]

    percentage_of_kills_with_primary_weapon = (kills_with_primary_weapon / len(my_kills)) * 100
    
    return {"primary_weapon": primary_weapon, "kills_with_primary_weapon": kills_with_primary_weapon, "percentage_of_kills_with_primary_weapon": percentage_of_kills_with_primary_weapon}

kda = calculate_kda(death_events)
headshot_percentage = calculate_headshot_percentage(death_events)
primary_weapon = find_primary_weapon_used(death_events)

print(f'Stats from Previous Game: \n')
print(f'Kills: {kda["kills"]}')
print(f'Deaths: {kda["deaths"]}')
print(f'Assists: {kda['assists']}')
print(f'KD: {kda["kd"]}')
print(f'KDA: {kda["kda"]}')
print(f'Headshot Percentage: {headshot_percentage}')
print(f'{primary_weapon['percentage_of_kills_with_primary_weapon']}% of your kills this game were using the {primary_weapon["primary_weapon"]} with {primary_weapon["kills_with_primary_weapon"]} kills coming from it.\n')

