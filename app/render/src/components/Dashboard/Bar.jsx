import React from 'react';
import { Link } from 'react-router-dom';

const Bar = (props) =>{

  const colors = { JS: '#FFADAD', CSS: '#FFD6A5', SASS: '#FDFFB6', TS: '#CAFFBF',  HTML: '#9BF6FF', VUE: '#A0C4FF', IMG: '#BDB2FF', SVG: '#FFC6FF'};


	return (
			<div className="bar" style={{backgroundColor: `${colors[props.name]}`, width: `${props.weightPercent}%`}}>
				{props.name} : {Math.round(props.weightPercent*100)/100}%
			</div>

	);
};


export default Bar;