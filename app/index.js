const { app, BrowserWindow, ipcMain, dialog } = require( 'electron' );
const path = require( 'path' );
const fs = require('fs');
const exec = require('child_process').exec;
// local dependencies
const io = require( './main/io' );


async function execute(command, callback) {
    await exec(command, (error, stdout, stderr) => { 
        if(stderr) callback('ERROR GENERATING SVG : ', stderr);
        else callback(stdout); 
    });
};

const generateSVG = async () => {
    await execute('depcruise-fmt -T dot results.json | dot -T svg > dependency-graph.svg', (output) => {
        console.log('DONE GENERATING SVG');
        // console.log(output);
    });
}


// open a window
const openWindow = () => {
    const win = new BrowserWindow( {
        width: 1000,
        height: 700,
        webPreferences: {
            nodeIntegration: true,
            devTools: true,
        },
    } );

    // load `index.html` file
    win.loadFile( path.resolve( __dirname, 'render/html/index.html' ) );

    /*-----*/
    
    return win; // return window
};

// when app is ready, open a window
app.on( 'ready', () => {
    const win = openWindow();

    // watch files
    io.watchFiles( win );
} );

// when all windows are closed, quit the app
app.on( 'window-all-closed', () => {
    if( process.platform !== 'darwin' ) {
        app.quit();
    }
} );

// when app activates, open a window
app.on( 'activate', () => {
    if( BrowserWindow.getAllWindows().length === 0 ) {
        openWindow();
    }
} );

/************************/

// return list of folders
ipcMain.handle( 'app:get-folders', () => {
    return io.getFolders();
} );

// listen to file(s) add event
ipcMain.handle( 'app:on-file-add', ( event, files = [] ) => {
    io.addFiles( files );
} );

// open filesystem dialog to choose files
ipcMain.handle( 'app:on-fs-dialog-open', async ( event ) => {
    const folder = dialog.showOpenDialogSync( {
        properties: [ 'openDirectory', 'multiSelections' ],
    } );

		if(folder) io.addFolders(folder);

    //io.generateDependencyObject(folder);
    
		//await generateSVG();
		// const files = fs.readdirSync(folder[0]);
    // files.forEach(file => {
    //     console.log('FILE IN FOLDER : ', file);
    // });
    
    // fs.exists() or fs.existSync()
    const svgPath = path.resolve(__dirname, '../dependency-graph.svg');
    fs.exists(path.resolve(__dirname, '../dependency-graph.svg'), (exist) => console.log('SVG EXISTS!! ', exist));

    return io.getFolders();

} );

/*-----*/

// listen to file delete event
// ipcMain.on( 'app:on-file-delete', ( event, file ) => {
//     io.deleteFile( file.filepath );
// } );

// listen to file delete event
ipcMain.handle( 'app:on-folder-delete', ( event, folder ) => {
	io.deleteFolder( folder.folderpath );
	return folder;
} );

// listen to file open event
ipcMain.on( 'app:on-file-open', ( event, file ) => {
    io.openFile( file.filepath );
} );

// listen to file open event
ipcMain.on( 'app:on-folder-open', ( event, folder ) => {
	io.openFolder( folder.folderpath );
} );

// listen to file copy event
ipcMain.on( 'app:on-file-copy', ( event, file ) => {
    event.sender.startDrag( {
        file: file.filepath,
        icon: path.resolve( __dirname, './resources/paper.png' ),
    } );
} );

// listen to analyze dependencies event
ipcMain.handle( 'app:on-analyze', ( event, folders ) => {
	
	io.generateDependencyObject(folders);

	return true;
} );