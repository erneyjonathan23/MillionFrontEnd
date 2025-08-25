import React from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PropertyTraceList from './PropertyTraceList.jsx';

const mkTrace = (i) => ({
  id: `t${i}`,
  idProperty: `p${(i % 3) + 1}`,
  name: `Trace ${i}`,
  value: i * 1000,
  tax: i * 10,
  dateSale: `2023-01-${String((i % 28) + 1).padStart(2, '0')}T12:00:00.000Z`,
});

describe('PropertyTraceList', () => {
  test('renderiza encabezado, página 1 y 6 filas por página', () => {
    const traces = Array.from({ length: 13 }, (_, i) => mkTrace(i + 1));
    render(<PropertyTraceList traces={traces} onEdit={jest.fn()} onDelete={jest.fn()} />);

    expect(screen.getByRole('heading', { name: /property traces/i })).toBeInTheDocument();
    expect(screen.getByText(/Página 1 de 3/i)).toBeInTheDocument();

    expect(screen.getByText('Trace 1')).toBeInTheDocument();
    expect(screen.getByText('Trace 6')).toBeInTheDocument();
    expect(screen.queryByText('Trace 7')).not.toBeInTheDocument();
  });

  test('cambia a la página 2 al hacer click en el paginador', async () => {
    const user = userEvent.setup();
    const traces = Array.from({ length: 13 }, (_, i) => mkTrace(i + 1));
    render(<PropertyTraceList traces={traces} onEdit={jest.fn()} onDelete={jest.fn()} />);

    const page2 =
      screen.queryByRole('button', { name: '2' }) ??
      screen.getByRole('link', { name: '2' });

    await user.click(page2);

    expect(screen.getByText(/Página 2 de 3/i)).toBeInTheDocument();
    expect(screen.getByText('Trace 7')).toBeInTheDocument();
    expect(screen.getByText('Trace 12')).toBeInTheDocument();
    expect(screen.queryByText('Trace 1')).not.toBeInTheDocument();
  });

  test('dispara onEdit con el trace correcto', async () => {
    const user = userEvent.setup();
    const onEdit = jest.fn();
    const traces = [mkTrace(1), mkTrace(2), mkTrace(3)];
    render(<PropertyTraceList traces={traces} onEdit={onEdit} onDelete={jest.fn()} />);

    const row = screen.getByText('Trace 3').closest('tr');
    await user.click(within(row).getByRole('button', { name: /editar/i }));

    expect(onEdit).toHaveBeenCalledTimes(1);
    expect(onEdit).toHaveBeenCalledWith(expect.objectContaining({ id: 't3', name: 'Trace 3' }));
  });

  test('dispara onDelete con el id correcto', async () => {
    const user = userEvent.setup();
    const onDelete = jest.fn();
    const traces = [mkTrace(2)];
    render(<PropertyTraceList traces={traces} onEdit={jest.fn()} onDelete={onDelete} />);

    const row = screen.getByText('Trace 2').closest('tr');
    await user.click(within(row).getByRole('button', { name: /eliminar/i }));

    expect(onDelete).toHaveBeenCalledTimes(1);
    expect(onDelete).toHaveBeenCalledWith('t2');
  });

  test('muestra estado vacío cuando no hay trazas', () => {
    render(<PropertyTraceList traces={[]} onEdit={jest.fn()} onDelete={jest.fn()} />);

    expect(screen.getByText(/no hay trazas registradas/i)).toBeInTheDocument();
    expect(screen.getByText(/Página 1 de 1/i)).toBeInTheDocument();
  });
});
