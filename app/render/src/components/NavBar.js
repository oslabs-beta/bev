import React from 'react';

const NavBar = (props) =>{

    const home = () =>{
        props.setPage({current: 'home'});
    }
    let backHome = [];
    if(props.page ==='chart'){
        backHome = [<li key='home'><button onClick={()=> home()}>Back</button></li>];
    }

    return (<nav>
        <ul className='title'>BEV</ul>
        {backHome}
    </nav>);
}

export default NavBar;