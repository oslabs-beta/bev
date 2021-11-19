import React, {useState} from 'react';
import Menu from './Menu';
import Display from './Display';
import { Link } from 'react-router-dom';

const ControlPanel = (props) =>{

	const [tab, setTab] = useState('dashboard');


	return (
			<div className="body-container">
				<Menu tab={tab} setTab={setTab} />
				<Display tab={tab} setTab={setTab} initialDiagramLoad={props.initialDiagramLoad} setInitialDiagramLoad={props.setInitialDiagramLoad} resultElements={props.resultElements} bundleInfo={props.bundleInfo} />
			</div>
	);
};


export default ControlPanel;