import React from 'react';


const MFESelector = ( props ) =>{
  console.log('bundle folders', props.bundleInfo.map(e => e.folder));
  const folders = props.bundleInfo.map(e => e.folder);
  const options = [];
  folders.forEach( folder =>{
    options.push(<option key={folder} value={folder}>{folder.split('\\').pop()}</option>);
  });

  const mfeHandler = (e) =>{
    console.log('SELECTED FOLDER : ', e.target.value);
    for(let bundle of props.bundleInfo){
      if(bundle.folder === e.target.value){
        props.setMFE(bundle);
        console.log('SET MFE : ', bundle);
        return
      }
    }
    console.log('CANNOT SET MFE ');
    return
  }

  return (
    <div className="mfe-selector-div">
      <select id="mfe-selector" onClick={(e)=>mfeHandler(e)}>
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