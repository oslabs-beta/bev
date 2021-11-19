import React from 'react';
import Bar from './Bar';
import MFESelector from './MFESelector';

const PercentBar = (props) =>{

  const bars = [];
	const totalWeight = props.mfe.sizes.total;
	for(let key in props.mfe.sizes){
    if(key!='total') bars.push(<Bar name={key} key={key} weightPercent={props.mfe.sizes[key]*100/totalWeight}/>);

  }

	let displayMFESelector = '';
	if(props.bundleInfo.length > 1) displayMFESelector = <MFESelector setMFE={props.setMFE} bundleInfo={props.bundleInfo} />;


	return (
		<div className ="totalsize-card">
			{displayMFESelector}
			<h3> TOTAL SIZE BY TYPE</h3>
			<div className="percent-bar">
				{bars}
			</div>
		</div>
	);
};


export default PercentBar;