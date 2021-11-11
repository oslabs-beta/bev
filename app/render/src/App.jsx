import React, { Component, useState } from "react";
import {
	HashRouter,
	Routes,
	Route
} from 'react-router-dom';
import './stylesheets/style.css';
import Main from './components/Main';
import Diagram from './components/Diagram';
import NavBar from './components/NavBar';

/*
Implemented react-router based on react-router v6 which introduced braking changes
*/
const App = () => {
	const [state, setState] = useState({default: true});

	return (
		<HashRouter>
			<div >
				<NavBar />
				<Routes>
					<Route path="/" element={<Main setState={setState} />} />
					{/* 
					/chart is being passed a component Diagram which is being passed resultsElement as the property;
					resultsElement contains the results.json file that we use to generate the graph
					 */}
					<Route path="/chart" element={<Diagram resultElements={state} />} />
				</Routes>
			</div>
		</HashRouter>
	);
}


export default App;