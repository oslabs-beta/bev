import dagre from 'dagre'; 
import ReactFlow, { isNode } from 'react-flow-renderer';
import { mapDepCruiserJSONToReactFlowElements } from './mapping';

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
      el.position = {
        x: nodeWithPosition.x - nodeWidth / 1.5 + Math.random() / 1000,
        y: nodeWithPosition.y - nodeHeight / 1.5,
      };
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
  const thirdPartyNodes = elements.thirdPartyDependencies;
  thirdPartyNodes.reverse();
  return thirdPartyNodes.map((el, index)=> {
    if (isNode(el)) {
      dagreGraph.setNode(el.id, { width: nodeWidth, height: nodeHeight });
      const nodeWithPosition = dagreGraph.node(el.id);
      el.targetPosition = 'right';
      el.sourcePosition = 'left';
      el.position = {
        y: nodeWithPosition.width - (nodeWidth * (index+1))/1.5  + Math.random() / 1000 + lowestLocalYPosition,
        x: nodeWithPosition.height - nodeHeight + maxLocalXPosition + (2*nodeHeight) + nodeWidth,
      };
    }
    return el;
  })
}

let allNodesAndEdges;
const mapToElements = (resultElements) => {
  const reactFlowElements = mapDepCruiserJSONToReactFlowElements(resultElements); 
  const nodes = repositionLocalNodes(reactFlowElements); // setting local node positions, returning local nodes
  const thirdPartyDepNodes = setThirdPartyDepPositions(reactFlowElements); // setting 3rd party node positions, returning 3rd party nodes
  return {
    localNodes: nodes,
    thirdPartyNodes: thirdPartyDepNodes,
    edges: reactFlowElements.edges
  }
}

export { allNodesAndEdges, mapToElements };