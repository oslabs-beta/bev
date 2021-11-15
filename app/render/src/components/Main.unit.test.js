import { exportAllDeclaration } from '@babel/types';
import React from 'react';
import { Link } from 'react-router-dom';
import renderer from 'react-test-renderer';
import Main from './Main';

test(
  'Uploader button renders on page',
  () => {
    const defaultState = {default: true};
    const component = renderer.create(
      <Main setState={defaultState} />,
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  }
);