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
// const appDir = path.resolve('/BEV-project-files' );

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
			// path: ["release", "public", "dist"]
		},
		doNotFollow: {
			"path": "node_modules",
		},
		reporterOptions: {
			dot: {
				theme: {
					graph: { rankdir: "TD" },
				},
			},
		},
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

exports.generateBundleInfoObject = async(folders) =>{

	// Generate stats.json
	// webpack --profile --json > stats.json
	console.log('folders in io.js', folders)
	let i = 0;	
	for(let folder of folders){
		let fileName = folder.replaceAll(':','');
		fileName = (fileName.split('').includes('\\')) ? `stats-${fileName.replaceAll('\\','-')}` : `stats-${fileName.replaceAll('/','-')}`;
		console.log("stats-folder.replaceAll('\\','-') :", fileName.replaceAll('\\','-'));
		console.log('fileName ', fileName);
		const filepath = path.resolve(appDir, fileName);
		console.log('filepath: ', filepath);
		if(!fs.existsSync( `${filepath}.json` ) ){
			const {stdout, stderr} = await exec(`webpack --profile --json > ${appDir}/${fileName}.json`,{cwd: folder});

			if (stderr) {
				console.log('stderr', stderr);
			} else {
				console.log('stdout', stderr);
			}
			i += 1;
		}

	};
	console.log('folders', folders);
	console.log('Exited forEach loop for generating stats.json');

	const outputBundleObjectsArray = [];
	for (let i = 0; i < folders.length; i += 1) {
		const outputObj = {};
		const rawStats = fs.readFileSync(`${appDir}/stats${i}.json`);
		const stats = JSON.parse(rawStats);
		const {assets, modules} = stats;
		let totalSize = 0;

		// Set folder property
		outputObj['folder'] = folders[i];

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
		
		outputBundleObjectsArray.push(outputObj);
	}

	return outputBundleObjectsArray;
}	

