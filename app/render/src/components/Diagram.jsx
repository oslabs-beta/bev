import React, { useState, useEffect, useCallback } from 'react';

import ReactFlow, {
  removeElements,
  addEdge,
  MiniMap,
  Controls,
  Background,
  isNode,
} from 'react-flow-renderer';
import { mapDepCruiserJSONToReactFlowElements, LocalNodeComponent, DefaultNodeComponent } from '../data/nodes';
// import { useAsync } from 'react-use';
import dagre from 'dagre';

let dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeWidth = 150;
const nodeHeight = 50;
let lowestLocalYPosition = 0;
let maxLocalXPosition = 0;
const repositionLocalNodes = (elements, direction = 'LR') => {
  dagreGraph.setGraph({ rankdir: direction });
  const localElements = [...elements.localDependencies, ...elements.edges];

  // Set up for dagreGraph object (setting nodes and edges)

  localElements.forEach((el) => {
    if (isNode(el)) {
      console.log('node before invoking setNode', el)
      dagreGraph.setNode(el.id, { width: nodeWidth, height: nodeHeight });
      console.log('node after invoking setNode', el)
    } else {
      dagreGraph.setEdge(el.source, el.target);
    }
  });

  dagre.layout(dagreGraph);
  const output = [];
  localElements.forEach((el, index) => {
    if (isNode(el)) {
      const nodeWithPosition = dagreGraph.node(el.id);
     // // if isHorizontal is true, then assign the elements a different position based on orientation
     // // el.targetPosition = isHorizontal ? 'left' : 'bottom';
     // // el.sourcePosition = isHorizontal ? 'right' : 'top';

     // // el.targetPosition = 'top';
     // // el.sourcePosition = 'bottom';

      el.position = {
        x: nodeWithPosition.x - nodeWidth / 1.5 + Math.random() / 1000,
        y: nodeWithPosition.y - nodeHeight / 1.5,
      };
      console.log('node after reposition', el);
      if (index === 0) lowestLocalYPosition = el.position.y, maxLocalXPosition = el.position.x;
      if (lowestLocalYPosition < el.position.y) lowestLocalYPosition = el.position.y;
      if (maxLocalXPosition < el.position.x) maxLocalXPosition = el.position.x;
      output.push(el);
    }
  });
  return output;
};

// Returning third party nodes ONLY 
const setThirdPartyDepPositions = (elements) => {
  console.log('lowestLocalYPosition', lowestLocalYPosition)
  const thirdPartyNodes = elements.thirdPartyDependencies;
  thirdPartyNodes.reverse();
  console.log('thirdPartyNodes', thirdPartyNodes)
  return thirdPartyNodes.map((el, index)=> {
    if (isNode(el)) {
      dagreGraph.setNode(el.id, { width: nodeWidth, height: nodeHeight });
      const nodeWithPosition = dagreGraph.node(el.id);
      console.log('3rd-party nodeWithPosition', nodeWithPosition);
      el.targetPosition = 'right';
      el.sourcePosition = 'left';
      el.position = {

        // x: nodeWithPosition.width - (nodeWidth * (index+1))  + Math.random() / 1000 + maxLocalXPosition,
        // y: nodeWithPosition.height - nodeHeight / 1.5 + lowestLocalYPosition + (2*nodeHeight),
        y: nodeWithPosition.width - (nodeWidth * (index+1))/1.5  + Math.random() / 1000 + lowestLocalYPosition,
        x: nodeWithPosition.height - nodeHeight + maxLocalXPosition + (2*nodeHeight) + nodeWidth,
      };
      console.log('3rd-party node', el);
    }
    return el;
  })
}


const onLoad = (reactFlowInstance) => {
  console.log('flow loaded:', reactFlowInstance);
  reactFlowInstance.fitView();
};



let allNodesAndEdges;
const mapToElements = (resultElements) => {
  console.log("MAPTOELEMENTS HAS BEEN TRIGGERED, initialDiagramLoad is FALSE")
  const reactFlowElements = mapDepCruiserJSONToReactFlowElements(resultElements); 
  const nodes = repositionLocalNodes(reactFlowElements); // setting local node positions, returning local nodes
  const thirdPartyDepNodes = setThirdPartyDepPositions(reactFlowElements); // setting 3rd party node positions, returning 3rd party nodes
  // return [...nodes, ...thirdPartyDepNodes, ...preprocessedNodes.edges];
  return {
    localNodes: nodes,
    thirdPartyNodes: thirdPartyDepNodes,
    edges: reactFlowElements.edges
  }
}

const Diagram = ({ resultElements, bundleInfo, initialDiagramLoad, setInitialDiagramLoad }) => {
  console.log('RESULTELEMENTS BEFORE PREPROCESS', resultElements)
  console.log('Bundle Info: ', bundleInfo);
  if (!initialDiagramLoad) {
    dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setDefaultEdgeLabel(() => ({}));
    allNodesAndEdges = mapToElements(resultElements);
  } 
  const [elements, setElements]= useState(!initialDiagramLoad ? [...allNodesAndEdges.localNodes, ...allNodesAndEdges.thirdPartyNodes, ...allNodesAndEdges.edges] : []);
  const [clickedElement, setClickedElement] = useState({});
  const onElementsRemove = (elementsToRemove) => setElements((els) => removeElements(elementsToRemove, els));
  const onConnect = (params) => setElements((els) => addEdge(params, els));
  const nodeTypes = {
    local: LocalNodeComponent,
    default: DefaultNodeComponent
  }
  useEffect(() => {
    console.log("useEffect triggered!")
    if (clickedElement.hasOwnProperty('id')) {
      setInitialDiagramLoad(true);
      console.log('if block triggered')
      const id = clickedElement.id;
      const newEdges = [];
      allNodesAndEdges.edges.forEach(edge => {
        if (edge.source === id) edge.animated = !edge.animated;
        if (edge.target === id) edge.animated = !edge.animated;
        newEdges.push(edge);
      })
      console.log('click', clickedElement);
      setElements([...allNodesAndEdges.localNodes, ...allNodesAndEdges.thirdPartyNodes, ...newEdges]);

    } else {
      console.log('else block triggered')
      setElements([...allNodesAndEdges.localNodes, ...allNodesAndEdges.thirdPartyNodes, ...allNodesAndEdges.edges]);
    }
  }, [clickedElement, resultElements])

  return (
    <>
      <div id="controls" className="controls">
      </div>
      <ReactFlow
        elements={elements}
        onElementClick={(evt, emt) => setClickedElement(emt)}
        onElementsRemove={onElementsRemove}
        onConnect={onConnect}
        onLoad={onLoad}
        snapToGrid={true}
        snapGrid={[15, 15]}
        className="react-flow-fix"
        nodeTypes={nodeTypes}
      >
        <MiniMap
          nodeStrokeColor={(n) => {
            if (n.style?.background) return n.style.background;
            if (n.type === 'input') return '#0041d0';
            if (n.type === 'output') return '#ff0072';
            if (n.type === 'default') return '#1a192b';

            return '#eee';
          }}
          nodeColor={(n) => {
            if (n.style?.background) return n.style.background;

            return '#fff';
          }}
          nodeBorderRadius={2}
        />
        <Controls />
        <Background color="#aaa" gap={16} />
      </ReactFlow>
    </>
  );

};

export default Diagram;