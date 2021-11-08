import React, { Component, useState } from "react";
import './stylesheets/style.css';
import Main from './components/Main';
import Diagram from './components/Diagram';

const App = () => {
	const [state, setState] = useState({});

	
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