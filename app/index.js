const { app, BrowserWindow, ipcMain, dialog } = require( 'electron' );
const path = require( 'path' );
const fs = require('fs');
// Local dependencies
const io = require( './main/io' );

// Open a window
const openWindow = () => {
    const win = new BrowserWindow( {
        width: 1000,
        height: 700,
        webPreferences: {
            /*
            by default, electron's renderer process does not have access to node.js (and file system) methods as a security measure;
            in order to be able to access files from the renderer process, like how we grabbed the user's folders, we need to set nodeIntegration to true;
            newer builds of electron also require contextIsolation to be set to false for nodeIntegration to work
            */
            nodeIntegration: true,
            devTools: true,
            contextIsolation: false
        },
    } );

    // Load `index.html` file
    win.loadFile( path.resolve( __dirname, 'render/html/index.html' ) );

    return win; // Return window
};

// When app is ready, open a window
app.on( 'ready', () => {
    const win = openWindow();

    // Watch files
    // It looks for changes in the file and that's probably how it sends notifications
    // If a file is created or deleted, then send notif
    // io.watchFiles( win );
} );

// When all windows are closed, quit the app
app.on( 'window-all-closed', () => {
    if( process.platform !== 'darwin' ) {
        app.quit();
    }
} );

// When app activates, open a window
app.on( 'activate', () => {
    if( BrowserWindow.getAllWindows().length === 0 ) {
        openWindow();
    }
} );

/*
The following ipcMain are analogous to controllers in express;
They listen for a "route" sent from the ipcRenderer process and call the corresponding middleware;
*/

// Return list of folders
ipcMain.handle( 'app:get-folders', () => {
    return io.getFolders();
} );

// Open filesystem dialog to choose files
ipcMain.handle( 'app:on-fs-dialog-open', async ( event ) => {
    const folder = dialog.showOpenDialogSync( {
        properties: [ 'openDirectory', 'multiSelections' ],
    } );
	if(folder) io.addFolders(folder);
    return io.getFolders();
} );

// Listen to folder delete event
ipcMain.handle( 'app:on-folder-delete', ( event, folder ) => {
	io.deleteFolder( folder.folderpath );
    const folders = io.getFolders();
    console.log('FOLDERS AFTER DELETE IN HANDLE : ', folders);
	return folders;
} );

// Listen to folder open event
ipcMain.on( 'app:on-folder-open', ( event, folder ) => {
	io.openFolder( folder.folderpath );
} );

// Listen to analyze dependencies event
ipcMain.handle( 'app:on-analyze', ( event, folders ) => {
	const dependencyResults = io.generateDependencyObject(folders);

    // Run `webpack --json > stats.json` in the terminal to generate bundle stats
    // const bundleResults = io.generateBundleInfoObject();
    const bundleResults = {};
    console.log('bundleResults', bundleResults)
	const output = {dependencyResults: dependencyResults, bundleResults: bundleResults};
    return output;
} );