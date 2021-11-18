import React from 'react';
import { handleNodeColor, handleEdgeType, handleEdgeStyle } from './node-configs';

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

export const mapDepCruiserJSONToReactFlowElements = (input) => {
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
            type: modules[source].dependencyType === 'local' ? 'local' : 'default',
            data: {
                label: (
                    <>
                        {/* {`${i} -- ${modules[source].module}`} */}
                        {`${modules[source].module}`}
                    </>
                ),
                onChange: console.log('hello'),
                text: modules[source].module,
                dependencyType: modules[source].dependencyType
            },
            style: {background: handleNodeColor(modules[source].dependencyType), 'border-color': 'darkslategrey'},
            position: position,
            sourcePosition: modules[source].dependencyType === 'root' || modules[source].dependencyType === 'local' ? 'right' : 'left',
            targetPosition: modules[source].dependencyType === 'root' ? 'right' : 'left',
            dependencyType: modules[source].dependencyType
        };
        modules[source].dependencyType === 'root' || modules[source].dependencyType === 'local' ?  nodes.push(newNode) : thirds.push(newNode);
    })

    let elementsObj =  {
        localDependencies: nodes,
        thirdPartyDependencies: thirds,
        edges: edges
    }

    return elementsObj;
}
