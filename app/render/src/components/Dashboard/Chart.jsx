import React from 'react';
import CakeChart from 'cake-chart';

const Chart = (props) =>{

 

	return (
			<CakeChart data={props.data} />

	);
};


export default Chart;