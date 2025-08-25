import { render, screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import Home from '../Home.jsx';

test('muestra el título y los 3 CTAs de navegación', () => {
  render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>
  );

  expect(
    screen.getByRole('heading', { name: /panel principal/i })
  ).toBeInTheDocument();

  const ownersBtn = screen.getByRole('button', { name: /owners/i });
  const propsBtn  = screen.getByRole('button', { name: /properties/i });
  const tracesBtn = screen.getByRole('button', { name: /property traces/i });

  expect(ownersBtn).toHaveAttribute('href', '/owners');
  expect(propsBtn).toHaveAttribute('href', '/properties');
  expect(tracesBtn).toHaveAttribute('href', '/property-traces');

  expect(screen.getAllByRole('button')).toHaveLength(3);
});
