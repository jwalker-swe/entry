import { sort } from "d3"
import OutcomePill from "../killfeed/OutcomePill"

type MatchHistoryProp = {
	map_name: string,
	match_result: string,
	match_score: string,
	kd: number,
	adr: number,
	hs_percentage: number,
	kast: number
}

export default function MatchHistory({ data }: { data: MatchHistoryProp[] }) {

	const sorted_by_kd = [...data].sort((a, b) => b.kd - a.kd);
	const sorted_by_adr = [...data].sort((a, b) => b.adr - a.adr);
	const sorted_by_hs = [...data].sort((a, b) => b.hs_percentage - a.hs_percentage);
	const sorted_by_kast = [...data].sort((a, b) => b.kast - a.kast);

	console.log("Sorted by kd: ", sorted_by_kd);

	return (
		<div className="w-full h-fit">
			<p className="text-text3">
				MATCH HISTORY
			</p>
			<div className="w-full h-fit border border-border rounded-2xl overflow-hidden mt-4">
				<ul className="w-full h-fit flex flex-col justify-start items-center">
					{ data.map((item, index) => {
						if (index === 0) {
							return (
								<li key={index} className="match-history-item w-full h-fit pl-4 flex justify-start items-center py-2 text-text3 bg-elevated">
									<span className="grow">MAP</span>
									<span className="grow">RESULT</span>
									<span className="w-20 text-center">SCORE</span>
									<span className="w-20 text-center">K/D</span>
									<span className="w-20 text-center">ADR</span>
									<span className="w-20 text-center">HS%</span>
									<span className="w-20 text-center">KAST</span>
								</li>
							)
						}	

						const statusColor = item.match_result == 'Won' ? 'text-teal' : item.match_result == 'Loss' ? 'text-red' : 'text-text2';
						const hitGroup = item.match_result == 'Won' ? 'Win' : item.match_result == 'Loss' ? 'Loss' : 'Draw';
						const kdColor = item.kd == sorted_by_kd[0].kd ? 'text-teal' : item.kd == sorted_by_kd.at(-1).kd ? 'text-red' : 'text-text1';
						const adrColor = item.adr == sorted_by_adr[0].adr ? 'text-teal' : item.adr == sorted_by_adr.at(-1).adr ? 'text-red' : 'text-text1';
						const hsColor = item.hs_percentage == sorted_by_hs[0].hs_percentage ? 'text-teal' : item.hs_percentage == sorted_by_hs.at(-1).hs_percentage ? 'text-red' : 'text-text1';
						const kastColor = item.kast == sorted_by_kast[0].kast ? 'text-teal' : item.kast == sorted_by_kast.at(-1)?.kast ? 'text-red' : 'text-text1';

						return (
							<li key={index} className="match-history-item w-full h-fit pl-4 flex justify-start items-center py-2 bg-cards">
								<span className="text-text2 font-semibold grow w-8 h-fit">{item.map_name}</span>
								<div className="grow h-fit">
									<div className="w-fit h-fit flex justify-start items-center">
										<OutcomePill statusColor={statusColor} hitGroup={hitGroup} />
									</div>
								</div>
								<span className="match-history-text w-21 text-center text-text3 font-semibold">{item.match_score}</span>
								<span className={`match-history-text w-20 text-center ${kdColor}`}>{item.kd}</span>
								<span className={`match-history-text w-20 text-center ${adrColor}`}>{item.adr}</span>
								<span className={`match-history-text w-20 text-center ${hsColor}`}>{item.hs_percentage}</span>
								<span className={`match-history-text w-20 text-center ${kastColor}`}>{item.kast}</span>
							</li>
						)
					})}
				</ul>
			</div>
		</div>
	)
}
