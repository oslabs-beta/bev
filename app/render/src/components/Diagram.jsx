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

// In order to keep this example simple the node width and height are hardcoded.
// In a real world app you would use the correct width and height values of
// const nodes = useStoreState(state => state.nodes) and then node.__rf.width, node.__rf.height

const nodeWidth = 150;
const nodeHeight = 50;

/*
TB = Top Bottom
LR = Left Right
Referring to the vertical or horizontal rendering of our diagram
 */
const getLayoutedElements = (elements, direction = 'TB') => {
  const isHorizontal = direction === 'LR';
  // dagre library changes the direction of the chart?
  dagreGraph.setGraph({ rankdir: direction });

  // creates each element (node) with the correct edges
  elements.forEach((el) => {
    if (isNode(el)) {
      dagreGraph.setNode(el.id, { width: nodeWidth, height: nodeHeight });
    } else {
      dagreGraph.setEdge(el.source, el.target);
    }
  });

  dagre.layout(dagreGraph);

  return elements.map((el) => {
    if (isNode(el)) {
      const nodeWithPosition = dagreGraph.node(el.id);
      // if isHorizontal is true, then assign the elements a different position based on orientation
      el.targetPosition = isHorizontal ? 'left' : 'bottom';
      el.sourcePosition = isHorizontal ? 'right' : 'top';

      // unfortunately we need this little hack to pass a slightly different position
      // to notify react flow about the change. Moreover we are shifting the dagre node position
      // (anchor=center center) to the top left so it matches the react flow node anchor point (top left).
      el.position = {
        x: nodeWithPosition.x - nodeWidth / 1.5 + Math.random() / 1000,
        y: nodeWithPosition.y - nodeHeight / 1.5,
      };
    }

    return el;
  });
};


const onLoad = (reactFlowInstance) => {
  console.log('flow loaded:', reactFlowInstance);
  reactFlowInstance.fitView();
};

const Diagram = ({ resultElements }) => {
  console.log('resultElements', resultElements); // This works!
  const nodes = getLayoutedElements(preprocess(resultElements));
  console.log('preprocessed nodes!!', nodes);

  const [elements, setElements]= useState(nodes);
  const onElementsRemove = (elementsToRemove) =>
    setElements((els) => removeElements(elementsToRemove, els));
  const onConnect = (params) => setElements((els) => addEdge(params, els));
  const onLayout = useCallback(
    (direction) => {
      const layoutedElements = getLayoutedElements(elements, direction);
      setElements(layoutedElements);
    },
    [elements]
  );
  useEffect(() => {
    setElements(nodes);
  }, [resultElements])

  return (
    <>
      <ReactFlow
        elements={elements}
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
          <div className="controls">
          <button onClick={() => onLayout('TB')}>vertical layout</button>
          <button onClick={() => onLayout('LR')}>horizontal layout</button>
        </div>
        <Background color="#aaa" gap={16} />
      </ReactFlow>
    </>
  );

};

export default Diagram;