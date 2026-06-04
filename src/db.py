import sqlite3

# Connect to database (Creates the file if it does not exist)
with sqlite3.connect("entry.db") as conn:

    # Create a cursor object to execute SQL statements
    cursor = conn.cursor()

    # Write and execute the CREATE TABLE SQL command
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS matches (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            demo_filename TEXT,
            map_name TEXT,
            match_date TEXT,
            kills INTEGER,
            deaths INTEGER,
            assists INTEGER,
            kd REAL,
            adr REAL,
            hs_percent REAL,
            kast REAL,
            result TEXT,
            total_rounds INTEGER
        )
    ''')

    cursor.execute('''
        CREATE TABLE IF NOT EXISTS kill_events (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            match_id INTEGER,
            map_name TEXT,
            victim_x_pos REAL,
            victim_y_pos REAL,
            attacker_x_pos REAL,
            attacker_z_pos REAL,
            weapon TEXT,
            headshot INTEGER,
            FOREIGN KEY (match_id) REFERENCES matched(id)
        )
    ''')

    cursor.execute('''
        CREATE TABLE IF NOT EXISTS round_stats (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            match_id INTEGER,
            round_num INTEGER,
            winner_side TEXT,
            FOREIGN KEY (match_id) REFERENCES matches(id)
        ) 
    ''')

    conn.commit()

conn.close()


