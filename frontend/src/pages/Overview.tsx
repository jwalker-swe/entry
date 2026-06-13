import StatCard from "../components/stats/StatCard";
import AdrTrendChart from "../components/charts/AdrTrendChart";
import WinRateChart from "../components/charts/WinRateChart";
import { useState, useEffect } from 'react';

export default function Overview() {

	const [stats, setStats] = useState(null)
	const [matches, setMatches] = useState(null)
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {

		async function fetchData() {
			try {
				
				const [summaryRes, matchesRes] = await Promise.all([
					fetch('http://localhost:8000/stats/summary'),
					fetch('http://localhost:8000/stats/matches'),
				])

				const summaryData = await summaryRes.json()
				const matchesData = await matchesRes.json()

				setStats(summaryData)
				setMatches(matchesData)
				setIsLoading(false)

			} catch {

				console.log('Error loading stats...')
				setIsLoading(false)

			}
		}

		fetchData()

	}, [])

	if (isLoading) {
		return (
			<div>
				Loading...
			</div>
		)
	}

	console.log('Stats: ', stats)
	console.log('Matches: ', matches)

	return (
		<div className="w-full h-full p-4">
			<section id="overview-section-statcards"
				className={`w-full h-fit grid grid-row-1 grid-cols-4 gap-4`}
			>
				<StatCard label="K/D ratio" value={stats?.kd} delta={stats?.kd_delta} compare_against={stats?.compare_against_last}/>
				<StatCard label="Headshot %" value={stats?.hsPercentage} delta={stats?.hsPercentage_delta} compare_against={stats?.compare_against_last} unit="%" />
				<StatCard label="ADR" value={stats?.adr} delta={stats?.adr_delta} compare_against={stats?.compare_against_last} />
				<StatCard label="KAST" value={stats?.ast} delta={stats?.ast_delta} compare_against={stats?.compare_against_last} unit="%" />
			</section>
			<section id="overview-section-graphs"
				className="w-full h-100 grid grid-row-1 grid-cols-2 gap-4 mt-4"
			>
				<div className="w-full h-full">
					<AdrTrendChart matches={matches} compare={stats?.compare_against_last}/>	
				</div>
				<div className="w-full h-full">
				</div>
			</section>
		</div>
	)
}
