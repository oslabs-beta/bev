import React from 'react';
import Bar from './Bar';

const PercentBar = (props) =>{

  const bars = [];
	const totalWeight = props.weights.total;
	for(let key in props.weights){
    if(key!='total') bars.push(<Bar name={key} key={key} weightPercent={props.weights[key]*100/totalWeight}/>);

  }



	return (
		<div className ="totalsize-card">
			<h3> TOTAL SIZE BY TYPE</h3>
			<div className="percent-bar">
				{bars}
			</div>
		</div>
	);
};


export default PercentBar;