import React, { useState } from 'react';
import Dashboard from './Dashboard/Dashboard';
import Diagram from './Diagram';
import BundleHistory from './BundleHistory';

const Display = (props) =>{
	console.log('props BUNDLEINFO : ', props.bundleInfo);
  const [mfe, setMFE] = useState(props.bundleInfo[0])


  let displayTab = <Dashboard bundleInfo={props.bundleInfo} mfe={mfe} setMFE={setMFE} />;
  if(props.tab === 'dashboard'){
    displayTab = <Dashboard bundleInfo={props.bundleInfo} mfe={mfe} setMFE={setMFE}/>;
  }
  else if(props.tab == 'tree'){
    displayTab = <Diagram initialDiagramLoad={props.initialDiagramLoad} setInitialDiagramLoad={props.setInitialDiagramLoad} resultElements={props.resultElements}  />;
  }
	else if(props.tab === 'history'){
    displayTab = <BundleHistory bundleHistory={props.bundleHistory} setBH={props.setBH}/>;
  }

	return (
			<div id="display">
      {displayTab}
			</div>
	);
};


export default Display;