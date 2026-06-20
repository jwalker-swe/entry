import { useState, useEffect } from 'react';

export default function Maps() {

	const [isLoading, setIsLoading]	= useState(true);
	const [matchStats, setMatchStats] = useState(null);

	// Fetch data for matchStats 
	useEffect(() => {

		try {

			const [matchStatsRes] = await Promise.all([
				fetch('http://localhost:8000/stats/maps')
			]);

			const matchStatsData = matchStatsRes.json();
			setMatchStats(matchStatsData);

		} catch {

			console.log('Error loading data...');
			setisLoading(false);

		}

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
		</div>
