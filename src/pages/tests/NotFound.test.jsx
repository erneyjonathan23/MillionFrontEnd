import { render, screen, within } from '@testing-library/react';
import NotFound from 'pages/NotFound';
import React from 'react';

describe('NotFound', () => {
  test('muestra el título y el texto descriptivo', () => {
    render(<NotFound />);
    expect(screen.getByRole('heading', { name: /404/i })).toBeInTheDocument();
    expect(screen.getByText(/Ruta no encontrada./i)).toBeInTheDocument();
  });

  test('usa el landmark <main>', () => {
    render(<NotFound />);
    const main = screen.getByRole('main');
    expect(main).toBeInTheDocument();
    expect(within(main).getByRole('heading', { name: /404/i })).toBeInTheDocument();
  });
});
