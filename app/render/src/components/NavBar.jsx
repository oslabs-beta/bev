import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
const NavBar = (props) =>{

    const navigate = useNavigate();
    return (
        <nav>
            <h1 className='title'>BEV</h1>
            <ul>
            <Routes>
					<Route path="/chart"  element={<li onClick={() => navigate(-1)}>Back</li>} />
			</Routes>
            </ul>
        </nav>
    );
}

export default NavBar;