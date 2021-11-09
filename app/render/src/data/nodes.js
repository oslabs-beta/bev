import React from 'react';


// Takes in an array of objects
// Returns an array of objects for react-flow
/* 
    React-flow structure
        Node
            id: String,
            type: String,
            data: {label: jsx}
            position: {x: Number, y: Number},
            style: [optional]
        e.g.
            id: '1',
            type: 'input',
            data: {
                label: (
                    <>
                        Welcome to <strong>React Flow!</strong>
                    </>
                ),
            },
            position: { x: 250, y: 0 },


        Edge
            id: String,
            source: Node.id,
            target: Node.id,
            arrowHeadType: String,
            animated: Boolean,
            label: String
        e.g.
            id: 'e4-5',
            source: '4',
            target: '5',
            arrowHeadType: 'arrowclosed',
            label: 'edge with arrow head',

    Dependency cruiser structure
        Module
            source: String,
            dependencies: [{module: String, moduleSystem: String, dependencyTypes:[String]}]
        e.g.
            source: "../test-single-spa/single-spa-parcel-example/sample-react/src/components/Home.js"
            dependencies: [
                {
                    module: "../services/api_service.js",
                    moduleSystem: "es6",
                    dependencyTypes: ["local"]
                }
            ]
*/ 
const handleNodeColor = (depType) => {
    if (depType === 'local') return '#A4DDED';
    else if (depType === 'root') return '#FFF8DC';
    else return '#FA8072';
}

const handleAnimated = (depType) => {
    if (depType === 'local' || depType === "root") return false
    return true;
}

const preprocess = (input) => {
    if (input.default === true) return [];
    const arrayOfModules = input.modules;
    const nodes = [];
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
                source: i,
                target: sources.indexOf(resolved),
                arrowHeadType: 'arrowclosed',
                animated: handleAnimated(modules[resolved].dependencyType),
                // type: 'smoothstep'
            }
            edges.push(newEdge);
        })
    }

    // Get nodes 
    arrayOfModules.forEach((mod,i) => {
        const {source, dependencies} = mod;
        const newNode = {
            id: i,
            type: 'input',
            data: {
                label: (
                    <>
                        {modules[source].module}
                    </>
                )
            },
            style: {background: handleNodeColor(modules[source].dependencyType)},
            position: position
        };
        nodes.push(newNode);
    })

    return [...nodes, ...edges];
}


const exampleData =  [
  {
    id: '1',
    type: 'input',
    data: {
      label: (
        <>
          Welcome to <strong>React Flow!</strong>
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

export {preprocess, exampleData};