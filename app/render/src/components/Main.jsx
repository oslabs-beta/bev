import React from 'react';
import { Link } from 'react-router-dom';

const Main = (props) =>{

	const updateState = (e) => {
		// Access json generated
		console.log('e.target.value', JSON.parse(e.target.value))
		console.log('bundleResults', JSON.parse(e.target.value).bundleResults)
		props.setState(JSON.parse(e.target.value).dependencyResults);
		props.setBundleInfo(JSON.parse(e.target.value).bundleResults);
		// props.setState(e.target.value['dependencyResults']);
		// props.setBundleInfo(e.target.value['bundleResults']);
		
	};


	return (
		<>
			<div className="container">
				<div id='uploader' className='app__uploader'>
					<div className='uploader__button-area'>
							<button className='uploader__button' id='uploader-button'>Click To Add Folders</button>
					</div>
				</div>
				<div id='folderlist' className='folders'></div>
				<div id='analyze-button'></div>
				<div id='submit-button-div'>
					{/* <input type='hidden' id='trigger' ref={results} value='' /> */}
					{/* <Link to="/controlpanel"> */}
					<Link to="/loading">
						<input type="hidden" id="start-project" value="" onClick={(e) => updateState(e)} />
					</Link>
				</div>
			</div>
		</>
	);
};


export default Main;