import { useState, useEffect } from 'react';

interface WinRate {
	map_name: string;
	win_rate: number;
}

interface WinRateByMapProps {
	maps: WinRate[];
}



export default function WinRateByMap({ data }: WinRateByMapProps) {

	const [isExpanded, setIsExpanded] = useState(false);
	const sorted_maps = [...data].sort((a, b) => b.win_rate - a.win_rate);

	// Create animation for progress bar by setting timer to isExpanded becoming true
	useEffect(() => {

		const timer = setTimeout(() => {
			setIsExpanded(true);
		}, 200);

		return () => clearTimeout(timer);

	}, []);


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
						const textColor = isFirst ? "text-teal" : isLast ? "text-red" : "text-text3";

						return(
							<li key={index} className={`
								w-full h-8 py-3
								flex justify-between items-center
								border-b-1 border-border`
							}>
								<span className={`text-text2 text-md font-semibold w-24`}>
									{map.map_name}
								</span>
								<div className={`
									percentage-bar-background flex-1 
									grow h-full 
									bg-border
									rounded-full overflow-hidden`
								}>
									<div
										style={{ width: isExpanded ? `${map.win_rate}%` : 0}}
										className={`
											percentage-bar h-full ${barColor} 
											transition-all duration-500 ease-in-out
											rounded-full`} 
									>
									</div>
								</div>
								<span className={`${textColor} text-md w-14 text-right`}>
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
