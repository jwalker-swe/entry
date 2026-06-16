import { IconArrowBigUpLineFilled, IconArrowBigDownLineFilled, IconMinus } from '@tabler/icons-react'

interface StatCardProps {
	label: string;
	value: string | number;
	delta?: number;
	compare_against?: number;
	unit?: string;
	icon?: React.ReactNode;
}

export default function StatCard({ label, value, delta, compare_against, unit, icon }: StatCardProps) {

	console.log("Delta: ", delta)

	return (
		<>
			<div className="w-full h-fit bg-cards border-1 border-border rounded-md p-4 tabular-nums">
				{ delta > 0 ? (
					<p className="text-green-500 text-4xl font-bold tabular-nums">
						{value}{unit && <span className="ml-1 tabular-nums">{unit}</span>}
					</p>
				) : delta < 0 ? (
					<p className="text-red-500 text-4xl font-bold tabular-nums">
						{value}{unit && <span className="ml-1 tabular-nums">{unit}</span>}
					</p>
				) : (
					<p className="text-gray-500 text-4xl font-bold tabular-nums">
						{value}{unit && <span className="ml-1 tabular-nums">{unit}</span>}
					</p>
				)}
				<p className="text-text2 text-md">
					{label}
				</p>
				<p className="text-text2 text-sm tabular-nums">	
					{delta > 0 ? (
						<span className="text-green-500 flex justify-start items-center gap-2">
							<IconArrowBigUpLineFilled size={16}	/> +{delta} {unit} vs last {compare_against}
						</span>
					) : delta < 0 ? (
						<span className='text-red-500 flex justify-start items-center gap-2'>
							<IconArrowBigDownLineFilled size={16} /> {delta} {unit} vs last {compare_against}
						</span>
					) : (
						<span className='text-gray-500 flex justify-start items-center gap-2'>
							<IconMinus size={16} />
						</span>
					)}
				</p>
			</div>	
		</>
	)
}
