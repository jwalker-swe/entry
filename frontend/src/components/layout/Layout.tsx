import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function Layout() {
	return (
		<>
			<div className='w-full h-full flex justify-start align-center'>
				<Sidebar />
				<div className='w-full h-full flex flex-col justify-start items-center'>
					<Topbar />
					<Outlet />
				</div>
			</div>
		</>
	)
}
