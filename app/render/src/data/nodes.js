import React from 'react';
// Takes in an array of objects
// Returns an array of objects for react-flow

const handleNodeColor = (depType) => {
    if (depType === 'local') return '#A4DDED';
    else if (depType === 'root') return '#FFF8DC';
    else return '#FA8072';
}

const handleAnimated = (depType) => {
    if (depType === 'local' || depType === "root") return false
    return true;
}

const handleEdgeType = (depType) => {
    if (depType === 'local' || depType === "root") return "straight";
    return "custom";
}

const handleEdgeStyle = (depType) => {
    if (depType === 'local' || depType === "root") return {'strokeWidth': 2.5, 'stroke': 'lightblue'};
    return {'strokeWidth': 0.7, 'stroke': 'salmon'};
}

const refactorNodesForSharedDeps = (elementsObj) => {
  console.log('elementsObj', elementsObj)
  const {localDependencies, thirdPartyDependencies, edges} = elementsObj;
  const thirdPartyDuplicatesCatcher = {} // moduleName: [ids]
  let thirdPartiesToDeleteIds = [];
  let thirdPartiesToKeepIds = [];

  // Get third-party dependency duplicates (or more than 1)
  thirdPartyDependencies.forEach(dep => {
    const name = dep.data.label;
    console.log('name', name.props.children);
    thirdPartyDuplicatesCatcher[name.props.children] ? thirdPartyDuplicatesCatcher[name.props.children].push(dep.id) : thirdPartyDuplicatesCatcher[name.props.children] = [dep.id];
  })
  console.log('thirdPartyDuplicatesCatcher', thirdPartyDuplicatesCatcher)
  let tempDepsArray = Object.entries(thirdPartyDuplicatesCatcher).filter(([k,v]) => v.length > 1);
  const thirdPartyDuplicates = {};
  tempDepsArray.forEach(pair => thirdPartyDuplicates[pair[0]] = pair[1]);
  console.log('thirdPartyDuplicates', thirdPartyDuplicates);
  console.log('thirdPartyDependencies', thirdPartyDependencies);

  // Update edges
  edges.map(edge => {
    console.log('traversing edges', edge)
    const {target, source, id} = edge;
    let newTarget;
    // for (let i = 0; i < thirdPartyDependencies.length; i += 1) {
    //   const currentDep = thirdPartyDependencies[i];
    //   currentDep.data.label
    // }
    const temp = thirdPartyDependencies.filter( e => e.id === target);
    console.log('temp', temp)
    
    const currentEdgeTargetName = (temp.length > 0) ? temp[0].data.label.props.children : '';

    if (currentEdgeTargetName in thirdPartyDuplicates) {
      console.log('old edge', edge)
      if (target !== thirdPartyDuplicates[currentEdgeTargetName][0]) thirdPartiesToDeleteIds.push(target);
      newTarget = thirdPartyDuplicates[currentEdgeTargetName][0];
      const newEdge = {...edge, target: newTarget}
      console.log('newEdge', newEdge);
      return newEdge;
    } 
    return edge;

  })

  // Delete shared deps in thirdPartyDependencies
  thirdPartiesToDeleteIds = [...new Set(thirdPartiesToDeleteIds)]
  const newThirdPartyDeps = thirdPartyDependencies.filter(obj => !thirdPartiesToDeleteIds.includes(obj.id));
  console.log('thirdPartyDespToDelete', thirdPartiesToDeleteIds)
  console.log('old thirdPartyDependencies', thirdPartyDependencies)
  console.log('newThirdPartyDeps', newThirdPartyDeps);
  return {
    localDependencies: localDependencies,
    thirdPartyDependencies: newThirdPartyDeps,
    edges: edges
  }
}

const preprocess = (input) => {
    if (input.default === true) return [];
    const arrayOfModules = input.modules;
    const nodes = [];
    const thirds = [];
    const edges = [];
    const sources = [];
    const position = {x: 0, y: 0};
    const modules = {}; // sourceName: moduleName;

    arrayOfModules.forEach(module => {
        const {source} = module;
        sources.push(source);
        modules[source] = {module: source, dependencyType: 'root'}
    })

    // Get edges
    for (let i = 0; i < arrayOfModules.length; i += 1) {
        arrayOfModules[i].dependencies.forEach((dep, j) => {
            const { resolved, moduleSystem, dependencyTypes, module } = dep;
            modules[resolved] = {module: module, dependencyType: dependencyTypes[0]};
            const newEdge = {
                id: `e${i}-${sources.indexOf(resolved)}`,
                source: String(i),
                target: String(sources.indexOf(resolved)),
                arrowHeadType: 'arrowclosed',
                // animated: handleAnimated(modules[resolved].dependencyType),
                animated: false,
                style: handleEdgeStyle(dependencyTypes[0]),
                type: handleEdgeType(dependencyTypes[0])
            }
            // if (newEdge.type === "straight") edges.push(newEdge);
            edges.push(newEdge);
        })
    }

    // Get nodes 
    arrayOfModules.forEach((mod,i) => {
        const {source, dependencies} = mod;
        const newNode = {
            id: String(i),
            type: 'input',
            data: {
                label: (
                    <>
                        {/* {`${i} -- ${modules[source].module}`} */}
                        {`${modules[source].module}`}
                    </>
                ),
                onChange: console.log('hello')
            },
            style: {background: handleNodeColor(modules[source].dependencyType)},
            position: position,
            sourcePosition: modules[source].dependencyType === 'root' ? 'bottom' : 'top',
            targetPosition: modules[source].dependencyType === 'root' ? 'bottom' : 'top',
            dependencyType: modules[source].dependencyType
        };
        modules[source].dependencyType === 'root' || modules[source].dependencyType === 'local' ?  nodes.push(newNode) : thirds.push(newNode);
    })

    let elementsObj =  {
        localDependencies: nodes,
        thirdPartyDependencies: thirds,
        edges: edges
    }

    // return refactorNodesForSharedDeps(elementsObj);
    return elementsObj;
}

const preprocessDepCruiserResultsToELKJson = (input) => {
    if (input.default === true) return [];
    const arrayOfModules = input.modules;
    const sources = [];
    const output = {
        id: "root",
        properties: { "elk.direction": "DOWN"},
        children: [
            // { id: "n1", width: 10, height: 10 },
            // { id: "n2", width: 10, height: 10 }
        ],
        edges: [
            // {id: "e1", sources: [ "n1" ], targets: [ "n2" ]}
        ]
    }

    arrayOfModules.forEach(module => {
        const {source} = module;
        sources.push(source);
    })

    arrayOfModules.forEach((module,i) => {
        output.children.push({id: i, width: 100, height: 50})
        output.edges.push({id: `e${i}`, sources: [i], targets: module.dependencies.map(el => sources.indexOf(el.resolved))})
    })
    console.log('output (ELK json)', output);
    return output;
}

const exampleData =  [
  {
    id: '1',
    type: 'input',
    data: {
      label: (
        <>
        hi
        </>
      ),
    },
    position: { x: 250, y: 0 },
  },
  {
    id: '2',
    data: {
      label: (
        <>
          This is a <strong>default node</strong>
        </>
      ),
    },
    position: { x: 100, y: 100 },
  },
  {
    id: '3',
    data: {
      label: (
        <>
          This one has a <strong>custom style</strong>
        </>
      ),
    },
    position: { x: 400, y: 100 },
    style: {
      background: '#D6D5E6',
      color: '#333',
      border: '1px solid #222138',
      width: 180,
    },
  },
  {
    id: '4',
    position: { x: 250, y: 200 },
    data: {
      label: 'Another default node',
    },
  },
  {
    id: '5',
    data: {
      label: 'Node id: 5',
    },
    position: { x: 250, y: 325 },
  },
  {
    id: '6',
    type: 'output',
    data: {
      label: (
        <>
          An <strong>output node</strong>
        </>
      ),
    },
    position: { x: 100, y: 480 },
  },
  {
    id: '7',
    type: 'output',
    data: { label: 'Another output node' },
    position: { x: 400, y: 450 },
  },
  { id: 'e1-2', source: '1', target: '2', label: 'this is an edge label' },
  { id: 'e1-3', source: '1', target: '3' },
  {
    id: 'e3-4',
    source: '3',
    target: '4',
    animated: true,
    label: 'animated edge',
  },
  {
    id: 'e4-5',
    source: '4',
    target: '5',
    arrowHeadType: 'arrowclosed',
    label: 'edge with arrow head',
  },
  {
    id: 'e5-6',
    source: '5',
    target: '6',
    type: 'smoothstep',
    label: 'smooth step edge',
  },
  {
    id: 'e5-7',
    source: '5',
    target: '7',
    type: 'step',
    style: { stroke: '#f6ab6c' },
    label: 'a step edge',
    animated: true,
    labelStyle: { fill: '#f6ab6c', fontWeight: 700 },
  },
];

export {preprocess, preprocessDepCruiserResultsToELKJson, exampleData};