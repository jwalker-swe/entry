import KillFeedRow from "./KillFeedRow" 

interface KillEvent {
	id: number;
	match_id: number;
	demo_id: string | null;
	map_name: string;
	round_num: number;
	attacker_name: string;
	attacked_name: string;
	assister_name: string;
	attacker_team_name: string;
	attacked_team_name: string;
	assister_team_name: string;
	attacker_x: number;
	attacker_y: number;
	attacker_z: number;
	attacked_x: number;
	attacked_y: number;
	attacked_z: number;
	assister_x: number;
	assister_y: number;
	assister_z: number;
	attacker_last_place_name: string;
	attacked_last_place_name: string;
	assister_last_place_name: string;
	weapon_used: string;
	kill_distance: number;
	headshot: boolean;
	hit_group: string;
	dmg_dealt: number;
	dmg_received: number;
	tick: number;
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
					{data[0].map((event, index: number) => {
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
