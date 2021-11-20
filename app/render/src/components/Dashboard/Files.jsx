import React, {useState} from 'react';

const Files = (props) =>{

  const bundle = props.mfe;
  const totalSizePerAsset = {};
  const showFileDetailsObj = {};
  const hoverObj = {};
  Object.entries(bundle.assets).forEach(([k,v]) => {
    let totalSize = 0;
    v.forEach(e => totalSize += e.size)
    totalSizePerAsset[k] = totalSize;
    showFileDetailsObj[k] = false;
    hoverObj[k] = false;
  })
  const [showFileDetails, setShowFileDetails] = useState(showFileDetailsObj);
  const [hover, setHover] = useState(hoverObj);

  const handleClick = (e) => {
    console.log('e', e);
    const fileType = e.target.id;
    const newProperty = {};
    newProperty[fileType] = showFileDetails[fileType] === true ? false : true;
    setShowFileDetails({...showFileDetails, ...newProperty});
    console.log('showFileDetails', showFileDetails);
  }

  const fileTypeStyle = {};
  Object.keys(hover).forEach(fileType => {
    fileTypeStyle[fileType] = {
      display: 'flex', 
      flexDirection: 'row', 
      padding: '10px', 
      borderStyle: 'ridge', 
      justifyContent: 'space-between',
      backgroundColor: hover[fileType] === true ? 'aliceblue' : ''
    }
  })

  const handleHover = (e) => {
    console.log('hover before change', hover)
    const fileType = e.target.id;
    hover[fileType] = hover[fileType] ? false : true;
    setHover({...hover});
    console.log('hover after change', hover)
  }

  return (
    <>
      <div className="card-header">
        Bundle Assets
      </div>
      {Object.entries(bundle.assets).map(([k,v], index) => (
        <>
          <div 
            key={index} 
            id={k} 
            onClick={(e) => handleClick(e)}
            onMouseEnter={(e) => handleHover(e)} 
            onMouseLeave={(e) => handleHover(e)} 
            style={fileTypeStyle[k]}
          >
            <div>
              {k}
            </div>
            <div>
              {totalSizePerAsset[k]}
            </div>
          </div>
          <div id="file-type-details">
              {v.map((e, i) => (showFileDetails[k] ? (<div key={i} style={{
                display: 'flex', 
                flexDirection: 'row', 
                justifyContent: 'space-between', 
                paddingInline: '15px',
                paddingBlock: '4px',
                borderStyle: 'groove',
                borderWidth: 'thin',
                backgroundColor: '#f0f0f0'
              }}><div>{e.name}</div> <div>{e.size}</div></div>) : <></>))}
          </div>
        </>
      ))}
    </>
  )
}

export default Files;