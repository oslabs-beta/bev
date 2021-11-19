import React, {useState} from 'react';
import PercentBar from './PercentBar';
import BundleSelector from './BundleSelector';
import Dropdown from 'react-dropdown';
// import 'react-dropdown/style.css';

const Files = (props) =>{

  const bundle = props.mfe;

  return (
    <>
      <div className="card-header">
        Assets
      </div>
      {Object.entries(bundle.assets).map(([k,v]) => (
        <div style={{'padding': '10px', 'border-style': 'groove'}} >
          <Dropdown onChange={() => console.log('triggered')} options={v.map(e => e.name)} value={k} placeholder="Select an option" />
        </div>
      ))}

      {/* <div className="card-footer">
        Footer
      </div> */}
    </>
  )

}

export default Files;