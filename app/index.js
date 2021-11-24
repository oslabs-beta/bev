const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
// Local dependencies
const io = require('./main/io');

// Open a window
const openWindow = () => {
  const win = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      /*
            By default, electron's renderer process does not have access to node.js
            (and file system) methods as a security measure;
            In order to be able to access files from the renderer process,
            like how we grabbed the user's folders, we need to set nodeIntegration to true;
            Newer builds of electron also require contextIsolation to be set to false for nodeIntegration to work;
            */
      nodeIntegration: true,
      devTools: true,
      contextIsolation: false,
    },
  });

  // Load `index.html` file
  win.loadFile(path.resolve(__dirname, 'render/html/index.html'));

  return win; // Return window
};

// When app is ready, open a window
app.on('ready', () => {
  const win = openWindow();
});

// When all windows are closed, quit the app
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// When app activates, open a window
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    openWindow();
  }
});

/*
The following ipcMain are analogous to controllers in express to handle "API" calls from frontend;
They listen for a "route" sent from the ipcRenderer process and call the corresponding middleware from io;
*/

// Return list of folders
ipcMain.handle('app:get-folders', () => {
  return io.getFolders();
});

// Open filesystem dialog to choose files
ipcMain.handle('app:on-fs-dialog-open', async (event) => {
  const folder = dialog.showOpenDialogSync({
    properties: ['openDirectory', 'multiSelections'],
  });
  if (folder) io.addFolders(folder);
  return io.getFolders();
});

// Listen to folder delete event
ipcMain.handle('app:on-folder-delete', (event, folder) => {
  io.deleteFolder(folder.folderpath);
  const folders = io.getFolders();
  console.log('FOLDERS AFTER DELETE IN HANDLE : ', folders);
  return folders;
});

// Listen to folder open event
ipcMain.on('app:on-folder-open', (event, folder) => {
  io.openFolder(folder.folderpath);
});

// Listen to analyze dependencies event
ipcMain.handle('app:on-analyze', async (event, folders) => {
  //check for webpack in each folder, alert error to frontend
  let dependencyResults, bundleResults;
  try {
    dependencyResults = io.generateDependencyObject(folders);
    bundleResults = await io.generateBundleInfoObject(folders);
  } catch (err) {
    return { error: true, msg: err };
  }

  return {
    dependencyResults,
    bundleResults,
  };
});
