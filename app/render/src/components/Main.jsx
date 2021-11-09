import React from 'react';
import Diagram from './Diagram';
const Main = (props) =>{

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
			</div>
		</>
	);
};


export default Main;