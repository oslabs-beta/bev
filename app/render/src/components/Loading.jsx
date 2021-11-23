import React, { useState } from "react";
import { Link } from 'react-router-dom';
import ControlPanel from "./ControlPanel";
import loading from '../stylesheets/hummingbird-loading.gif';

/*
Implemented react-router based on react-router v6 which introduced braking changes
*/
const Loading = (props) => {
    console.log('bundleInfo from Loading.jsx', props.bundleInfo)

	return (
        <>
            <div className="main-container" id='loading-content'>
                <img style={{margin: "auto", width: "300px"}} src={loading} alt="loading..." />
                <p style={{margin:"auto", color: "black"}}>Loading... This may take a while.</p>
            </div>
        </>
	);
}


export default Loading;