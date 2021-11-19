//const dragDrop = require( 'drag-drop' );

document.addEventListener('DOMContentLoaded', () => {
  const { ipcRenderer } = require( 'electron' );
  const dom = require( '../js/dom.js' );


  // Get list of folders from the `main` process when app start
  ipcRenderer.invoke( 'app:get-folders' ).then( ( folders = [] ) => {
    dom.displayFolders( folders );
  } );
  
  
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


  //function to generate buttons
  const setMainButtons = () => {
    const uploaderButton = document.getElementById('uploader-button');
    if(uploaderButton){
      uploaderButton.addEventListener('click', (e)=> {
        openDialog();
      });
    }

    // Create an analyze button which has access to the analyzeDep function
    // Append it below the folder display area (see app/src/components/Main.jsx)
    const analyzeButton = document.createElement('button');
    analyzeButton.setAttribute('id', 'create-project');
    analyzeButton.setAttribute('onclick', 'analyzeDep()');
    // Disabled by default, but will be removed if displayFolders is invoked and populates its array
    analyzeButton.disabled = true;
    analyzeButton.innerText = 'Start Project';
    const analyzeDiv = document.getElementById('analyze-button');
    if(analyzeDiv) analyzeDiv.appendChild(analyzeButton);
  }

  setMainButtons();

  // identify an element to observe
  const elementToObserve = window.document.getElementById('app').children[0];

  // create a new instance of 'MutationObserver' named 'observer', 
  // Listen for changes(mutations) in the app div which would trigger the callback to rerender
  observer = new MutationObserver(function(mutationsList, observer) {

      setMainButtons();

      //display folders
      // Get list of folders from the `main` process when app start
      const folderDiv = document.getElementById('folderlist');
      if(folderDiv){
        ipcRenderer.invoke( 'app:get-folders' ).then( ( folders = [] ) => {
          dom.displayFolders( folders );
        } );
      }

  });

  // call 'observe' on that MutationObserver instance, 
  // passing it the element to observe, and the options object
  observer.observe(elementToObserve, {characterData: false, childList: true, attributes: false});



});






