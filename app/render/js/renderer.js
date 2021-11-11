const dragDrop = require( 'drag-drop' );
const { ipcRenderer } = require( 'electron' );

// Local dependencies
const dom = require( './dom' );

// Get list of folders from the `main` process when app start
ipcRenderer.invoke( 'app:get-folders' ).then( ( folders = [] ) => {
    dom.displayFolders( folders );
} );


console.log('Renderer IS RAN');

// Handle file delete event
// ipcRenderer.on( 'app:delete-file', ( event, filename ) => {
//     document.getElementById( filename ).remove();
// } );


// Add files drop listener
// dragDrop( '#uploader', ( files ) => {
//     const _files = files.map( file => {
//         return {
//             name: file.name,
//             path: file.path,
//         };
//     } );

// // Send file(s) add event to the `main` process
// ipcRenderer.invoke( 'app:on-file-add', _files ).then( () => {
//         ipcRenderer.invoke( 'app:get-files' ).then( ( files = [] ) => {
//             dom.displayFiles( files );
//         } );
//     } );
// } );

// Open filesystem dialog
window.openDialog = () => {
    ipcRenderer.invoke( 'app:on-fs-dialog-open' ).then( (folders) => {
		dom.displayFolders(folders);
    } );
}