import React from 'react';
import { Link } from 'react-router-dom';
import Diagram from './Diagram';
const Main = (props) =>{
	const results = React.createRef();
	console.log('props from Main.jsx', props)

	const updateState = (e) => {
		// Access `results.json`
		console.log('RESULTS = ', e.target.value);
		props.setState(JSON.parse(e.target.value));
	};

	return (
		<>
			<div className="container">
				<div id='uploader' className='app__uploader'>
					<div className='uploader__button-area'>
							<button className='uploader__button' id='uploader-button'>Click To Add Folders</button>
					</div>
				</div>
				<div id='svg-display'></div>
				<div id='folderlist' className='folders'></div>
				<div id='analyze-button'></div>
				<div id='submit-button-div'>
					{/* <input type='hidden' id='trigger' ref={results} value='' /> */}
					<Link to="/chart">
						<button id="trigger" ref={results} value="" onClick={(e) => updateState(e)}>Submit</button>
					</Link>
				</div>
			</div>
		</>
	);
};


export default Main;