import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
const NavBar = (props) =>{

    const navigate = useNavigate();
    const setDiagramLoad = () => {
        props.setInitialDiagramLoad(false);
    }
    return (
        <nav>
            <h1 className='title'>bev</h1>
            <ul>
            <Routes>
                {/*
                useNavigate is a method native to react-router v6 and higher;
                the function accepts an integer and will move forward/backwards in history based on its sign;
                i.e. navigate(-1) will move back one page, navigate(+1) will move forward one page;
                */}
				<Route path="/controlpanel"  element={<li onClick={() => {navigate(-1); setDiagramLoad();}}>Back</li>} />
			</Routes>
            </ul>
        </nav>
    );
}

export default NavBar;