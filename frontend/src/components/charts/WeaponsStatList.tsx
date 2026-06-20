import { useState, useEffect } from 'react';

type WeaponData = {
	weapon_name: string,
	total_kills: number,
	avg_dmg: number,
	hs_percentage: number
}

const PALETTE_COLORS = [
	"bg-cobalt",
	"bg-teal",
	"bg-amber",
	"bg-lavender",
	"bg-text3",
]


export default function WeaponsStatList({ data }: { data: WeaponData[] }) {

const [isExpanded, setIsExpanded] = useState(false);

	useEffect(() => {

		const timer = setTimeout(() => {
			setIsExpanded(true);
		}, 200);

	return () => clearTimeout(timer);

	}, []);

	const data_for_chart = data.filter((weapon) => weapon.weapon_name !== 'world' && weapon.weapon_name !== 'inferno');
	
	let lowest_hs_percentage = data_for_chart[0].hs_percentage;

	data_for_chart.forEach((item, index) => {
		if (item.hs_percentage < lowest_hs_percentage) {
			lowest_hs_percentage = item.hs_percentage;
		};
	});	

	return (
		<div className={`
			w-full h-fit border border-border roudned-2xl mt-4 rounded-2xl overflow-hidden
		`}>
			<div className='w-full h-fit flex justify-start items-center bg-void p-4 rounded-3xl'>
				<span className='weapon-list-label text-text3 w-50'>WEAPON</span>
				<span className='weapon-list-label text-text3 w-10'>KILLS</span>
				<span className='weapon-list-label text-text3 w-20'>AVG DMG</span>
				<span className='weapon-list-label text-text3 grow'>HS %</span>
			</div>
			<div className='w-full h-fit bg-cards'>
				<ul className='w-full h-fit flex flex-col justify-start items-start'>
					{ data_for_chart.map((item, index) => {

						let barColor = PALETTE_COLORS[index % PALETTE_COLORS.length];
						const barPercentage = item.hs_percentage.toString() + '%';

						if (item.hs_percentage == lowest_hs_percentage) {
							barColor = 'bg-red';
						}

						return (
							<li className='weapon-list-item w-full h-fit flex justify-start items-center'>
								<span className='weapon-list-stat text-text1 w-50'>{item.weapon_name.toUpperCase()}</span>
								<span className='weapon-list-stat text-text1 w-10'>{item.kills_with_weapon}</span>
								<span className='weapon-list-stat text-text1 w-20'>{item.avg_dmg}</span>
								<div className='grow h-2 bg-void rounded-full mr-4'>
									<div className={`${barColor} h-full rounded-full transition-all ease-in-out duration-500`} style={{width: isExpanded ? barPercentage : 0 }}>
									</div>
								</div>
							</li>
						)
					})}
				</ul>
			</div>
		</div>
	)
}
