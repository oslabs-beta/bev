import React, {useState} from 'react';
import PercentBar from './PercentBar';
import BundleSelector from './BundleSelector';

const Dashboard = (props) =>{

  const [bundle, setBundle] = useState('bundle.js');
  const [weights , setWeights] = useState({JS: 400, CSS: 200, HTML: 150, IMG: 80, TOTAL: 830})
  const [bundles, setBundles] = useState(['bundle-v1', 'bundle-v2', 'bundle-v3']);

  const TREE = {
    value: 100,
    label: 'SUM = 100',
    children: [{
      value: 50,
      children: [{
        value: 10
      },
      {
        value: 20
      }]
    }, {
      value: 30
    }, {
      value: 20
    }]
  };

  const [data, setData ] = useState(TREE);

	return (
			<div className="dashboard">
        <PercentBar weights={weights} />
				<div className="card col-s1 col-e3 row-s2 row-e5">
          <div className="card-header">
         FILES TYPE
          </div>
          <div className="card-body">
          Body
          </div>
          <div className="card-footer">
          Footer
          </div>
        </div>
        <div className="card col-s3 col-ee row-s2 row-ee">
          <div className="card-header">
         Cake Chart
          </div>
          <div className="card-body">
          Chart Here
          </div>
          <div className="card-footer">
          Footer
          </div>
        </div>
        <div className="card col-s1 col-e3 row-s5 row-ee">
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