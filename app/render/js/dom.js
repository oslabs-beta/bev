const { ipcRenderer } = require( 'electron' );
const path = require('path');

// copy file
window.copyFile = function ( event, itemId ) {
    event.preventDefault();

    // get path of the file
    const itemNode = document.getElementById( itemId );
    const filepath = itemNode.getAttribute( 'data-filepath' );

    // send event to the main thread
    ipcRenderer.send( 'app:on-file-copy', { id: itemId, filepath } );
};

// delete file
window.deleteFile = function ( itemId ) {

    // get path of the file
    const itemNode = document.getElementById( itemId );
    const filepath = itemNode.getAttribute( 'data-filepath' );

    // send event to the main thread
    ipcRenderer.send( 'app:on-file-delete', { id: itemId, filepath } );
};

// open file
window.openFile = function ( itemId ) {

    // get path of the file
    const itemNode = document.getElementById( itemId );
    const filepath = itemNode.getAttribute( 'data-filepath' );

    // send event to the main thread
    ipcRenderer.send( 'app:on-file-open', { id: itemId, filepath } );
};

//open folder
window.openFolder = function ( itemId ) {

	// get path of the file
	const itemNode = document.getElementById( itemId );
	const folderpath = itemNode.getAttribute( 'data-folderpath' );

	// send event to the main thread
	ipcRenderer.send( 'app:on-folder-open', { id: itemId, folderpath } );
};

// delete folder from folders.json
window.deleteFolder = function ( itemId ) {

	// get path of the file
	const itemNode = document.getElementById( itemId );
	const folderpath = itemNode.getAttribute( 'data-folderpath' );
	// send event to the main thread
	ipcRenderer.invoke( 'app:on-folder-delete', { id: itemId, folderpath } )
		.then(folder => {
			const removeNode = document.getElementById( folder.id );
			removeNode.remove();
		});
};

window.analyzeDep = function () {

	const folderNodes = document.getElementsByClassName('app__folders__item');
	const folderObjs = Array.from(folderNodes);
	const folders = folderObjs.map( node => node.getAttribute('data-folderpath'))

	ipcRenderer.invoke( 'app:on-analyze', folders)
};

exports.displayFiles = ( files = [] ) => {
    const fileListElem = document.getElementById( 'filelist' );
    fileListElem.innerHTML = '';

    files.forEach( file => {
        const itemDomElem = document.createElement( 'div' );
        itemDomElem.setAttribute( 'id', file.name ); // set `id` attribute
        itemDomElem.setAttribute( 'class', 'app__files__item' ); // set `class` attribute
        itemDomElem.setAttribute( 'data-filepath', file.path ); // set `data-filepath` attribute

        itemDomElem.innerHTML = `
            <img ondragstart='copyFile(event, "${ file.name }")' src='../assets/document.svg' class='app__files__item__file'/>
            <div class='app__files__item__info'>
                <p class='app__files__item__info__name'>${ file.name }</p>
                <p class='app__files__item__info__size'>${ file.size }KB</p>
            </div>
            <img onclick='deleteFile("${ file.name }")' src='../assets/delete.svg' class='app__files__item__delete'/>
            <img onclick='openFile("${ file.name }")' src='../assets/open.svg' class='app__files__item__open'/>
        `;

        fileListElem.appendChild( itemDomElem );
    } );
};


exports.displayFolders = ( folders = [] ) => {
	const folderListElem = document.getElementById( 'folderlist' );
	folderListElem.innerHTML = '';

	const analyzeButton = document.createElement('button');
	analyzeButton.setAttribute('onclick', 'analyzeDep()');
	analyzeButton.innerText = 'Analyze Dependencies';
	const divElem = document.createElement( 'div' );
	divElem.setAttribute( 'class', 'button_container' );
	divElem.appendChild( analyzeButton );
	folderListElem.appendChild( divElem );

	folders.forEach( (folder, index) => {
			const itemDomElem = document.createElement( 'div' );
			itemDomElem.setAttribute( 'id', index ); // set `id` attribute
			itemDomElem.setAttribute( 'class', 'app__folders__item' ); // set `class` attribute
			itemDomElem.setAttribute( 'data-folderpath', folder ); // set `data-filepath` attribute
			itemDomElem.innerHTML = `${folder}
					<img ondragstart='copyFile(event, "${ folder }")' src='../assets/document.svg' class='app__files__item__file'/>
					<img onclick='deleteFolder("${ index }")' src='../assets/delete.svg' class='app__files__item__delete'/>
					<img onclick='openFolder("${ index }")' src='../assets/open.svg' class='app__files__item__open'/>
			`;

			folderListElem.appendChild( itemDomElem );
	} );

};


exports.displaySVG = () =>{
    const SVG = document.getElementById( 'svg-display' );
    const imgItem = document.createElement('img');
    console.log('INSIDE displaySVG');
    imgItem.src = path.join(__dirname, '../../../dependency-graph.svg');
    console.log('SRC FOR SVG : ', imgItem.src);

    imgItem.className = 'svg';
    SVG.appendChild(imgItem);
}