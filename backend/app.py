from parser import *
from db import get_connection, create_tables, insert_match, insert_kill_events   
from watcher import del_uploaded_demos 
from config import DEMO_DIRECTORY
from dotenv import load_dotenv
from pathlib import Path 
import pandas as pd 
import os


def ingest_demos():
    conn = get_connection()
    create_tables(conn)

    info_to_upload = get_info_to_upload()

    for i, map in enumerate(info_to_upload[0]):
        match_id = insert_match(conn, map["demo_id"], map["map_name"], map["total_rounds_played"])
        if match_id is not None:
            print(f"Adding kda stats for {match_id}...")
            insert_kill_events(conn, match_id, info_to_upload[1][i])

    demo_directory: str = Path(DEMO_DIRECTORY)

    del_uploaded_demos(demo_directory)

