import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Loading from './Loading';

const Main = (props) =>{

	const [renderLoader, setRenderLoader] = useState(false);
	const updateState = (e) => {
		// Access json generated
		console.log('e.target.value', JSON.parse(e.target.value))
		console.log('bundleResults', JSON.parse(e.target.value).bundleResults)
		props.setState(JSON.parse(e.target.value).dependencyResults);
		props.setBundleInfo(JSON.parse(e.target.value).bundleResults);
		
	};

	return (
		<>
			<div className="container" data-testid="container">
				<div id='uploader' className='app__uploader'>
					<div className='uploader__button-area'>
							<button className='uploader__button' id='uploader-button' data-testid='uploader-button'>Click To Add Folders</button>
							<p><i>(Make sure the uploaded projects contain a webpack config file in their root directories!)</i></p>
					</div>
				</div>
				<div id='folderlist' className='folders' data-testid='folder-list'></div>
				<div id='analyze-button'> </div>
				<button id='create-project' >Start Project</button>
				<div id='submit-button-div'>
					<input type='hidden' id='loading' onClick={()=>setRenderLoader(true)} />
					<Link to="/controlpanel">
						<input type="hidden" id="start-project" value="" data-testid='trigger-event' onClick={(e) => {updateState(e); }} />
					</Link>
				</div>
				{(renderLoader) ? (<Loading bundleInfo={props.bundleInfo} /> ) : (<> </>) }
			</div>
		</>
	);
};

export default Main;