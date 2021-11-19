import React from 'react';
import { render, screen } from '@testing-library/react';
import Main from './Main';
import {
  HashRouter,
  Routes,
  Route,
  Link
} from 'react-router-dom';


describe('Main component elements exist', () => {
  test('Renders a main \'container\' div', () => {
    render(
      <HashRouter>
        <Routes>
          <Route path="/" element={<Main />}/>
        </Routes>
      </HashRouter>
    );
    const container = screen.getByTestId('container');
    expect(container).toBeInTheDocument;
  });
});
