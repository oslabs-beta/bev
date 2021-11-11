const { ipcMain } = require( 'electron' );
const path = require( 'path' );
const fs = require( 'fs-extra' );
const os = require( 'os' );
const open = require( 'open' );
const chokidar = require( 'chokidar' );
const treeify = require('treeify');
const {cruise} = require("dependency-cruiser");

// Local dependencies
const notification = require( './notification' );

// Get application directory
const appDir = path.resolve( os.homedir(), 'BEV-project-files' );

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
			path: ["release", "public"]
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
		json = JSON.stringify(cruiseResult.output);

		notification.resultsAdded( folderArr.length );
		
		// console.log('TREEIFY : ', treeify.asTree(cruiseResult.output));
		fs.writeFile('results.json', json, 'utf8', ()=>console.log('JSON generated complete'));
	} catch (error) {
		// console.error(error);
	}
	// console.log('generated json file from io.js', json);
	return json;

}
