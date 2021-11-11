import React, { useState, useEffect, useCallback } from 'react';

import ReactFlow, {
  removeElements,
  addEdge,
  MiniMap,
  Controls,
  Background,
  isNode,
} from 'react-flow-renderer';
import { preprocess, exampleData } from '../data/nodes';
// import { useAsync } from 'react-use';
import dagre from 'dagre';

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeWidth = 150;
const nodeHeight = 50;
let lowestLocalYPosition = 0;
let lowestLocalXPosition = 0;
const getLayoutedElements = (elements, direction = 'TB') => {
  const isHorizontal = direction === 'LR';
  // dagre library changes the direction of the chart?
  dagreGraph.setGraph({ rankdir: direction });
  // const localEdges = elements.edges.filter(e => e.type === 'local' || e.type === 'root');
  const localElements = [...elements.localDependencies, ...elements.edges];

  // creates each element (node) with the correct edges
  localElements.forEach((el) => {
    if (isNode(el)) {
      dagreGraph.setNode(el.id, { width: nodeWidth, height: nodeHeight });
    } else {
      dagreGraph.setEdge(el.source, el.target);
    }
  });

  dagre.layout(dagreGraph);
  const output = [];
  localElements.forEach((el, index) => {
    if (isNode(el)) {
      const nodeWithPosition = dagreGraph.node(el.id);
      // if isHorizontal is true, then assign the elements a different position based on orientation
      // el.targetPosition = isHorizontal ? 'left' : 'bottom';
      // el.sourcePosition = isHorizontal ? 'right' : 'top';

      // el.targetPosition = 'top';
      // el.sourcePosition = 'bottom';

      el.position = {
        x: nodeWithPosition.x - nodeWidth / 1.5 + Math.random() / 1000,
        y: nodeWithPosition.y - nodeHeight / 1.5,
      };
      console.log('el', el);
      if (index === 0) lowestLocalYPosition = el.position.y, lowestLocalXPosition = el.position.x;
      if (lowestLocalYPosition < el.position.y) lowestLocalYPosition = el.position.y;
      if (lowestLocalXPosition < el.position.x) lowestLocalXPosition = el.position.x;
      output.push(el);
    }
  });
  return output;
};
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
      el.targetPosition = 'bottom';
      el.sourcePosition = 'top';
      el.position = {
        // x: nodeWithPosition.width - nodeWidth / 1.5 + Math.random() / 1000,
        // y: nodeWithPosition.height - nodeHeight / 1.5 + lowestLocalYPosition,
        x: nodeWithPosition.width - (nodeWidth * (index+1))  + Math.random() / 1000 + lowestLocalXPosition,
        y: nodeWithPosition.height - nodeHeight / 1.5 + lowestLocalYPosition + (2*nodeHeight),
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
  const preprocessedNodes = preprocess(resultElements);
  const nodes = getLayoutedElements(preprocessedNodes);
  const thirdPartyDepNodes = setThirdPartyDepPositions(preprocessedNodes);
  // return [...nodes, ...thirdPartyDepNodes, ...preprocessedNodes.edges];
  return {
    localNodes: nodes,
    thirdPartyNodes: thirdPartyDepNodes,
    edges: preprocessedNodes.edges
  }
}
let clicked = false;

const Diagram = ({ resultElements }) => {
  console.log('RESULTELEMENTS BEFORE PREPROCESS', resultElements)
  // if (!resultElements.hasOwnProperty('localNodes')) allNodesAndEdges = mapToElements(resultElements);
  if (!clicked) allNodesAndEdges = mapToElements(resultElements);
  const [elements, setElements]= useState(!clicked ? [...allNodesAndEdges.localNodes, ...allNodesAndEdges.thirdPartyNodes, ...allNodesAndEdges.edges] : []);
  const [clickedElement, setClickedElement] = useState({});
  const onElementsRemove = (elementsToRemove) => setElements((els) => removeElements(elementsToRemove, els));
  const onConnect = (params) => setElements((els) => addEdge(params, els));

  useEffect(() => {
    console.log("useEffect triggered!")
    if (clickedElement.hasOwnProperty('id')) {
      clicked = true;
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
      <ReactFlow
        elements={elements}
        // onElementClick={(evt, emt) => onElementClick(evt, emt)}
        onElementClick={(evt, emt) => setClickedElement(emt)}
        onElementsRemove={onElementsRemove}
        onConnect={onConnect}
        onLoad={onLoad}
        snapToGrid={true}
        snapGrid={[15, 15]}
        className="react-flow-fix"
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