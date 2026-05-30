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

    return {"kd": my_kd, "kda": my_kda}



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



kda = calculate_kda(death_events)
headshot_percentage = calculate_headshot_percentage(death_events)

print(f'Stats from Previous Game: \n')
print(f'KD: {kda["kd"]}')
print(f'KDA: {kda["kda"]}')
print(f'Headshot Percentage: {headshot_percentage}\n')

