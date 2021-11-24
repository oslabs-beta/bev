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
import Loading from './components/Loading';
// import ReactBootstrap from 'react-bootstrap';
// import Vue from 'vue';

/*
Implemented react-router based on react-router v6 which introduced braking changes
*/
const App = () => {
	const [state, setState] = useState({default: true});
	const [bundleHistory, setBH] = useState([])
	const [bundleInfo, setBundleInfo] = useState([]); 
	const [initialDiagramLoad, setInitialDiagramLoad] = useState(false);
	return (
		<HashRouter>
			<div className="main-container">
				<div className="top-container"><NavBar setInitialDiagramLoad={setInitialDiagramLoad}/></div>
				<Routes>
					<Route path="/" element={<Main setState={setState} bundleHistory={bundleHistory} setBH={setBH} bundleInfo={bundleInfo} setBundleInfo={setBundleInfo} />} />
					<Route path="/loading" element={<Loading bundleInfo={bundleInfo} initialDiagramLoad={initialDiagramLoad} setInitialDiagramLoad={setInitialDiagramLoad} bundleInfo={bundleInfo}  resultElements={state}/>} />
					<Route path="/controlpanel" element={<ControlPanel initialDiagramLoad={initialDiagramLoad} setBH={setBH} bundleHistory={bundleHistory} setInitialDiagramLoad={setInitialDiagramLoad} bundleInfo={bundleInfo}  resultElements={state} />} />
				</Routes>
			</div>
		</HashRouter>
	);
}


export default App;