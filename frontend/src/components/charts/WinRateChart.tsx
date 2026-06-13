interface WinRate {
	map_name: string;
	win_rate: number;
}

interface WinRateByMapProps {
	maps: WinRate[];
}



export default function WinRateByMap({ maps }: WinRateByMapProps) {

	const sorted_maps = [...maps].sort((a, b) => b.win_rate - a.win_rate);

	return (
		<div className={`w-full h-full bg-cards border-1 border-border rounded-lg p-4`}>
			<p className="text-text3 text-md font-semibold ml-4 mb-4">
				Win Rate By Map 
			</p>
			<div className={`w-full h-full`}>
				<ul className={`w-full h-full`}>
					{sorted_maps.map((map, index) => {
						const isFirst = index === 0;
						const isLast = index === sorted_maps.length - 1;

						const barColor = isFirst ? "bg-teal" : isLast ? "bg-red" : "bg-blue";
						return(
							<li key={index} className={`
								w-full h-fit 
								flex justify-between items-center 
								border-1 border-border`
							}>
								<span className={`text-text2 text-md font-semibold`}>
									{map.map_name}
								</span>
								<div className={`percentage-bar-background flex-1 h-4 rounded-full overflow-hidden`}>
									<div 
										className={`
											percentage-bar h-full ${barColor} 
											transition-all duration-500`} 
										style={{ width: `${map.win_rate}%`}}
									>
									</div>
								</div>
								<span className={`${barColor} text-md`}>
									{map.win_rate}%
								</span>
							</li>
						);
					})}
				</ul>
			</div>
		</div>
	) 

}
