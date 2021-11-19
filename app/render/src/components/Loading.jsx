import React, { useState } from "react";
import { Link } from 'react-router-dom';
import loading from '../stylesheets/kingfisher-loading.gif';

/*
Implemented react-router based on react-router v6 which introduced braking changes
*/
const Loading = (props) => {
	const [bundleInfo, setBundleInfo] = useState(props.bundleInfo); 
    console.log('bundleInfo from Loading.jsx', bundleInfo)
	return (
        <>
            { (Object.keys(bundleInfo).length === 0) ? (

                <div className="main-container">
                    <img style={{margin: "auto", width: "200px"}} src={loading} alt="loading..." />
                    <p style={{textAlign: "center", color: "black"}}>Loading... This may take a while.</p>
                </div>
             ) : (
                <Link to="/controlpanel" >
                    <input type="hidden" id="start-project" value="" onClick={(e) => props.setState(e)} />
                </Link>
            )}
        </>
	);
}


export default Loading;