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

const getLayoutedElements = (elements, direction = 'TB') => {
  const isHorizontal = direction === 'LR';
  dagreGraph.setGraph({ rankdir: direction });

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

const OverviewFlow = ({ resultsElements }) => {
  console.log('resultsElements', resultsElements); // This works!
  const nodes = getLayoutedElements(preprocess(resultsElements));
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
  }, [resultsElements])

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

export default OverviewFlow;