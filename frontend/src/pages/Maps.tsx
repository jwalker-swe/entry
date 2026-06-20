import { useState, useEffect } from 'react';
import MapPerformance from '../components/stats/MapPerformance';

export default function Maps() {

	const [isLoading, setIsLoading]	= useState(true);
	const [matchStats, setMatchStats] = useState(null);

	// Fetch data for matchStats 
	useEffect(() => {

		async function fetchData() {

			try {
					
				const [matchStatsRes] = await Promise.all([
					fetch('http://localhost:8000/stats/maps')
				]);

				const matchStatsData = await matchStatsRes.json();
				setMatchStats(matchStatsData);
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
		</div>
	)
}
