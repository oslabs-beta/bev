import React from 'react';

const BundleSelector = (props) =>{

  const options = [];

  props.bundles.forEach( version => {
    options.push(<option value={version}>{version}</option>);
  });

	return (<div className="bundle-version-div">
				<select id="bundle-version">
          {options}
        </select>
        </div>);
};


export default BundleSelector;