const { ipcMain } = require( 'electron' );
const path = require( 'path' );
const fs = require( 'fs-extra' );
const os = require( 'os' );
const open = require( 'open' );
const treeify = require('treeify');
const {cruise} = require("dependency-cruiser");
const util = require('util');
const exec = util.promisify(require('child_process').exec);


// Local dependencies
const notification = require( './notification' );

// Get application directory
const appDir = path.resolve( os.homedir(), 'BEV-project-files' );
//const appDir = path.resolve('./BEV-project-files' );

// Folder json name
const folderName = 'folders.json';

// Get list of Folders
exports.getFolders = () => {
	 // Ensure `appDir` exists
	fs.ensureDirSync( appDir );

	 // If folder does not exist then create folder
	if(!fs.existsSync(path.resolve(appDir, folderName))){
		fs.writeFileSync(path.resolve(appDir, folderName), JSON.stringify([]));
	}

	const foldersRaw = fs.readFileSync( path.resolve(appDir, folderName));
	const folders = JSON.parse(foldersRaw);
	return folders;
};

// Add folders to folders.json
exports.addFolders = ( foldersArr = [] ) => {
    
	// Ensure `appDir` exists, if not then create appDir --> BEV-project-files
	fs.ensureDirSync( appDir );
	
	// Get the json obj from folders.json
	const foldersRaw = fs.readFileSync( path.resolve(appDir, folderName));

	// Parse to turn json obj into an array of folders
	const folders = JSON.parse(foldersRaw);

	//Check for any exisiting.
	folders.forEach( folder=> {
		if(foldersArr.indexOf(folder)>-1) foldersArr.splice(foldersArr.indexOf(folder), 1);
	})

	// Write into folders.json with the foldersArr concat to the original array of folders
	fs.writeFileSync(path.resolve(appDir, folderName), JSON.stringify(folders.concat(foldersArr)));

};

// Delete folder from folders.json
exports.deleteFolder = ( folderpath ) => {
	const folders = exports.getFolders();
	const index = folders.indexOf(folderpath);
	if(index!=-1) folders.splice(index, 1);
	fs.writeFileSync(path.resolve(appDir, folderName), JSON.stringify(folders), {encoding:'utf8',flag:'w'});

};


// Open a folder
exports.openFolder = ( folderpath ) => {
	console.log('INSIDE OPEN FOLDER OF PATH: ', folderpath)

	// Open a folder using default application
	if( fs.existsSync( folderpath ) ) {
			open( folderpath );
	}
};


// Watch files from the application's storage directory
// it watches for changes in the file but we don't really need it here
// it might be related to the notifications, this is how it tells when the file has been deleted
exports.watchFiles = ( win ) => {
    chokidar.watch( appDir ).on( 'unlink', ( filepath ) => {
        win.webContents.send( 'app:delete-file', path.parse( filepath ).base );
    } );
}

exports.generateDependencyObject = (folderArr) =>{
	const ARRAY_OF_FILES_AND_DIRS_TO_CRUISE = folderArr;
	const cruiseOptions = {
		includeOnly: ["src", "assets", "node_modules"],
		exclude: {
			path: ["release", "public", "out", "dist", "__tests__"]
		},
		doNotFollow: {
			path: "node_modules",
		},
		reporterOptions: {
			dot: {
				theme: {
					graph: { rankdir: "TD" },
				},
			},
		},
		moduleSystems: ['amd', 'es6', 'tsd']
	};
	let json;
	try {
		const cruiseResult = cruise(
			ARRAY_OF_FILES_AND_DIRS_TO_CRUISE,
			cruiseOptions
		);

		// console.dir(cruiseResult, { depth: 20 });
		// json = JSON.stringify(cruiseResult.output);
		json = cruiseResult.output;

		notification.resultsAdded( folderArr.length );
		
		// console.log('TREEIFY : ', treeify.asTree(cruiseResult.output));
		fs.writeFile('results.json', json, 'utf8', ()=>console.log('JSON generated complete'));
	} catch (error) {
		// console.error(error);
	}
	// console.log('generated json file from io.js', json);
	return json;

}

exports.generateBundleInfoObject = async (folders) =>{

	// Generate stats.json
	// webpack --profile --json > stats.json
	console.log('folders in io.js', folders)
	let i = 0;	
	let fileName;
	const dateTag = new Date().toISOString().slice(0,19).replace('T','').replaceAll(':', '-').replaceAll('-','');
	const outputBundleObjectsArray = [];
	const outputBundleObjectsArrayRAW = [];
	for(let folder of folders){
		fileName = folder.replaceAll(':','');
		fileName = (fileName.split('').includes('\\')) ? `stats-${fileName.replaceAll('\\','-')}-${dateTag}` : `stats-${fileName.replaceAll('/','-')}-${dateTag}`;
		console.log("stats-folder.replaceAll('\\','-') :", fileName.replaceAll('\\','-'));
		console.log('fileName ', fileName);
		const filepath = path.resolve(appDir, fileName);
		console.log('filepath: ', filepath);

		//If stats file does not exist then create
		if(!fs.existsSync( `${filepath}.json` ) ){
			const {stdout, stderr} = await exec(`webpack --profile --json > ${filepath}.json`,{cwd: folder});

			if (stderr) {
				console.log('stderr', stderr);
			} else {
				console.log('stdout', stdout);
			}
			i += 1;
		}

		//Read from stats file and store in outputBundleObjectsArray
		const outputObj = {};
		const rawStats = fs.readFileSync(`${filepath}.json`);
		const stats = JSON.parse(rawStats);
		outputBundleObjectsArrayRAW.push(stats);
		const {assets, modules} = stats;
		let totalSize = 0;

		// Set folder property
		outputObj['folder'] = folder;

		// Fetch assets 
		outputObj['assets'] = {};
		assets.forEach(asset => {
			const { name, size } = asset;
			const type = name.split('.').pop();
			totalSize += size;
			if (outputObj['assets'].hasOwnProperty(type)) {
				outputObj['assets'][type].push({ 'name': name, 'size': size })
			} else {
				outputObj['assets'][type] = [{'name': name, 'size': size}];
			}
		})

		// Fetch modules
		outputObj['modules'] = [];
		modules.forEach(module => {
			const {size, name} = module;
			outputObj['modules'].push({
				'name': name,
				'size': size
			})
		})

		// Calculate total asset sizes
		outputObj['sizes'] = {};
		for (type in outputObj['assets']) {
			outputObj['sizes'][type] = 0; 
			outputObj['assets'][type].forEach(asset => {
				outputObj['sizes'][type] += asset.size;
			})
		}

		// Set total bundle size
		outputObj['sizes']['total'] = totalSize;
		
		outputBundleObjectsArray.push({...outputObj});


	};
	console.log('folders', folders);

	return {bundleStatsRaw: outputBundleObjectsArrayRAW, bundleStats: outputBundleObjectsArray};
}	

/*
  `depCruiserResults` is an Object
  `statsResults` is an Array of Objects
*/
exports.modifyDependencyObject = (depCruiserResults, statsResults, folders) => {

  // Update `depCruiserResults` resolved names (cj -> es6)
  // e.g. 'node_modules/react-flow-renderer/dist/ReactFlow.js' -> 'node_modules/react-flow-renderer/dist/ReactFlow.esm.js'
  // Traverse `depCruiserResults.modules`, then `dependencies`
    // if `d.dependencyTypes[0]` === 'npm', save `d.module`, e.g. 'react-flow-renderer' 
    // Find matching statsResults modules, where name contains 'node_modules' + saved module, e.g. 'node_modules/react-flow-renderer'
	console.log('FROM MODIFYDEPENDENCYOBJECT METHOD')

  // Preprocess dirs into Arrays
  let onPC;
  if (appDir.split('').includes('\\')) onPC = true;
  console.log('onPC', onPC)

  let bevRootPath, folderPath;
  if (onPC) {
    bevRootPath = appDir.split('\\');
    bevRootPath = bevRootPath.slice(0, bevRootPath.length - 1);
    folderPath = folders[0].split('\\'); 
  } else {
    bevRootPath = appDir.split('/');
    bevRootPath = bevRootPath.slice(0, bevRootPath.length - 1);
    folderPath = folders[0].split('/');
  }

  console.log('bevRootPath', bevRootPath)
  console.log('folderPath', folderPath);
  let backLog = [];
  let lastIndex;
  for (let i = 0; i < bevRootPath.length; i += 1) {
    if (bevRootPath[i] !== folderPath[i]) {
      lastIndex = i;
      break;
    }   
  }
  backLog = folderPath.slice(lastIndex);
  for (let i = 0; i < bevRootPath.length - lastIndex; i += 1) {
    backLog.unshift('..');
  }
  backLog = (onPC) ? backLog.join('\\') : backLog.join('/');
  console.log('backLog', backLog)

  // Check if backLog is the same as bevRootPath
  let modifyFilePath = true;
  if (backLog === bevRootPath.join('\\') || backLog === bevRootPath.join('/')) modifyFilePath = false;

  const newSources = {} // source: ..., newSource:...

  // Traverse `dependencies` array in `depCruiserResults.modules`
  depCruiserResults.modules.map(m => {
    // Add `dependencies[n].resolved` to `targetNodeNames`
    const source = modifyFilePath ? m.source.slice(backLog.length+1) : m.source;
    console.log('source', source)
    m.dependencies.map(d => {
      let target = modifyFilePath ? d.resolved.slice(backLog.length + 1) : d.resolved; // Might have to change, if `target` is a node_modules that is cjs

      let moduleName;
      if (d.dependencyTypes[0] === 'npm') moduleName = d.module;
      
      for (let i = 0; i < statsResults.length; i += 1) {
        // Trigger `target` update
        if (moduleName) {
          // console.log('module name', moduleName);
          // console.log('source name', source);
          // console.log('old target name', target);
          const info = statsResults[i].modules.filter(module => module.hasOwnProperty('issuerName') && module.issuerName.slice(2) === source)
          if (info.length > 0) {
            for (let j = 0; j < info.length; j += 1) {
              info[j].reasons.forEach(r => {
                // if (r.userRequest === moduleName && info[j].name.slice(2) !== ''){
                if (r.userRequest === moduleName){
                  // console.log('reasons to change ',moduleName,' r.userRequest', r.userRequest, 'new target name', info[j].name);
                  newTarget = info[j].name.slice(2);
                  newSources[target] = newTarget;
                  target = newTarget;
                } 
              })
            }
          }
          // console.log('new target name', target)
        }
      }

      d.resolved = target;
      return d
    })

    return m;
  })


  depCruiserResults.modules.map(m => {
    // Add `dependencies[n].resolved` to `targetNodeNames`

    const source = modifyFilePath ? m.source.slice(backLog.length + 1) : m.source;
    m.dependencies.map(d => {
      const target = d.resolved; // Might have to change, if `target` is a node_modules that is cjs
      console.log('target', target)
      for (let i = 0; i < statsResults.length; i += 1) {
        // Set `active` property
        const statsArrayTargetInfo = statsResults[i].modules.filter(module => module.name.slice(2) === target)
        if (statsArrayTargetInfo.length > 0) {
          statsArrayTargetInfo[0].reasons.forEach(r => {
            const statsArraySource = r.resolvedModule.slice(2);
            if (!d.hasOwnProperty('active')) {
              if (statsArraySource === source && r.type === 'harmony import specifier') {
                const {active} = r;
                d.active = active ?? false;
              }
            } 
          })
        }
      }

      return d
    })

    return m;
  })



  // console.log('newSources', newSources)
  // Update module source names
  depCruiserResults.modules.map(m => {
    const source = modifyFilePath ? m.source.slice(backLog.length + 1) : m.source
    if (newSources.hasOwnProperty(source) && newSources[source] !== '') m.source = newSources[source];
    else m.source = modifyFilePath ? m.source.slice(backLog.length + 1) : m.source;
    return m;
  })

  // targetNodeNames = [...new Set(targetNodeNames)] // Remove duplicates

  // To find whether target dependency is used by source: is `active` true or false? 
  // targetNodeNames.forEach(node => {
  //   // Find module Object in `statsResults`

  // })
	
	// Return mutated depCruiserResults Object
	return depCruiserResults;
}

// bundleResults -> Array of Objects
// dependencyResults -> Object
/*
| ./Users/toopham/BEV-project-files
	| home-stats.json
	| search-stats.json
	| nav-stats.json



	| home
		| BEV-project-files
			| stats.json -->array of stats.json + depedencyResults
	| search
		| BEV-project-files
	| nav
		| BEV-project-files
*/
exports.saveStates = ({bundleResults, dependencyResults}) => {
	
	//loop through bundleResults array and save into appropriate folder
}