import React from 'react';
import { Link } from 'react-router-dom';

const Bar = (props) =>{

  const colors = { js: '#ffadad', css: '#ffd6a5', sass: '#fdffb6', ts: '#caffbf',  html: '#9bf6ff', vue: '#a0c4ff', img: '#bdb2ff', svg: '#ffc6ff', jpg: '#bdb2ff', jpeg: '#bdb2ff', png: '#bdb2ff', gif: '#bdb2ff'};


	return (
			(props.name in colors) ? (
				<div className="bar" style={{backgroundColor: `${colors[props.name]}`, width: `${props.weightPercent}%`}}>
					{props.name} : {Math.round(props.weightPercent*100)/100}%
				</div>
			) : (
				<div className="bar" style={{backgroundColor: `#ff69b4`, width: `${props.weightPercent}%`}}>
					other : {Math.round(props.weightPercent*100)/100}%
				</div>
			)

	);
};


export default Bar;