const path = require('path');
const fs = require('fs-extra');
const os = require('os');
const open = require('open');
const { cruise } = require('dependency-cruiser');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

// Local dependencies
const notification = require('./notification');
const appDir = path.resolve(os.homedir(), 'BEV-project-files');
const folderName = 'folders.json';

//Helper function
const cleanStats = (stats, folder) => {
  const { assets, modules } = stats;
  let totalSize = 0;
  outputObj = {};

  // Set folder property
  outputObj['folder'] = folder;
  outputObj['date'] = new Date()
    .toISOString()
    .slice(0, 19)
    .replace('T', '')
    .replaceAll(':', '-')
    .replaceAll('-', '');

  // Fetch assets
  outputObj['assets'] = {};
  assets.forEach((asset) => {
    const { name, size } = asset;
    const type = name.split('.').pop();
    totalSize += size;
    if (outputObj['assets'].hasOwnProperty(type)) {
      outputObj['assets'][type].push({ name: name, size: size });
    } else {
      outputObj['assets'][type] = [{ name: name, size: size }];
    }
  });

  // Fetch modules
  outputObj['modules'] = [];
  modules.forEach((module) => {
    const { size, name } = module;
    outputObj['modules'].push({
      name: name,
      size: size,
    });
  });

  // Calculate total asset sizes
  outputObj['sizes'] = {};
  for (type in outputObj['assets']) {
    outputObj['sizes'][type] = 0;
    outputObj['assets'][type].forEach((asset) => {
      outputObj['sizes'][type] += asset.size;
    });
  }

  // Set total bundle size
  outputObj['sizes']['total'] = totalSize;
  return outputObj;
};

// Get list of Folders
exports.getFolders = () => {
  // Ensure `appDir` exists
  fs.ensureDirSync(appDir);

  // If folder does not exist then create folder
  if (!fs.existsSync(path.resolve(appDir, folderName))) {
    fs.writeFileSync(path.resolve(appDir, folderName), JSON.stringify([]));
  }

  const foldersRaw = fs.readFileSync(path.resolve(appDir, folderName));
  const folders = JSON.parse(foldersRaw);
  return folders;
};

// Add folders to folders.json
exports.addFolders = (foldersArr = []) => {
  // Ensure `appDir` exists, if not then create appDir --> BEV-project-files
  fs.ensureDirSync(appDir);

  // Get the json obj from folders.json
  const foldersRaw = fs.readFileSync(path.resolve(appDir, folderName));

  // Parse to turn json obj into an array of folders
  const folders = JSON.parse(foldersRaw);

  //Check for any exisiting.
  folders.forEach((folder) => {
    if (foldersArr.indexOf(folder) > -1)
      foldersArr.splice(foldersArr.indexOf(folder), 1);
  });

  // Write into folders.json with the foldersArr concat to the original array of folders
  fs.writeFileSync(
    path.resolve(appDir, folderName),
    JSON.stringify(folders.concat(foldersArr))
  );
};

// Delete folder from folders.json
exports.deleteFolder = (folderpath) => {
  const folders = exports.getFolders();
  const index = folders.indexOf(folderpath);

  if (index != -1) folders.splice(index, 1);

  fs.writeFileSync(path.resolve(appDir, folderName), JSON.stringify(folders), {
    encoding: 'utf8',
    flag: 'w',
  });
};

// Open a folder
exports.openFolder = (folderpath) => {
  console.log('INSIDE OPEN FOLDER OF PATH: ', folderpath);

  // Open a folder using default application
  if (fs.existsSync(folderpath)) {
    open(folderpath);
  }
};

// Configures and leverages dependency-cruiser to map dependencies
exports.generateDependencyObject = (folderArr) => {
  const ARRAY_OF_FILES_AND_DIRS_TO_CRUISE = folderArr;
  const cruiseOptions = {
    doNotFollow: {
      path: 'node_modules',
    },
    reporterOptions: {
      dot: {
        theme: {
          graph: { rankdir: 'TD' },
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

    json = cruiseResult.output;

    notification.resultsAdded(folderArr.length);

    fs.writeFileSync('results.json', JSON.stringify(json));
  } catch (error) {
    console.error(error);
  }

  return json;
};

exports.generateBundleInfoObject = async (folders) => {
  // Generate stats.json
  let fileName;
  const outputBundleObjectsArray = [];
  for (let folder of folders) {
    //initialize statsArr to store history of stats for folder
    let statsArr = [];
    fileName = folder.replaceAll(':', '');
    fileName = fileName.split('').includes('\\')
      ? `stats-${fileName.replaceAll('\\', '-')}`
      : `stats-${fileName.replaceAll('/', '-')}`;
    const filepath = path.resolve(appDir, fileName);
    const statspath = path.resolve(folder, 'bev-generated-stats.json');

    const { stdout, stderr } = await exec(
      `webpack --profile --json > bev-generated-stats.json`,
      { cwd: folder }
    );

    //Read from stats file and store in outputBundleObjectsArray
    const rawStats = fs.readFileSync(statspath);
    const stats = JSON.parse(rawStats);

    //delete file after we are done
    fs.unlinkSync(statspath);

    //Clean up stats and retrieve only what we need
    const outputObj = cleanStats(stats, folder);

    //if stats history for the folder does not exist then create file
    if (!fs.existsSync(`${filepath}.json`)) {
      statsArr.push(outputObj);
      fs.writeFile(`${filepath}.json`, JSON.stringify(statsArr), 'utf8', () =>
        console.log('New stats file created successfully')
      );
    }
    //else if it already exist, then read from file, append to it the new outputObj.
    else {
      // Get the json obj from folders.json
      const statsRaw = fs.readFileSync(`${filepath}.json`);

      // Parse to turn json obj into an array of stats history
      statsArr.push(outputObj);

      //Latest stats version is located at index 0
      statsArr = statsArr.concat(JSON.parse(statsRaw));
      fs.writeFile(`${filepath}.json`, JSON.stringify(statsArr), 'utf8', () =>
        console.log('New stats history appended.')
      );
    }

    outputBundleObjectsArray.push(statsArr);
  }

  return outputBundleObjectsArray;
};

/*
  `depCruiserResults` is an Object
  `statsResults` is an Array of Objects
*/
exports.modifyDependencyObject = (depCruiserResults, statsResults, folders) => {
  // Preprocess dirs into Arrays
  let onPC;
  if (appDir.split('').includes('\\')) onPC = true;
  console.log('onPC', onPC);

  let bevRootPath, folderPath;
  if (onPC) {
    bevRootPath = appDir.split('\\');
    bevRootPath = bevRootPath.slice(0, bevRootPath.length - 1);
    folderPath = folders[0].split('\\');
  } else {
    bevRootPath = appDir.split('/');
    bevRootPath = bevRootPath.slice(0, bevRootPath.length - 1);
    folderPath = folders[0].split('/');
  }

  let backLog = [];
  let lastIndex;
  for (let i = 0; i < bevRootPath.length; i += 1) {
    if (bevRootPath[i] !== folderPath[i]) {
      lastIndex = i;
      break;
    }
  }
  backLog = folderPath.slice(lastIndex);
  for (let i = 0; i < bevRootPath.length - lastIndex; i += 1) {
    backLog.unshift('..');
  }
  backLog = onPC ? backLog.join('\\') : backLog.join('/');
  console.log('backLog', backLog);

  // Check if backLog is the same as bevRootPath
  let modifyFilePath = true;
  if (backLog === bevRootPath.join('\\') || backLog === bevRootPath.join('/'))
    modifyFilePath = false;

  const newSources = {}; // source: ..., newSource:...

  // Traverse `dependencies` array in `depCruiserResults.modules`
  depCruiserResults.modules.map((m) => {

    // Add `dependencies[n].resolved` to `targetNodeNames`
    const source = modifyFilePath
      ? m.source.slice(backLog.length + 1)
      : m.source;
    console.log('source', source);
    m.dependencies.map((d) => {
      let target = modifyFilePath
        ? d.resolved.slice(backLog.length + 1)
        : d.resolved;

      let moduleName;
      if (d.dependencyTypes[0] === 'npm') moduleName = d.module;

      for (let i = 0; i < statsResults.length; i += 1) {
        // Trigger `target` update
        if (moduleName) {
          const info = statsResults[i].modules.filter(
            (module) =>
              module.hasOwnProperty('issuerName') &&
              module.issuerName.slice(2) === source
          );
          if (info.length > 0) {
            for (let j = 0; j < info.length; j += 1) {
              info[j].reasons.forEach((r) => {
                if (r.userRequest === moduleName) {
                  newTarget = info[j].name.slice(2);
                  newSources[target] = newTarget;
                  target = newTarget;
                }
              });
            }
          }
        }
      }

      d.resolved = target;
      return d;
    });

    return m;
  });

  depCruiserResults.modules.map((m) => {

    // Add `dependencies[n].resolved` to `targetNodeNames`
    const source = modifyFilePath
      ? m.source.slice(backLog.length + 1)
      : m.source;
    m.dependencies.map((d) => {
      const target = d.resolved;
      console.log('target', target);
      for (let i = 0; i < statsResults.length; i += 1) {
        // Set `active` property
        const statsArrayTargetInfo = statsResults[i].modules.filter(
          (module) => module.name.slice(2) === target
        );
        if (statsArrayTargetInfo.length > 0) {
          statsArrayTargetInfo[0].reasons.forEach((r) => {
            const statsArraySource = r.resolvedModule.slice(2);
            if (!d.hasOwnProperty('active')) {
              if (
                statsArraySource === source &&
                r.type === 'harmony import specifier'
              ) {
                const { active } = r;
                d.active = active ?? false;
              }
            }
          });
        }
      }

      return d;
    });

    return m;
  });

  // Update module source names
  depCruiserResults.modules.map((m) => {
    const source = modifyFilePath
      ? m.source.slice(backLog.length + 1)
      : m.source;
    if (newSources.hasOwnProperty(source) && newSources[source] !== '')
      m.source = newSources[source];
    else
      m.source = modifyFilePath ? m.source.slice(backLog.length + 1) : m.source;
    return m;
  });

  // Return mutated depCruiserResults Object
  return depCruiserResults;
};
