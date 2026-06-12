import { BarChart, Bar, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"

interface Match {
	adr: number,
	map_name: string
}

interface AdrTrendChartProps {
	matches: Match[];
	compare: number;
}

export default function AdrTrendChart({ matches, compare }: AdrTrendChartProps) {

	const CustomTooltip = ({ active, payload, label }: any) => {
		if (active && payload && payload.length) {
			return (
				<div className="bg-surface border border-border p-2 rounded-md shadow-lg">
					<p className="text-text2 text-xs font-mono mb-1">{label}</p>
					<p className="text-text1 text-sm font-medium">
						ADR: <span className="text-teal">{payload[0].value}</span>
					</p>
				</div>
			);
		}
		return null;
	}

	const adrs = matches.map(m => m.adr);
	const maxAdr = Math.min(...adrs);
	const minAdr = Math.min(...adrs);


	const renderBarShape = (props: any) => {
		const {x, y, width, height, payload } = props;
		const adr = payload.adr;

		let fill = "var(--color-blue)";
		let opacity = 0.75;

		if (adr === maxAdr) {
			fill = "var(--color-teal)";
			opacity = 1;
		} else if (adr === minAdr) {
			fill = "var(--color-red)";
		}

		return (
			<rect 
				x={x} 
				y={y}
				width={width}
				height={height}
				fill={fill}
				fillOpacity={opacity}
				rx={3}
				ry={3}
			/>
		);
	};


	return (
		<div className="w-full h-full p-4 bg-cards border-1 border-border rounded-lg">
			<p>ADR Last {compare} Games </p>
			<ResponsiveContainer>
				<BarChart data={matches} margin={{ top: 4, right: 0, left: -20, bottom: 0 }}>
					<XAxis 
						dataKey="map_name"
						tick={{ fill: "var(--color-text3)", fontSize: 10, fontFamily: "monospace" }}
						axisLine={false}
						tickLine={false}
					/>
					<YAxis 
						tick={{ fill: "var(--color-text3)", fontSize: 10, fontFamily: "monospace" }}
						axisLine={false}
						tickLine={false}
					/>
					<Tooltip content={<CustomTooltip />} cursor={{ fill: "var(--color-border)", opacity: 0.2 }} />
					<Bar dataKey="adr" shape={renderBarShape} />
				</BarChart>
			</ResponsiveContainer>
		</div>
	)

}
