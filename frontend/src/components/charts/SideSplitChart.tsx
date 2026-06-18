import { IconPointFilled } from '@tabler/icons-react';

interface KillEvent {
	attacker_name: string;
	attacked_name: string;
	assister_name: string;
	attacker_team_name: string;
	attacked_team_name: string;
	assister_team_name: string;
	dmg_dealt: number;
}

type SideSplitData = [KillEvent[], KillEvent[], string];

interface SideSplitProps {
	data: SideSplitData | null;
}

interface CalcStatsProps {
	events: KillEvent[];
	player_name: string;
}


function calculateStats({ events, player_name }: CalcStatsProps) {

	const kills: KillEvent[] = [];
	const deaths: KillEvent[] = [];

	events.forEach(event => {
		if (event.attacker_name == player_name) {
			kills.push(event);
		} else if (event.attacked_name == player_name) {
			deaths.push(event);
		}
	});

	const totalK = kills.length;
	const totalD = deaths.length;
	const kd = (totalK / totalD).toFixed(2);

	return {totalK, totalD, kd}
}

export default function SideSplit({ data }: SideSplitProps) {

	if (!data) {
		return (
			<div>
				Loading stats...
			</div>
		)
	}

	const [tSideEvents, tSideAST, ctSideEvents, ctSideAST, playerName] = data;

	const tStats = calculateStats({ events: tSideEvents, player_name: playerName });
	const ctStats = calculateStats({ events: ctSideEvents, player_name: playerName });

	return (
		<div className={`
			w-full h-full
			bg-cards border border-border
			rounded-lg p-4
		`}>
			<p className="text-text3 text-md font-semibold ml-4 mb-4">
				SIDE SPLIT - K/D
			</p>
			<div
				className={`
					w-full h-fit grid grid-cols-2 grid-rows-1 gap-4 tabular-nums
				`}	
			>
				<div className={`
					bg-void w-full h-full flex flex-col justify-center items-center p-2 rounded-md
				`}>
					<span className={`text-amber text-xl mt-2 mb-2`}>
						T SIDE
					</span>
					<span className={`text-text1 text-5xl font-semibold mb-2`}>
						{tStats.kd}
					</span>
					<div className={`flex w-fit h-fit jusftify-center items-center text-text2 mb-4`}> 
						<span> 
							{tStats.totalK}K
						</span>
						<IconPointFilled size={8} className={`mx-2`}/>
						<span>
							{tStats.totalD}D
						</span>
					</div>
				</div>
				<div className={`
					bg-void w-full h-full flex flex-col justify-center items-center p-2 rounded-md
				`}>
					<span className={`text-cobalt text-xl mt-2 mb-2`}>
						CT SIDE
					</span>
					<span className={`text-text1 text-5xl font-semibold mb-2`}>
						{ctStats.kd}
					</span>
					<div className={`flex w-fit h-fit jusftify-center items-center text-text2 mb-4`}> 
						<span> 
							{ctStats.totalK}K
						</span>
						<IconPointFilled size={8} className={`mx-2`}/>
						<span>
							{ctStats.totalD}D
						</span>
					</div>
				</div>
			</div>
			<hr className={`text-text3 mt-4`}/>
			<p className='text-text3 text-md font-semibold ml-4 mb-2 mt-4'>
				KAST by side
			</p>
			<div
				className={`
					w-full h-fit grid grid-cols-2 grid-rows-1 gap-4 tabular-nums
				`}	
			>
				<div className={`
					bg-void w-full h-full flex justify-center items-center p-2 rounded-md
				`}>
					<span className={`text-amber text-xl mt-2 mb-2`}>
						T SIDE <span className='text-text1'>{tSideAST}%</span>
					</span>
				</div>
				<div className={`
					bg-void w-full h-full flex justify-center items-center p-2 rounded-md
				`}>
					<span className={`text-cobalt text-xl mt-2 mb-2`}>
						CT SIDE <span className='text-text1'>{ctSideAST}%</span>
					</span>
				</div>
			</div>

		</div>
	)


}
