import { IconPointFilled } from '@tabler/icons-react';
import { IconArrowBigRightLinesFilled } from '@tabler/icons-react';
import { IconArrowMoveRightFilled } from '@tabler/icons-react';
import OutcomePill from './OutcomePill';
 

interface KillEvent {
	id: number,
	match_id: number,
	demo_id: number,
	map_name: string,
	round_num: number,
	attacker_name: string,
	attacked_name: string,
	assister_name: string,
	attacker_team_name: string,
	attacked_team_name: string,
	assister_team_name: string,
	attacker_x: number,
	attacker_y: number,
	attacker_z: number,
	attacked_x: number,
	attacked_y: number,
	attacked_z: number,
	assister_x: number,
	assister_y: number,
	assister_z: number,
	attacker_last_place_name: string,
	attacked_last_place_name: string,
	assister_last_place_name: string,
	weapon_used: string,
	kill_distance: number,
	headshot: number,
	hit_group: string,
	dmg_dealt: number,
	dmg_received: number,
	tick: number,
	FOREIGN KEY (match_id) REFERENCES matches(id)
}


interface KillFeedRowProps {
	attacker: string,
	attacked: string,
	statusColor: string,
	headshot: boolean,
	hitGroup: string,
	weapon: string
}

export default function KillFeedRow({ attacker, attacked, statusColor, headshot, hitGroup, weapon }: KillFeedRowProps) {

	const attacker_color = attacker == 'You' ? 'text-text2' : 'text-text3';
	const attacker_bg_color = attacker == 'You' ? 'bg-text2' : 'bg-text3';
	const basePath = '/weapon_icons/svg_normal/';		
	const imgPath = basePath + weapon + '.svg';
	const hit = headshot ? 'headshot' : hitGroup;

	return (
		<div
			className={`
				w-full h-full flex justify-between items-center border-b-1 border-border py-2
			`}	
		>
			<div
				className={`
					w-full h-full flex jusfity-start items-center gap-1
				`}
			>
				<IconPointFilled className={`${statusColor}`} />
				<span className={`${attacker_color} font-semibold`}>
					{attacker}
				</span>
				<div
					className={`mx-2 ${attacker_bg_color} w-26 h-7.75`}
					style={{
						maskImage: `url(${imgPath})`,
						maskRepeat: 'no-repeat',
						maskPosition: 'center',
						maskSize: 'contain',
						WebkitMaskImage: `url(${imgPath})`,
						WebkitMaskRepeat: `no-repeat`,
						WebkitmaskPosition: 'center',
						WebkitMaskSize: 'contain'
					}}
				>
				</div>
				<span className={`${attacker_color}`}>
					{attacked}
				</span>
			</div>
			<div
				className={`w-fit h-full`}
			>
				<OutcomePill statusColor={statusColor} hitGroup={hit} />	
			</div>
		</div>
	)
}
