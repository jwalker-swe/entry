import { useState, useEffect } from 'react';

interface DistributionData {
	head: number;
	stomach: number;
	chest: number;
	limbs: number;
}

interface WeaponDmg {
	weapon_data: string;
	dmg_dealt: number;
}

interface WeaponDmgData {
	data: WeaponDmg[]
}

export default function HitBoxDistribution({ hitbox_data, weaponDmg_data }: {hitbox_data: DistributionData, weaponDmg_data: WeaponDmgData}) {

	const sorted_distribution = [];
	for (const [key, value] of Object.entries(hitbox_data)) {

		const capitalized = key.charAt(0).toUpperCase() + key.slice(1);

		const weapon_data = {
			hit_group: capitalized,
			hit_value: value,
		}

		sorted_distribution.push(weapon_data)
	}

	sorted_distribution.sort((a, b) => b.hit_value - a.hit_value);

	console.log('Sorted Distribution: ', sorted_distribution)

	return (
		<div className={`w-full h-full bg-cards border-1 border-border rounded-2xl p-4`}>
			<p className="text-text3 text-lg font-semibold mb-4">
				HITBOX DISTRIBUTION
			</p>
			<ul className='w-full h-fit grid grid-cols-4 grid-rows-1 gap-4'>
				{sorted_distribution.map((map, index) => {

					const textColor = index == 0 ? 'text-teal' : index == sorted_distribution.length - 1 ? 'text-red' : 'text-text1';

					return (
						<li key={index} className='flex flex-col w-full h-full justify-center items-center gap-1 bg-void border border-border rounded-2xl p-4'>
							<span className={`text-4xl ${textColor} font-semibold tabular-nums`}>{map.hit_value}%</span>
							<span className='text-xl text-text3'>{map.hit_group}</span>
						</li>
					)
				})}
			</ul>
			<hr className={`my-4 text-border`} />
			<p className='text-text3 text-lg font-semibold mb-4'>
				DAMAGE BY WEAPON
			</p>
			<ul className='w-full h-fit flex flex-col gap-2'>
				{weaponDmg_data.slice(0, 5).map((map, index) => {
					const barWidth = (map.total_dmg / weaponDmg_data[0].total_dmg) * 100;
					const barWidthPercent = String(barWidth) + '%';

					const barColor = index == 0 ? 'bg-cobalt' : index == 1 ? 'bg-teal' : index == 2 ? 'bg-amber' : index == 3 ? 'bg-lavender' : 'bg-text3';

					return (
						<li key={index} className={`
							w-full h-fit flex justify-between items-center
						`}>
							<span className={`
								text-text2 w-40	
							`}>
								{map.weapon_name.toUpperCase()}
							</span>	
							<div className='flex grow h-2 bg-void rounded-full'>
								<div className={`${barColor} h-full rounded-full`} style={{ width: barWidthPercent }}>
								</div>
							</div>
							<span className={`text-text1 text-lg w-fit min-w-20 text-right tabular-nums`}>
								{map.total_dmg}
							</span>
						</li>
					)
				})}
			</ul>
		</div>
	)
}
