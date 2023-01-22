import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/home';
import FromPiano from './pages/from_piano';
import ReactDOM from 'react-dom'
import Nav from './components/nav';


export default function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path='/' element={<Nav/>}>
					<Route index element={<Home />} />
					<Route path='/from-piano' element = {<FromPiano/>}/>
				</Route>
			</Routes>
		</BrowserRouter>
	)
}
ReactDOM.render(<App />, document.getElementById('root'))