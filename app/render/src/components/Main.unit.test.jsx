import React from 'react';
import {
  HashRouter,
  Routes,
  Route,
  Link
} from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import Main from './Main';


describe('Existential Tests', () => {
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

  test('Uploader button exists', () => {
    render(
      <HashRouter>
        <Routes>
          <Route path="/" element={<Main />}/>
        </Routes>
      </HashRouter>
    );
    const uploader = screen.getByTestId('uploader-button');
    expect(uploader).toBeInTheDocument;
  });

  test('Folder list exists', () => {
    render(
      <HashRouter>
        <Routes>
          <Route path="/" element={<Main />}/>
        </Routes>
      </HashRouter>
    );
    const folderlist = screen.getByTestId('folder-list');
    expect(folderlist).toBeInTheDocument;
  });

  test('Trigger event exists', () => {
    render(
      <HashRouter>
        <Routes>
          <Route path="/" element={<Main />}/>
        </Routes>
      </HashRouter>
    );
    const trigger = screen.getByTestId('trigger-event');
    expect(trigger).toBeInTheDocument;
  });
});
