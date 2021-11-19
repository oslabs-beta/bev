import React, {useState} from 'react';
import PercentBar from './PercentBar';
import BundleSelector from './BundleSelector';
import Files from './Files';

const Dashboard = (props) =>{
  // props.bundleInfo is an array
  //const [bundle, setBundle] = useState(props.mfe);
  // const [weights , setWeights] = useState({JS: 400, CSS: 200, HTML: 150, IMG: 80, TOTAL: 830})
  //const [weights , setWeights] = useState(props.mfe.sizes)
  const [bundles, setBundles] = useState(['bundle-v1', 'bundle-v2', 'bundle-v3']);

	return (
			<div className="dashboard">
        <PercentBar setMFE={props.setMFE} mfe={props.mfe} bundleInfo={props.bundleInfo} />
				<div className="card col-s1 col-e6 row-s2 row-ee">
          <Files mfe={props.mfe} />
        </div>
        <div className="card col-s1 col-e6 row-s5 row-ee">
          <div className="card-header">
         Bundle Version Control
          </div>
          <div className="card-body">
          <BundleSelector bundles={bundles} />
          </div>
          <div className="card-footer">
          Footer
          </div>
        </div>
			</div>
	);
};


export default Dashboard;