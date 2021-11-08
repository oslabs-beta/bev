import React, {Component} from "react";
import './stylesheets/style.css';
import Main from './components/Main'

class App extends Component {
	constructor(props){
		super(props);

	}

	componentDidMount(){
		console.log('MOUNTED COMPONENT');
	}

	render(){
		return (
			<div className='container'>
				<nav>
					<ul className='title'>BEV</ul>
				</nav>
				<Main />
			</div>
		);
	}
}

export default App;