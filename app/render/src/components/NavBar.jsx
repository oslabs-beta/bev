import React from 'react';

const NavBar = (props) =>{

    const home = () =>{
        props.setPage({current: 'home'});
    }
    let backHome = [];
    if(props.page ==='chart'){
        backHome = [<li key='home'><button onClick={()=> home()}>Back</button></li>];
    }

    return (
        <nav>
            <h1 className='title'>BEV</h1>
            {backHome}
        </nav>
    );
}

export default NavBar;