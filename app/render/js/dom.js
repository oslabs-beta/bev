const { ipcRenderer } = require( 'electron' );
const path = require('path');

// Open folder
window.openFolder = function ( itemId ) {

	// Get path of the file
	const itemNode = document.getElementById( itemId );
	const folderpath = itemNode.getAttribute( 'data-folderpath' );

	// Send event to the main thread
	ipcRenderer.send( 'app:on-folder-open', { id: itemId, folderpath } );
};

// Delete folder from folders.json
window.deleteFolder = function ( itemId ) {

	// Get path of the file
	const itemNode = document.getElementById( itemId );
	const folderpath = itemNode.getAttribute( 'data-folderpath' );
	// Send event to the main thread
	ipcRenderer.invoke( 'app:on-folder-delete', { id: itemId, folderpath } )
		.then(folder => {
			const removeNode = document.getElementById( folder.id );
			removeNode.remove();
		});
};

exports.displayFolders = ( folders = [] ) => {
	const folderListElem = document.getElementById( 'folderlist' );
	folderListElem.innerHTML = '';

	folders.forEach( (folder, index) => {
			const itemDomElem = document.createElement( 'div' );
			itemDomElem.setAttribute( 'id', index ); // Set `id` attribute
			itemDomElem.setAttribute( 'class', 'app__folders__item' ); // Set `class` attribute
			itemDomElem.setAttribute( 'data-folderpath', folder ); // Set `data-filepath` attribute
			itemDomElem.innerHTML = `${folder}
					<img ondragstart='copyFile(event, "${ folder }")' src='../assets/document.svg' class='app__files__item__file'/>
					<img onclick='deleteFolder("${ index }")' src='../assets/delete.svg' class='app__files__item__delete'/>
					<img onclick='openFolder("${ index }")' src='../assets/open.svg' class='app__files__item__open'/>
			`;

			folderListElem.appendChild( itemDomElem );
	} );
};

window.analyzeDep = function () {
	const folderNodes = document.getElementsByClassName('app__folders__item');
	const folderObjs = Array.from(folderNodes);
	const folders = folderObjs.map( node => node.getAttribute('data-folderpath'))

	ipcRenderer.invoke( 'app:on-analyze', folders).then( results =>  {
		//change the value of a dom element.
		console.log('RESULTS SENT FROM THE BACKEND ', results);
		const trigger = document.getElementById('trigger');
		trigger.value = results;
	});
};

// Create an analyze button which has access to the analyzeDep function
// Append it below the folder display area (see app/src/components/Main.jsx)
const analyzeButton = document.createElement('button');
analyzeButton.setAttribute('onclick', 'analyzeDep()');
analyzeButton.innerText = 'Analyze Dependencies';
const analyzeDiv = document.getElementById('analyze-button');
analyzeDiv.appendChild(analyzeButton);