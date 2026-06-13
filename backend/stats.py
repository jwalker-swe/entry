from typing import TypedDict
from parser import get_death_events, get_map_info
from demoparser2 import DemoParser
from config import PLAYER_NAME
import pandas as pd 
import os

#demo_paths: str = "/home/jordan/workspace/jwalker/entry/demos/match730_003822397632173572324_1715874826_404.dem"
    
#parser = DemoParser(demo_paths)
#
#map_name = get_map_name(parser)
#death_events = get_death_events(parser)


def calculate_kda(kills: int, deaths: int, assists: int):
    
    kda = (kills + assists) / deaths
    kd = kills / deaths

    return kd


def calculate_hsPercentage(kills: int, headshot: int):
    hsPercentage = round((headshot / kills), 2) * 100

    return hsPercentage


def calculate_adr(dmg_dealt: float, rounds_played: int):
    adr = round((dmg_dealt / rounds_played ), 2) 

    return adr


def get_per_match_kills(match_info, kills):
    current_id = ""
    match_kills = []
    for match in match_info:
        current_id = match["demo_id"]
        current_kills = []
        for kill in kills:
            if kill["demo_id"] == current_id:
                current_kills.append(kill)

        match_kills.append(current_kills)

    return match_kills


def calculate_ast(match_info, per_match_kills):
    total_rounds = 0
    kast_rounds = 0
    for match_index, match_kills in enumerate(per_match_kills):    
        match_rounds = match_info[match_index]["total_rounds"]
        total_rounds += match_rounds

        for i in range(match_rounds):
            current_round = i + 1;
            events_this_round = []

            got_kill = False;
            got_assist = False;
            got_traded = False;
            survived = True;

            for kill in match_kills:
                if kill["round_num"] == current_round:
                    events_this_round.append(kill)

            for event in events_this_round:
                if event["attacker_name"] == PLAYER_NAME:
                    got_kill = True;
                if event["assister_name"] == PLAYER_NAME:
                    got_assist = True;
                if event["attacked_name"] == PLAYER_NAME:
                    survived = False;
                    current_tick = event["tick"];
                    current_attacker = event["attacker_name"];

                    trade_tick_max = current_tick + (64 * 5);

                    for event in events_this_round:
                        if event["tick"] > trade_tick_max:
                            if event["attacked_name"] == current_attacker:
                                got_traded = True;

            if got_kill or got_assist or got_traded or survived:
                kast_rounds += 1

    kast = round((kast_rounds / total_rounds) * 100, 2)
    return kast
                                       


def compare_stat(stat: float, recent_stat: float):
    diff = round((stat - recent_stat), 2)

    return diff

#def calculate_hs_percentage(death_events):
#    my_kills = []
#    headshot_total = []
#
#    for event in death_events:
#        if event["attacker"] == "Cereal":
#            my_kills.append(event)
#
#    total_kills = len(my_kills)
#    
#    for kill in my_kills:
#        if kill["headshot"]:
#            headshot_total.append(kill)
#
#    headshot_percentage: float = len(headshot_total) / total_kills
#    headshot_percentage = round(headshot_percentage, 2) * 100
#
#    return headshot_percentage
#
#
#
#def calc_adr(death_events):
#    total_rounds = -1;
#    for event in death_events:
#        print(event)
#
#
#
#def find_primary_weapon_used(death_events):
#    my_kills = []
#    weapon_kill_tracker = {}
#
#    for event in death_events:
#        if event["attacker"] == "Cereal":
#            my_kills.append(event)
#
#    for kill in my_kills:
#        weapon_kill_tracker[kill["weapon_used"]] = weapon_kill_tracker.get(kill["weapon_used"], 0) + 1
#
#    sorted_weapon_kill_tracker = dict(sorted(weapon_kill_tracker.items(), key=lambda item: item[1], reverse=True))
#
#    primary_weapon = ""
#    kills_with_primary_weapon = 0
#
#    for index, weapon in enumerate(sorted_weapon_kill_tracker):
#        if index == 0:
#            primary_weapon = weapon
#            kills_with_primary_weapon = sorted_weapon_kill_tracker[weapon]
#
#    percentage_of_kills_with_primary_weapon = (kills_with_primary_weapon / len(my_kills)) * 100
#    
#    return {"primary_weapon": primary_weapon, "kills_with_primary_weapon": kills_with_primary_weapon, "percentage_of_kills_with_primary_weapon": percentage_of_kills_with_primary_weapon}
#
#kda = calculate_kda(death_events)
#headshot_percentage = calculate_hs_percentage(death_events)
#primary_weapon = find_primary_weapon_used(death_events)
#
#print(f'Stats from Previous Game: \n')
#print(f'Kills: {kda["kills"]}')
#print(f'Deaths: {kda["deaths"]}')
#print(f'Assists: {kda['assists']}')
#print(f'KD: {kda["kd"]}')
#print(f'KDA: {kda["kda"]}')
#print(f'Headshot Percentage: {headshot_percentage}')
#print(f'{primary_weapon['percentage_of_kills_with_primary_weapon']}% of your kills this game were using the {primary_weapon["primary_weapon"]} with {primary_weapon["kills_with_primary_weapon"]} kills coming from it.\n')
#
