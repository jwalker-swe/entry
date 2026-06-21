import {useState, useEffect} from 'react';
import OutcomePill from "../killfeed/OutcomePill";

type MapPerformanceProps = {
	map_name: string,
	kd: number,
	adr: number,
	win_rate: number,
	total_wins: number,
	total_losses: number,
	ct_kd: number,
	t_kd: number,
}

const PALETTE_COLORS = [
	"bg-cobalt",
	//"#1D9E75",
	"bg-amber",
	"bg-lavender",
	//"#475569",
];


export default function MapPerformance({ data }: { data: MapPerformanceProps[] }) {

	const [isExpanded, setIsExpanded] = useState(false);

	useEffect(() => {

		const timer = setTimeout(() => {
			setIsExpanded(true);
		}, 200);

		return () => clearTimeout(timer);

	}, []);

	const map_pool = ['de_ancient', 'de_anubis', 'de_dust2', 'de_inferno', 'de_mirage', 'de_nuke', 'de_overpass', 'de_train', 'de_vertigo'];
	const sorted_map_data = [...data].sort((a, b) => b.win_rate - a.win_rate);
	const total_maps = map_pool.length;

	const maxKd = data.length > 0 ? Math.max(...data.map(item => item.kd)) : 0;
	const maxAdr = data.length > 0 ? Math.max(...data.map(item => item.adr)) : 0;
	const maxWinRate = data.length > 0 ? Math.max(...data.map(item => item.win_rate)) : 0;
	const minKd = data.length > 0 ? Math.min(...data.map(item => item.kd)) : 0;
	const minAdr = data.length > 0 ? Math.min(...data.map(item => item.adr)) : 0;
	const minWinRate = data.length > 0 ? Math.min(...data.map(item => item.win_rate)) : 0;

	return (
		<div className="w-full h-fit grid grid-cols-2 grid-rows-auto gap-4 mt-4">
			{ sorted_map_data.map((item, index) => {

				const bestMap = index == 0 ? true : false;
				const worstMap = index == sorted_map_data.length - 1 ? true : false;

				const isHighestKd = item.kd === maxKd && maxKd > 0;
				const isHighestAdr = item.adr === maxAdr && maxAdr > 0;
				const isHighestWinRate = item.win_rate === maxWinRate && maxWinRate > 0;

				const isMinkd = item.kd === minKd;
				const isMinAdr = item.adr === minAdr;
				const isMinWinRate = item.win_rate === minWinRate;

				const kdColor = isHighestKd ? 'text-teal' : isMinkd ? 'text-red' : 'text-text1';
				const adrColor = isHighestAdr ? 'text-teal' : isMinAdr ? 'text-red' : 'text-text1';
				const winRateColor = isHighestWinRate ? 'text-teal' : isMinWinRate ? 'text-red' : 'text-text1';

				const barWidth = item.win_rate.toString() + '%';
				let barColor = isHighestWinRate ? 'bg-teal' : isMinWinRate ? 'bg-red' : PALETTE_COLORS[index % sorted_map_data.length];
				
				

				return (
					<div key={index} className="w-full h-fit bg-surface border border-border hover:border-cobalt rounded-2xl p-4">
						<div className="w-full h-fit flex justify-between items-center">
							<span className="text-text1 font-semibold">{item.map_name}</span>
							{ bestMap && (
								<div className="w-20 h-fit">
									<OutcomePill statusColor="text-cobalt" hitGroup={"Best Map"} />
								</div>
							)}
							{ worstMap && (
								<div className="w-25 h-fit">
									<OutcomePill statusColor="text-red" hitGroup={"Worst Map"} />
								</div>
							)}
						</div>
						<div className="w-full h-fit flex justify-around items-center tabular-nums mt-2">
							<div className="flex flex-col w-fit h-fit justify-center items-center">
								<p className={`${kdColor} text-3xl font-semibold`}>
									{item.kd}
								</p>
								<span className="text-text3 text-center font-semibold">
									K/D
								</span>
							</div>
							<div className="flex flex-col w-fit h-fit justify-center items-center">
								<p className={`${adrColor} text-3xl font-semibold`}>
									{item.adr}
								</p>
								<span className="text-text3 text-center font-semibold">
									ADR
								</span>
							</div>
							<div className="flex flex-col w-fit h-fit justify-center items-center">
								<p className={`${winRateColor} text-3xl font-semibold`}>
									{item.win_rate}%
								</p>
								<span className="text-text3 text-center font-semibold">
									Win Rate
								</span>
							</div>
						</div>
						<div className="flex justify-between items-center">
							<p className="text-text3 mt-2">
								Win Rate
							</p>
							<div className="text-text3 font-semibold">
								<span className="mr-2">{item.total_wins}W</span>
								<span>{item.total_losses}L</span>
							</div>
						</div>
						<div className="w-full h-2 bg-void rounded-full">
							<div className={`h-2 ${barColor} rounded-full transition-all duration-500 ease-in-out`} style={{width: isExpanded ? barWidth : '0%'}}>
							</div>
						</div>
						<div className="grid grid-cols-2 grid-rows-1 gap-2 mt-4">
							<div className={`w-full h-fit border-cobalt bg-cobalt/10 border rounded-lg py-2`}>
								<p className="w-full text-center text-cobalt">
									CT K/D <span>{item.ct_kd}</span>
								</p>
							</div>
							<div className={`w-full h-fit border-amber bg-amber/10 border rounded-lg py-2`}>
								<p className="w-full text-center text-amber">
									CT K/D <span>{item.t_kd}</span>
								</p>
							</div>

						</div>
					</div>
				);
			})};
		</div>
	)
}
