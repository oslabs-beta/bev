const path = require('path');
const fs = require('fs-extra');
const os = require( 'os' );
const open = require('open');
const { cruise } = require('dependency-cruiser');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

// Local dependencies
const notification = require('./notification');
const appDir = path.resolve(os.homedir(), 'BEV-project-files');
const folderName = 'folders.json';

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

    fs.writeFile('results.json', JSON.stringify(json), 'utf8', () =>
      console.log('JSON generated complete')
    );
  } catch (error) {
    console.error(error);
  }
  
  return json;
};

// Generate stats.json
exports.generateBundleInfoObject = async (folders) => {
  let fileName;
  const dateTag = new Date()
    .toISOString()
    .slice(0, 19)
    .replace('T', '')
    .replaceAll(':', '-')
    .replaceAll('-', '');
  const outputBundleObjectsArray = [];

	// Reformat folder names
  for (let folder of folders) {
    fileName = folder.replaceAll(':', '');
    fileName = fileName.split('').includes('\\')
      ? `stats-${fileName.replaceAll('\\', '-')}-${dateTag}`
      : `stats-${fileName.replaceAll('/', '-')}-${dateTag}`;
    console.log(fileName);

    const filepath = path.resolve(appDir, fileName);
    console.log('filepath', filepath);

    // If stats file does not exist then create
    if (!fs.existsSync(`${filepath}.json`)) {
      const { stdout, stderr } = await exec(
        `webpack --profile --json > ${filepath}.json`,
        { cwd: folder }
      );

      if (stderr) {
        console.log('stderr', stderr);
      } else {
        console.log('stdout', stdout);
      }
    }
		
    // Read from stats file and store in outputBundleObjectsArray
    const rawStats = fs.readFileSync(`${filepath}.json`);
    const stats = JSON.parse(rawStats);
    const { assets, modules } = stats;
		
    let totalSize = 0;
		
    // Set folder property
    const outputObj = {};
    outputObj['folder'] = folder;

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

    outputBundleObjectsArray.push({ ...outputObj });
  }

  return outputBundleObjectsArray;
};

/*
  `depCruiserResults` is an Object
  `statsResults` is an Array of Objects
*/
exports.modifyDependencyObject = (depCruiserResults, statsResults) => {

  // Traverse `dependencies` array in `depCruiserResults.modules`
  depCruiserResults.modules.map((m) => {

    // Add `dependencies[n].resolved` to `targetNodeNames`
    m.dependencies.map((d) => {
      const source = m.source;
      const target = d.resolved;

      for (let i = 0; i < statsResults.length; i += 1) {

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

  // Return mutated depCruiserResults Object
  return depCruiserResults;
};
