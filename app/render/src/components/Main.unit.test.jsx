import React from 'react';
import { render, screen } from '@testing-library/react';
import Main from './Main';

describe('Main component elements exist', () => {
  render(<Main />);
  const container = screen.getByTestId('container');
  expect(container).toBeInTheDocument;
});
