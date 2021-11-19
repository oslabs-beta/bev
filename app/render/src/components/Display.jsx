import React from 'react';
import Dashboard from './Dashboard/Dashboard';
import Diagram from './Diagram';

const Display = (props) =>{

  let displayTab = <Dashboard />;
  if(props.tab === 'dashboard'){
    displayTab = <Dashboard />;
  }
  else if(props.tab == 'tree'){
    displayTab = <Diagram initialDiagramLoad={props.initialDiagramLoad} setInitialDiagramLoad={props.setInitialDiagramLoad} resultElements={props.resultElements}/>;
  }

	return (
			<div id="display">
      {displayTab}
			</div>
	);
};


export default Display;