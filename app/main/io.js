const { ipcMain } = require( 'electron' );
const path = require( 'path' );
const fs = require( 'fs-extra' );
const os = require( 'os' );
const open = require( 'open' );
const chokidar = require( 'chokidar' );
const treeify = require('treeify');
const {cruise} = require("dependency-cruiser");

// local dependencies
const notification = require( './notification' );

// get application directory
const appDir = path.resolve( os.homedir(), 'BEV-project-files' );
//folder json name
const folderName = 'folders.json';

/****************************/

// get the list of files
exports.getFiles = () => {
    const files = fs.readdirSync( appDir );

    return files.map( filename => {
        const filePath = path.resolve( appDir, filename );
        const fileStats = fs.statSync( filePath );

        return {
            name: filename,
            path: filePath,
            size: Number( fileStats.size / 1000 ).toFixed( 1 ), // kb
        };
    } );
};


//get list of Folders
exports.getFolders = () => {
	 // ensure `appDir` exists
	 fs.ensureDirSync( appDir );

	 //if folder does not exist then create folder
	 if(!fs.existsSync(path.resolve(appDir, folderName))){
		fs.writeFileSync(path.resolve(appDir, folderName), JSON.stringify([]));
	 }

	const foldersRaw = fs.readFileSync( path.resolve(appDir, folderName));
	const folders = JSON.parse(foldersRaw);
	console.log(folders);
	return folders;
};


/****************************/

//Function(folder directory) ---> return array of all files in folder


// add files
exports.addFiles = ( files = [] ) => {
    
    // ensure `appDir` exists
    fs.ensureDirSync( appDir );
    
    // copy `files` recursively (ignore duplicate file names)
    //CHECK IF FOLDER THEN GO IN FOLDER TO GET FILES
    files.forEach( file => {
        if(!fs.statSync(file.path).isDirectory()){
            const filePath = path.resolve( appDir, file.name );

            if( ! fs.existsSync( filePath ) ) {
                fs.copyFileSync( file.path, filePath );
            }
        }
    } );


};

//add folders to folders.json
exports.addFolders = ( foldersArr = [] ) => {
    
	// ensure `appDir` exists
	fs.ensureDirSync( appDir );
	
	const foldersRaw = fs.readFileSync( path.resolve(appDir, folderName));
	const folders = JSON.parse(foldersRaw);

	fs.writeFileSync(path.resolve(appDir, folderName), JSON.stringify(folders.concat(foldersArr)));
};

// delete a file
// exports.deleteFile = ( filename ) => {
//     const filePath = path.resolve( appDir, filename );

//     // remove file from the file system
//     if( fs.existsSync( filePath ) ) {
//         fs.removeSync( filePath );
//     }
// };

// delete folder from folders.json
exports.deleteFolder = ( folderpath ) => {
	const folders = exports.getFolders();
	const index = folders.indexOf(folderpath);
	if(index!=-1) folders.splice(index, 1);
	fs.writeFileSync(path.resolve(appDir, folderName), JSON.stringify(folders), {encoding:'utf8',flag:'w'});

};

// open a file
exports.openFile = ( filename ) => {
    const filePath = path.resolve( appDir, filename );

    // open a file using default application
    if( fs.existsSync( filePath ) ) {
        open( filePath );
    }
};

// open a file
exports.openFolder = ( folderpath ) => {
	console.log('INSIDE OPEN FOLDER OF PATH: ', folderpath)
	// open a file using default application
	if( fs.existsSync( folderpath ) ) {
			open( folderpath );
	}
};

/*-----*/

// watch files from the application's storage directory
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
	try {
	const cruiseResult = cruise(
			ARRAY_OF_FILES_AND_DIRS_TO_CRUISE,
			cruiseOptions
	);
	console.dir(cruiseResult, { depth: 20 });
	const json = JSON.stringify(cruiseResult.output);

	
	notification.resultsAdded( folderArr.length );
	
	console.log('TREEIFY : ', treeify.asTree(cruiseResult.output));
	fs.writeFile('results.json', json, 'utf8', ()=>console.log('JSON generated complete'));
	} catch (error) {
	console.error(error);
	}
}


//display svg file
exports.displaySVG = () => {
    
}