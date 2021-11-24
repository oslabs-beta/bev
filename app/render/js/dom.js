const { ipcRenderer } = require('electron');

// Open folder
window.openFolder = function (itemId) {
  // Get path of the file
  const itemNode = document.getElementById(itemId);
  const folderpath = itemNode.getAttribute('data-folderpath');

  // Send event to the main thread
  ipcRenderer.send('app:on-folder-open', { id: itemId, folderpath });
};

// Delete folder from folders.json
window.deleteFolder = function (itemId) {
  // Get path of the file
  const itemNode = document.getElementById(itemId);
  const folderpath = itemNode.getAttribute('data-folderpath');
  const removeNode = document.getElementById(itemId);
  removeNode.remove();

  // Send event to the main thread
  ipcRenderer
    .invoke('app:on-folder-delete', { id: itemId, folderpath })
    .then((folders) => {
      const projectButton = document.getElementById('create-project');
      folders[0]
        ? (projectButton.disabled = false)
        : (projectButton.disabled = true);
    });
};

// Display folders
exports.displayFolders = (folders = []) => {
  // Clear the folder list
  const folderListElem = document.getElementById('folderlist');
  folderListElem.innerHTML = '';

  // Repopulate the folder list w/ needed attributes
  folders.forEach((folder, index) => {
    const itemDomElem = document.createElement('div');
    itemDomElem.setAttribute('id', index);
    itemDomElem.setAttribute('class', 'app__folders__item');
    itemDomElem.setAttribute('data-folderpath', folder);
    itemDomElem.innerHTML = `${folder}
					<img ondragstart='copyFile(event, "${folder}")' src='../assets/document.svg' class='app__files__item__file'/>
					<img onclick='deleteFolder("${index}")' src='../assets/delete.svg' class='app__files__item__delete'/>
					<img onclick='openFolder("${index}")' src='../assets/open.svg' class='app__files__item__open'/>
			`;

    folderListElem.appendChild(itemDomElem);
  });

  const projectButton = document.getElementById('create-project');

  // Logic to tone up or down the 'Analyze Dependencies' button
  // based on if folders have been selected.
  !folders[0]
    ? (projectButton.disabled = true)
    : (projectButton.disabled = false);
};

// Functionality for dependency analysis
window.analyzeDep = function () {
  const folderNodes = document.getElementsByClassName('app__folders__item');
  const folderObjs = Array.from(folderNodes);
  const folders = folderObjs.map((node) =>
    node.getAttribute('data-folderpath')
  );

  // Render loading gif
  const loadProject = document.getElementById('loading');
  loadProject.innerText = 'Loading...';
  loadProject.click();

  // Navigates the user to a dependency graphy once analysis is complete
  ipcRenderer.invoke('app:on-analyze', folders).then((results) => {
    const startProject = document.getElementById('start-project');
    startProject.value = JSON.stringify(results);
    startProject.click();
  });
};
