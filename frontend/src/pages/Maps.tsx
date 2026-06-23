import { useState, useEffect } from 'react';
import MapPerformance from '../components/stats/MapPerformance';
import MatchHistory from '../components/charts/MatchHistory';

export default function Maps() {

	const [isLoading, setIsLoading]	= useState(true);
	const [matchStats, setMatchStats] = useState(null);
	const [matchHistory, setMatchHistory] = useState(null);

	// Fetch data for matchStats 
	useEffect(() => {

		async function fetchData() {

			try {
					
				const [matchStatsRes, matchHistoryRes] = await Promise.all([
					fetch('http://localhost:8000/stats/maps'),
					fetch('http://localhost:8000/stats/match-history')
				]);

				const matchStatsData = await matchStatsRes.json();
				const matchHistoryData = await matchHistoryRes.json();

				setMatchStats(matchStatsData);
				setMatchHistory(matchHistoryData)
				setIsLoading(false);

			} catch {

				console.log('Error loading data...');
				setIsLoading(false);

			};
		};

		fetchData();

	}, [])

	if (isLoading) {
		return (
			<div>
				Loading...
			</div>
		)
	}

	return (
		<div className='w-full h-full p-4'>
			<p className='text-text3'>
				MAP PERFORMANCE 
			</p> 
			<MapPerformance data={matchStats} />
			<MatchHistory data={matchHistory} />
		</div>
	)
}
