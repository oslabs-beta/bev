import React from 'react';

const Main = (props) =>{

	return <div className="container">
			<div id='uploader' className='app__uploader'>
				<div class='uploader__icon-area'>
						<img src='../assets/upload.svg' className='uploader__icon' />
						<p className='uploader__area__text'>Drag file(s) to add</p>
				</div>
				<div className='uploader__button-area'>
						<button className='uploader__button' id='uploader-button'>Click To Add Files</button>
				</div>
			</div>
			<div id='svg-display'></div>
			<div id='folderlist' className='folders'></div>
		</div>;
};


export default Main;