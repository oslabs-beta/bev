import React from 'react';


const MFESelector = ( props ) =>{
  console.log('bundle folders', props.bundleInfo.map(e => e.folder));
  const folders = props.bundleInfo.map(e => e.folder);
  const options = [];
  folders.forEach( folder =>{
    options.push(<option key={folder} value={folder}>{folder}</option>);
  });

  const mfeHandler = (e) =>{
    console.log('SELECTED FOLDER : ', e.target.value);
  }

  return (
    <div className="mfe-selector-div">
      <select id="mfe-selector" onClick={()=>mfeHandler()}>
        {options}
      </select>  
    </div>
  );
};



{/* <Dropdown onChange={(e) => {
            console.log('dropdown event', e.target.value);
            props.setMFE(e.target.value);
            }} options={props.bundleInfo.map(e => e.folder)} value={'Select MFE'} placeholder="Select an option" /> */}

export default MFESelector;