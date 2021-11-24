import React from 'react';
import { Link } from 'react-router-dom';

const Menu = (props) =>{

	return (
			<div id="menu">
    <ul className="control-menu">
      <li className="menu-heading">
        <h3>Project</h3>
      </li>
      <li onClick={()=> props.setTab('dashboard')} className={props.tab=='dashboard'? 'active-li': 'notactive-li'}>
        <span>Dashboard</span>
      </li>
      <li onClick={()=> props.setTab('tree')} className={props.tab=='tree'? 'active-li': 'notactive-li'}>
          <span>Dependency Graph</span>
      </li>
    </ul>
	</div>
	);
};


export default Menu;