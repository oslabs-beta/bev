import React from 'react';
import Bar from './Bar';
import MFESelector from './MFESelector';

const PercentBar = (props) =>{

  const bars = [];
	const totalWeight = props.weights.total;
	for(let key in props.weights){
    if(key!='total') bars.push(<Bar name={key} key={key} weightPercent={props.weights[key]*100/totalWeight}/>);

  }



	return (
		<div className ="totalsize-card">
			<MFESelector setMFE={props.setMFE} bundleInfo={props.bundleInfo} />
			<h3> TOTAL SIZE BY TYPE</h3>
			<div className="percent-bar">
				{bars}
			</div>
		</div>
	);
};


export default PercentBar;