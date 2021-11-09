import React, { Component, useState } from "react";
import './stylesheets/style.css';
import Main from './components/Main';
import Diagram from './components/Diagram';
import Diagram2 from './components/Diagram2';

const App = () => {
	const [state, setState] = useState({default: true, modules: [{source:1, dependencies: [{b:2}]}]});

	
	const updateState = (e) => {
		// Access `results.json`
		console.log('RESULTS = ', e.target.value);
		setState(JSON.parse(e.target.value));
	};	


	return (
		<div className='container'>
			<nav>
				<ul className='title'>BEV</ul>
			</nav>

			<Main />
			<button id="trigger" value="" onClick={(e)=>updateState(e)} />
			<div>
				<Diagram resultsElements={state}/>
			</div>
		</div>
	);
}


export default App;