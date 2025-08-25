import { render, screen } from '@testing-library/react';
import React from 'react';

import { ErrorBoundary } from './ErrorBoundary';

function Ok() { return <div>OK</div>; }
function Boom() { throw new Error('boom'); }

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
});

test('sanity', () => {
  expect(true).toBe(true);
});

test('renderiza los hijos cuando no hay error', () => {
  render(
    <ErrorBoundary>
      <Ok />
    </ErrorBoundary>
  );
  expect(screen.getByText('OK')).toBeInTheDocument();
});

test('muestra el fallback cuando un hijo lanza error', () => {
  render(
    <ErrorBoundary>
      <Boom />
    </ErrorBoundary>
  );
  expect(screen.getByRole('heading', { name: /algo salió mal/i })).toBeInTheDocument();
  expect(screen.getByText(/intenta recargar/i)).toBeInTheDocument();
});
