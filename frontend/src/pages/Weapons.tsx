import StatCard from "../components/stats/StatCard";
import HitBoxDistribution from "../components/charts/HitBoxDistribution";
import WeaponDonut from "../components/charts/WeaponDonut";

import { useState, useEffect } from 'react';

export default function Weapons() {

	const [isLoading, setIsLoading] = useState(true);
	const [weaponStats, setWeaponStats] = useState(null);

	useEffect(() => {

		async function fetchData() {
			try {

				const [weaponStatsRes] = await Promise.all([
					fetch('http://localhost:8000/stats/weapons')
				]);

				const weaponStatsData = await weaponStatsRes.json();

				setWeaponStats(weaponStatsData);
				setIsLoading(false);

			} catch {

				console.log('Error loading weapon stats...');
				setIsLoading(false);

			}	
		}

		fetchData();

	}, []);

	if (isLoading) {
		return (
			<div>
				Loading...
			</div>
		)
	}

	console.log("Weapon Stats: ", weaponStats)

	const weapon_stats = weaponStats[0];
	weapon_stats.forEach(element => {
		if (element.weapon_name == 'elite') {
			element.weapon_name = 'dual berretas';
		};
	});

	const combined_hs_percentage = weaponStats[1];
	const weapons_by_total_kills = [...weapon_stats].sort((a, b) => b.kills_with_weapon - a.kills_with_weapon);
	const weapons_by_hs_percentage = [...weapon_stats].filter(weapon => weapon.kills_with_weapon >= 10).sort((a, b) => b.hs_percentage - a.hs_percentage);
	const weapons_by_total_dmg = [...weapon_stats].sort((a, b) => b.total_dmg - a.total_dmg);
	const weapons_by_avg_dmg = [...weapon_stats].sort((a, b) => b.avg_dmg - a.avg_dmg);
	const sorted_hitbox_distribution = weaponStats[2];

	console.log('Sorted HB Distribution: ', sorted_hitbox_distribution);
	console.log('Sorted by Total Kills: ', weapons_by_total_kills);

	return (
		<div className="w-full h-full p-4">
			<section id="weapon-stat-card-section" 
				className={`w-full h-fit grid grid-row-1 grid-cols-3 gap-4`}
			>
				<div className="w-full h-fit p-4 tabular-nums bg-cards border border-border rounded-xl">
					<span className="text-text1 text-4xl">
						{weapons_by_total_kills[0].weapon_name.toUpperCase()}
					</span>
					<p className="text-text2">
						Most kills with
					</p>
				</div>
				<div className="w-full h-fit p-4 tabular-nums bg-cards border border-border rounded-xl">
					<span className="text-text1 text-4xl">
						{weapons_by_hs_percentage[0].weapon_name.toUpperCase()}
					</span>
					<p className="text-text2">
						Weapon with highest HS %
					</p>
				</div>	
				<div className="w-full h-fit p-4 tabular-nums bg-cards border border-border rounded-xl">
					<span className="text-text1 text-4xl">
						{combined_hs_percentage.toFixed(2)}%
					</span>
					<p className="text-text2">
						HS % versus last 30 days
					</p>
				</div>
			</section>
			<section id="weapon-stat-charts"
				className={`w-full h-fit grid grid-cols-2 grid-rows-1 gap-4 mt-4`}
			>
				<div>
					<WeaponDonut data={weapons_by_total_kills} />
				</div>
				<div>
					<HitBoxDistribution hitbox_data={sorted_hitbox_distribution} weaponDmg_data={weapons_by_total_dmg}/>
				</div>
			</section>
		</div>
	)
}
