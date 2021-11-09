import React, { Component, useState } from "react";
import './stylesheets/style.css';
import Main from './components/Main';
import Diagram from './components/Diagram';
import Diagram2 from './components/Diagram2';
import NavBar from './components/NavBar';

const App = () => {
	const [state, setState] = useState({default: true});
	const [page , setPage] = useState({current: 'home'})

	const updateState = (e) => {
		// Access `results.json`
		console.log('RESULTS = ', e.target.value);
		setState(JSON.parse(e.target.value));
		setPage({current: 'chart'});
	};	


	let route =  [<><Main /> <button id="trigger" value="" onClick={(e)=>updateState(e)} /></>]

	if(page.current === 'chart' ){
		route = [<><div><Diagram resultsElements={state}/></div></>];
	} 

	return (
		<div className='container'>
			<NavBar page={page} setPage={setPage} />
			{route}
		</div>
	);
}


export default App;