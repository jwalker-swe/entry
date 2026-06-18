import KillFeedRow from "./KillFeedRow" 
import OutcomePill from "./OutcomePill"

interface KillEvent {
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	match_id INTEGER NOT NULL,
	demo_id TEXT NOT NULL,
	map_name TEXT,
	round_num INTEGER,
	attacker_name TEXT,
	attacked_name TEXT,
	assister_name TEXT,
	attacker_team_name TEXT,
	attacked_team_name TEXT,
	assister_team_name TEXT,
	attacker_x REAL,
	attacker_y REAL,
	attacker_z REAL,
	attacked_x REAL,
	attacked_y REAL,
	attacked_z REAL,
	assister_x REAL,
	assister_y REAL,
	assister_z REAL,
	attacker_last_place_name TEXT,
	attacked_last_place_name TEXT,
	assister_last_place_name TEXT,
	weapon_used TEXT,
	kill_distance REAL,
	headshot BOOLEAN,
	hit_group TEXT,
	dmg_dealt REAL,
	dmg_received REAL,
	tick INTEGER,
	FOREIGN KEY (match_id) REFERENCES matches(id)
}

interface KillFeedListProps {
	killEvents: KillEvent[]
}

export default function KillFeedList({ data }: KillFeedListProps) {	

	return (
		<>
			<div
				className={`
					w-full h-full
					bg-cards border-1 border-border
					rounded-lg p-4	
				`}
			>
				<p className="text-text3 text-md font-semibold ml-4 mb-4">
					RECENT KILLS
				</p>	
				<div
					className={`
						w-full h-full flex flex-col justify-start items-center	
					`}
				>
					{data[0].map((event, index) => {
						const got_kill = event.attacker_name == data[1];

						const status_color = got_kill ? 'text-teal' : 'text-red';
						const attacker = got_kill ? 'You' : event.attacker_name;
						const attacked = got_kill ? event.attacked_name : 'You';

						return (
							<div key={index} className={`w-full h-fit kill-feed-row pt-1.5`}>
								<KillFeedRow  attacker={attacker} attacked={attacked} statusColor={status_color} headshot={event.headshot} hitGroup={event.hit_group} weapon={event.weapon_used} />
							</div>
						)
					})}
				</div>
			</div>
		</>
	)
}
