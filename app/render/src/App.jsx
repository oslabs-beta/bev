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
import ControlPanel from './components/ControlPanel';

/*
Implemented react-router based on react-router v6 which introduced braking changes
*/
const App = () => {
	const [state, setState] = useState({default: true});
	const [bundleInfo, setBundleInfo] = useState({}); 
	const [initialDiagramLoad, setInitialDiagramLoad] = useState(false);
	return (
		<HashRouter>
			<div className="main-container">
				<div className="top-container"><NavBar setInitialDiagramLoad={setInitialDiagramLoad}/></div>
				<Routes>
					<Route path="/" element={<Main setState={setState} setBundleInfo={setBundleInfo} />} />
					{console.log('state', state)}
					{console.log('initialDiagramLoad', initialDiagramLoad)}
					{/* 
					/chart is being passed a component Diagram which is being passed resultsElement as the property;
					resultsElement contains the results.json file that we use to generate the graph
					 */}
<<<<<<< HEAD
					<Route path="/controlpanel" element={<ControlPanel initialDiagramLoad={initialDiagramLoad} setInitialDiagramLoad={setInitialDiagramLoad} resultElements={state} />} />
					{/* <Route path="/chart" element={<Diagram initialDiagramLoad={initialDiagramLoad} setInitialDiagramLoad={setInitialDiagramLoad} resultElements={state} />} /> */}
=======
					<Route path="/chart" element={<Diagram initialDiagramLoad={initialDiagramLoad} setInitialDiagramLoad={setInitialDiagramLoad} bundleInfo={bundleInfo}  resultElements={state} />} />
>>>>>>> 51913b05d2750f3feab5ccbd9d77d2c5d13c605e
				</Routes>
			</div>
		</HashRouter>
	);
}


export default App;