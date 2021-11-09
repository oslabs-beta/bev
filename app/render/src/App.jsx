import React, { Component, useState } from "react";
import {
	HashRouter,
	Routes,
	Route
} from 'react-router-dom';
import './stylesheets/style.css';
import Main from './components/Main';
import Diagram from './components/Diagram';
import Diagram2 from './components/Diagram2';
import NavBar from './components/NavBar';

const App = () => {
	const [state, setState] = useState({default: true});


	// let route =  [<><Main /> <button id="trigger" value="" onClick={(e)=>updateState(e)} /></>]

	// if(page.current === 'chart' ){
	// 	route = [<><div><Diagram resultsElements={state}/></div></>];
	// } 

	return (
		<HashRouter>
			<div className='container'>
				<NavBar />
				<Routes>
					<Route path="/" setState={setState} element={<Main />} />
					<Route path="/chart" resultElements={state} element={<Diagram />} />
				</Routes>
			</div>
		</HashRouter>
	);
}


export default App;