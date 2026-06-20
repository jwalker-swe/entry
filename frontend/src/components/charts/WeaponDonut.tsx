import { PieChart, Pie, Cell, Tooltip } from "recharts";
import { IconPointFilled } from "@tabler/icons-react";

const PALETTE_COLORS = [
	"#378ADD",
	"#1D9E75",
	"#EF9F27",
	"#7F77DD",
	"#475569",
]

type WeaponKillData = {
	weapon_name: string;
	kills_with_weapon: number;
}

export default function WeaponDonut({ data }: { data: WeaponKillData[] }) {

	let other_kills = 0;
	let total_kills = 0;

	const most_used_weapons = data.slice(0, 4);
	const uncommon_weapons = data.slice(4, data.length);

	uncommon_weapons.forEach((weapon, index) => {
		other_kills += weapon.kills_with_weapon;
	});

	const other = {
		weapon_name: 'other',
		kills_with_weapon: other_kills,
	}

	const weapons_for_chart = most_used_weapons;
	weapons_for_chart.push(other);

	const donutData = weapons_for_chart.map((item, index) => ({
		weapon: item.weapon_name,
		kills: item.kills_with_weapon,
		fill: PALETTE_COLORS[index % PALETTE_COLORS.length]
	}));

	console.log("Weapons for chart: ", weapons_for_chart);

	donutData.forEach((item, index) => {
		total_kills += item.kills;
	})

	return (
		<div className={`w-full h-full bg-cards border-1 border-border rounded-2xl p-4`}>
			<p className="text-text3 text-lg font-semibold mb-4">
				KILLS BY WEAPON
			</p>
			<div className="w-full h-fit flex justify-start items-center py-8">
				<PieChart width={300} height={240}>
					<Pie
						data={donutData}
						dataKey="kills"
						nameKey="weapon"
						cx="50%"
						cy="50%"
						innerRadius={50}
						outerRadius={120}
					/>
					<Tooltip contentStyle={{ background: "#111A22", border: "1px solid #1a2535"}} />
				</PieChart>
				<ul className="grow h-fit">
					{ donutData.map((item, index) => {
						return (
							<li key={index} className="w-full h-fit">
								<div className={`w-full h-fit flex justify-start items-center`}>
									<IconPointFilled fill={`${item.fill}`} className="flex-none"/>
									<span className={`text-text2 flex-none`}>
										{item.weapon.toUpperCase()}
									</span>
									<span className="text-text2 grow text-right">
										{((item.kills/total_kills) * 100).toFixed(2)}%
									</span>
								</div>
							</li>
						)
					})}
				</ul>
			</div>
		</div>
	)
}
