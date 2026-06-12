import StatCard from "../components/stats/StatCard";
import { useState, useEffect } from 'react';

export default function Overview() {

	const [stats, setStats] = useState(null)
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		fetch('http://localhost:8000/stats/summary')
			.then(res  => res.json())
			.then(data => {
				setStats(data)		
				setIsLoading(false)
			})
	}, [])

	if (isLoading) {
		return (
			<div>
				Loading...
			</div>
		)
	}

	console.log('Stats: ', stats)

	return (
		<div className="w-full h-full p-4">
			<section id="overview-section-statcards"
				className={`w-full h-full grid grid-row-1 grid-cols-4 gap-4`}
			>
				<StatCard label="K/D ratio" value={stats?.kd} delta={stats?.kd_delta} compare_against={stats?.compare_against_last}/>
				<StatCard label="Headshot %" value={stats?.hsPercentage} delta={stats?.hsPercentage_delta} compare_against={stats?.compare_against_last} unit="%" />
				<StatCard label="ADR" value={stats?.adr} delta={stats?.adr_delta} compare_against={stats?.compare_against_last} />
				<StatCard label="KAST" value={stats?.ast} delta={stats?.ast_delta} compare_against={stats?.compare_against_last} unit="%" />
			</section>
		</div>
	)
}
