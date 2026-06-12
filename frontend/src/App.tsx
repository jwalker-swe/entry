import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from './components/layout/Layout';
import Overview from './pages/Overview';
import Maps from './pages/Maps';
import Heatmaps from './pages/Heatmaps';
import Weapons from './pages/Weapons';

function App() {
  return(
	<div className='w-screen h-screen bg-void overflow-hidden'>
		<BrowserRouter>
			<Routes>
				<Route path='/' element={<Layout />}>
					<Route index element={<Overview />} />
					<Route path='maps' element={<Maps />} />
					<Route path='heatmaps' element={<Heatmaps />} />
					<Route path='weapons' element={<Weapons />} />
				</Route>
			</Routes>
		</BrowserRouter>
	</div>
  )
}

export default App
