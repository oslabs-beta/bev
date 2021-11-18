import React from 'react';
import { Handle } from 'react-flow-renderer';

export const LocalNodeComponent = ({data}) => {
    return (
      <div style={
        {
          'padding': '10px',
          'text-align': 'center',
          'font-size': '12px',
          'border-style': 'solid',
          'border-width': '1px',
          'border-color': 'darkslategrey'
          }
          }>
        <Handle type="target" position="left" style={{borderRadius:0}} />
        <div>{data.text}</div>
        <Handle type="source" position="right" style={{borderRadius:0}} />
      </div>
    )
  }
  
  export const DefaultNodeComponent = ({data}) => {
    return (
      <div style={
        {
          'text-align': 'center',
          'font-size': '12px',
          'border-color': 'darkslategrey'
          }
          }>
        {(data.dependencyType === 'root') ? <Handle type="source" position="right" style={{borderRadius:0}} /> : <></>}
        <div>{data.text}</div>
        {(data.dependencyType !== 'root') ? <Handle type="target" position="left" style={{borderRadius:0}} /> : <></>}
      </div>
    )
  }