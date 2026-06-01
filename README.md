# CS2 Demo Stat Tracker

> ⚠️ **Work in progress** — this project is in early development. Core stat computation is being implemented and the dashboard does not exist yet.

A personal CS2 statistics tracker that parses match demo files to extract and visualise performance data. The goal is to track kills, deaths, damage, and positional data across matches and display them in a local Plotly Dash dashboard.

---

## Planned Features

- Parse CS2 `.dem` files using `demoparser2`
- Compute K/D, ADR, headshot %, KAST, and side splits per match
- Store match history and per-kill events in a local SQLite database
- Auto-import new demos via a folder watcher
- Interactive Dash dashboard with:
  - Performance trends over time (K/D, ADR, KAST)
  - Per-map win rate and stat breakdowns
  - Death density heatmap overlaid on CS2 radar images
  - Kill-line map showing attacker and victim positions
  - Weapon breakdown and area death analysis

---

## Current Status

| Module | Status |
|---|---|
| `parser.py` | In progress |
| `stats.py` | In progress |
| `db.py` | Not started |
| `watcher.py` | Not started |
| `app.py` | Not started |

---

## Requirements

- Python 3.10+
- CS2 installed via Steam (for demo files)

---

## Installation

**1. Clone the repository**

```bash
git clone https://github.com/yourusername/cs2-tracker.git
cd cs2-tracker
```

**2. Create and activate a virtual environment**

```bash
python -m venv .venv

# macOS/Linux
source .venv/bin/activate

# Windows
.venv\Scripts\activate
```

**3. Install dependencies**

```bash
pip install -r requirements.txt
```

**4. Configure your player name**

Open `config.py` and update the following:

```python
PLAYER_NAME  = "YourSteamUsername"
REPLAYS_DIR  = r"C:\path\to\your\csgo\replays"
DB_PATH      = "cs2_stats.db"
```

Your Steam display name must match exactly — this is how the tracker identifies your events in the demo data.

---

## Project Structure

```
cs2-tracker/
├── src/
│   ├── parser.py       # Demo parsing — raw events → DataFrames
│   ├── stats.py        # Stat computation — DataFrames → metrics
│   ├── db.py           # SQLite read/write
│   ├── watcher.py      # Folder watcher and pipeline orchestration
│   └── app.py          # Plotly Dash dashboard
├── assets/
│   └── maps/           # CS2 radar PNG images (see below)
├── config.py           # Player name, paths, and map configs
├── requirements.txt
├── .gitignore
└── README.md
```

---

## Getting Demo Files

1. Open CS2 and go to **Watch → Your Matches**
2. Click the download icon next to any match
3. Demos save to your CS2 replays folder:

```
Windows: C:\Program Files (x86)\Steam\steamapps\common\Counter-Strike Global Offensive\game\csgo\replays\
```

---

## Stat Definitions

**K/D** — kills divided by deaths. Above 1.0 means more kills than deaths per match.

**ADR** — average damage per round. Measures round impact independent of kills. Benchmarks: below 60 weak, 60–75 average, 75–90 above average, 90+ strong.

**Headshot %** — percentage of your kills that were headshots.

**KAST** — percentage of rounds where you got a Kill, Assist, Survived, or were Traded within 5 seconds of dying. The best single measure of overall round contribution.

**Side split** — K/D computed separately for T-side and CT-side rounds.

---

## Acknowledgements

- [demoparser2](https://github.com/LaihoE/demoparser) — CS2 demo parsing
- [Plotly Dash](https://dash.plotly.com/) — dashboard framework
- [ghostcap-gaming/cs2-map-images](https://github.com/ghostcap-gaming/cs2-map-images) — CS2 radar images (required for heatmap visualisations, not yet implemented)
