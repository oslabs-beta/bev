import React, { useState } from 'react';
import Dashboard from './Dashboard/Dashboard';
import Diagram from './Diagram';

const Display = (props) =>{

  const [mfe, setMFE] = useState(props.bundleInfo[0])


  let displayTab = <Dashboard bundleInfo={props.bundleInfo} mfe={mfe} setMFE={setMFE} />;
  if(props.tab === 'dashboard'){
    displayTab = <Dashboard bundleInfo={props.bundleInfo} mfe={mfe} setMFE={setMFE}/>;
  }
  else if(props.tab == 'tree'){
    displayTab = <Diagram initialDiagramLoad={props.initialDiagramLoad} setInitialDiagramLoad={props.setInitialDiagramLoad} resultElements={props.resultElements}  />;
  }

	return (
			<div id="display">
      {displayTab}
			</div>
	);
};


export default Display;