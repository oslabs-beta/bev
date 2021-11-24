import React, { useState, useEffect, useCallback } from 'react';
import ReactFlow, {
  removeElements,
  addEdge,
  MiniMap,
  Controls,
  Background,
} from 'react-flow-renderer';
import { LocalNodeComponent, DefaultNodeComponent } from '../node-handling/styling';
import { mapToElements } from '../node-handling/reposition'
import dagre from 'dagre';

// React flow props, independent of Diagram hooks
const onLoad = (reactFlowInstance) => {
  console.log('flow loaded:', reactFlowInstance);
  reactFlowInstance.fitView();
};

const nodeTypes = {
  local: LocalNodeComponent,
  default: DefaultNodeComponent
}

// let nodesAndEdges = allNodesAndEdges;
let nodesAndEdges;

const Diagram = ({ resultElements, bundleInfo, initialDiagramLoad, setInitialDiagramLoad }) => {
  // On first load, reinitialize dagre graph
  if (!initialDiagramLoad) {
    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setDefaultEdgeLabel(() => ({}));
    nodesAndEdges = mapToElements(resultElements);
  } 

  // Diagram hooks
  const [elements, setElements]= useState(!initialDiagramLoad ? [...nodesAndEdges.localNodes, ...nodesAndEdges.thirdPartyNodes, ...nodesAndEdges.edges] : []);
  const [clickedElement, setClickedElement] = useState({});


  // React Flow props, contingent on hooks
  const onElementsRemove = (elementsToRemove) => setElements((els) => removeElements(elementsToRemove, els));
  const onConnect = (params) => setElements((els) => addEdge(params, els));

  // Toggle edge animation on node click
  useEffect(() => {
    if (clickedElement.hasOwnProperty('id')) {
      setInitialDiagramLoad(true);
      console.log('if block triggered')
      const id = clickedElement.id;
      const newEdges = [];
      nodesAndEdges.edges.forEach(edge => {
        if (edge.source === id) edge.animated = !edge.animated;
        if (edge.target === id) edge.animated = !edge.animated;
        newEdges.push(edge);
      })
      console.log('click', clickedElement);
      setElements([...nodesAndEdges.localNodes, ...nodesAndEdges.thirdPartyNodes, ...newEdges]);

    } else {
      console.log('else block triggered');
      setElements([...nodesAndEdges.localNodes, ...nodesAndEdges.thirdPartyNodes, ...nodesAndEdges.edges]);
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