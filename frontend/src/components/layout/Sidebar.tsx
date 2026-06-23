import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { IconSettingsFilled, IconFlameFilled, IconLayoutListFilled, IconMapPinFilled, IconCurrentLocationFilled } from '@tabler/icons-react';

export default function Sidebar() {

	const [active, setActive] = useState('Overview');
	const currentLocation = useLocation();

	return(
		<>
			<div className="w-20 h-full bg-elevated border-1 border-border">
				<div className="w-full h-full flex flex-col justify-between items-center">
					<nav className='w-full h-full flex flex-col justify-between items-center'>
						<ul className="w-full h-full flex flex-col justify-start items-center mt-4">
							<li id='sidebar-logo-icon'>
								<NavLink to={'/'}> 
									<div className={`sidebar-icon w-12 h-12 rounded-md bg-navy`}>
									</div>
								</NavLink>
							</li>
							<li id='sidebar-overview-icon'>
								<NavLink to={'/'}>
									<div className={`flex justify-center items-center sidebar-icon w-12 h-12 rounded-md mt-8 hover:cursor-pointer hover:bg-navy transition-all ease-in-out duration-300 ${currentLocation.pathname=='/' ? 'bg-active' : 'bg-elevated'}`}>
										<IconLayoutListFilled size={24} stroke={1} className={`text-text2`}/>
									</div>
								</NavLink>
							</li>
							<li id='sidebar-maps-icon'>
								<NavLink to={'/maps'}> 
									<div className={`flex justify-center items-center sidebar-icon w-12 h-12 rounded-md mt-2 hover:cursor-pointer hover:bg-navy transition-all ease-in-out duration-300 ${currentLocation.pathname=='/maps' ? 'bg-active' : 'bg-elevated'}`}>
										<IconMapPinFilled size={24} stroke={1} className={`mx-auto text-text2`}/>
									</div>
								</NavLink>
							</li>
							<li id='sidebar-heatmaps-icon' className='hidden'>
								<NavLink to={'/heatmaps'}> 
									<div className={`flex justify-center items-center sidebar-icon w-12 h-12 rounded-md mt-2 hover:cursor-pointer hover:bg-navy transition-all ease-in-out duration-300 ${currentLocation.pathname=='/heatmaps' ? 'bg-active' : 'bg-elevated'}`}>
										<IconFlameFilled size={24} stroke={1} className={`mx-auto text-text2`}/>
									</div>
								</NavLink>
							</li>
							<li id='sidebar-weapons-icon'>
								<NavLink to={'/weapons'}> 
									<div className={`flex justify-center items-center sidebar-icon w-12 h-12 rounded-md mt-2 hover:cursor-pointer hover:bg-navy transition-all ease-in-out duration-300 ${currentLocation.pathname=='/weapons' ? 'bg-active' : 'bg-elevated'}`}>
										<IconCurrentLocationFilled size={24} stroke={1} className={`mx-auto text-text2`} />
									</div>
								</NavLink>
							</li>
						</ul>
					</nav>
					<button id='sidebar-settings-icon' 
						className={`side-bar-icon w-12 h-12 rounded-md mb-4 hover:cursor-pointer hover:bg-navy transition-all ease-in-out duration-300 ${currentLocation.pathname=='/settings' ? 'bg-active' : 'bg-elevated'}`}
						onClick={() => setActive('Settings')}
					>
						<IconSettingsFilled size={24} stroke={1} className={`mx-auto text-text2`}/>
					</button>
				</div>
			</div>
		</>
	)
}
