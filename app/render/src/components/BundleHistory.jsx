import React, { PureComponent, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';



const BundleHistory = (props) =>{
  const data = [];
	const colors = { js: '#ffadad', css: '#ffd6a5', sass: '#fdffb6', ts: '#caffbf',  html: '#9bf6ff', vue: '#a0c4ff', img: '#bdb2ff', svg: '#ffc6ff', jpg: '#bdb2ff', jpeg: '#bdb2ff', png: '#bdb2ff', gif: '#bdb2ff'};

	//Select MFE bundle history
	const [MFEBundle, setMFEBundle] = useState(props.bundleHistory[0]);
	//get maximum length of version history.
	let n = 0;

	props.bundleHistory.forEach(bundle => {if(bundle.length > n){n = bundle.length}});

	
	for(let version of MFEBundle){
		const kbSizes= {};
		for(let key in version.sizes){
			kbSizes[key] = (version.sizes[key]/1024).toFixed(2);
		}
		const point = {name: version.date, ...kbSizes};
		console.log('POINT IS = ', point);
		//since bundlehistory lastest version is at index 0, when we graph we want last version to be last in array
		//hence we use unshift to get the lastest version to be at last index in data array
		//so that when we graph, history is from left to right
		data.unshift(point);
	}

	//Retrieve latest version of bundle which is at index 0
	const lastVersion = MFEBundle[0];
	const Lines = [];
	for(let key in lastVersion.sizes){
		if(lastVersion.sizes[key]==='total') Lines.push(<Line type="monotone" dataKey="total" stroke="#82ca9d" activeDot={{ r: 8 }} />);
		else Lines.push(<Line type='monotone' dataKey={key} stroke={colors[key]} />);
	}

	//create options in the select which MFE Bundle History
	const options = [];
	props.bundleHistory.forEach( bundle =>{
		let folder = bundle[0].folder;
		let folderName = folder.split('\\').pop();
		folderName = folderName.split('/').pop();
    options.push(<option key={bundle[0].folder} value={bundle[0].folder}>{folderName}</option>);
  });


	const bundleHandler = (e) =>{
		for(let bundle of props.bundleHistory){
      if(bundle[0].folder === e.target.value){
        setMFEBundle(bundle);
        console.log('SET MFE HISTORY BUNDLE: ', bundle);
        return
      }
    }
	}

	return (
			<div className="dashboard">
				<div className="mfe-selector-div">
      	<select id="bundlehistory-selector" onChange={(e)=>bundleHandler(e)}>
        	{options}
      	</select>  
    	</div>
				<div className="card col-s1 col-e6 row-s2 row-ee">
				<ResponsiveContainer width="100%" height="100%">
        <LineChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}n
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          {Lines}
        </LineChart>
      </ResponsiveContainer>
        </div>
			</div>
	);
};


export default BundleHistory;