import { render, screen, within } from '@testing-library/react';
import React from 'react';

import About from '../About.jsx'; 

describe('About', () => {
  test('muestra el título y el texto descriptivo', () => {
    render(<About />);
    expect(screen.getByRole('heading', { name: /about/i })).toBeInTheDocument();
    expect(screen.getByText(/información del proyecto/i)).toBeInTheDocument();
  });

  test('usa el landmark <main>', () => {
    render(<About />);
    const main = screen.getByRole('main');
    expect(main).toBeInTheDocument();
    expect(within(main).getByRole('heading', { name: /about/i })).toBeInTheDocument();
  });
});
