interface OutcomePillProps {
	statusColor: string,
	hitGroup: number
}

export default function OutcomePill({ statusColor, hitGroup }: OutcomePillProps) {

	const borderColor = statusColor === 'text-teal' ? 'border-teal/10' : statusColor === 'text-red' ? 'border-red/10' : 'border-border/10';
	const bgColor = statusColor === 'text-teal' ? 'bg-teal/10' : statusColor === 'text-red' ? 'bg-red/10' : 'bg-border/10';

	return (	
		<div className={`w-full ${borderColor} border-1 rounded-full`}>
			<div
				className={`w-full ${statusColor} border-1 px-2 ${bgColor} rounded-full`}
			>
				<p className={`text-sm ${statusColor} opacity-100`}>
					{hitGroup}
				</p>
			</div>
		</div>
	)
}
