import React from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import OwnerList from './OwnerList.jsx';

jest.mock('./OwnerDetailModal.jsx', () => {
  return function MockOwnerDetailModal({ show, onHide, owner }) {
    if (!show) return null;
    return (
      <div data-testid="owner-detail-modal">
        <p>Mock Detail for: {owner?.name ?? '—'}</p>
        <button onClick={onHide}>Cerrar</button>
      </div>
    );
  };
});

const mkOwner = (i, withPhoto = true) => ({
  idOwner: `o${i}`,
  name: `Owner ${i}`,
  address: `Dir ${i}`,
  birthday: `1990-01-${String((i % 28) + 1).padStart(2, '0')}T12:00:00.000Z`,
  photo: withPhoto ? `https://img.test/${i}.jpg` : '',
});

describe('OwnerList', () => {
  test('renderiza encabezado, página 1 y 5 filas por página', () => {
    const owners = Array.from({ length: 7 }, (_, i) => mkOwner(i + 1));
    render(<OwnerList owners={owners} onEdit={jest.fn()} onDelete={jest.fn()} />);

    expect(screen.getByRole('heading', { name: /lista de owners/i })).toBeInTheDocument();
    expect(screen.getByText(/Página 1 de 2/i)).toBeInTheDocument();

    expect(screen.getByText('Owner 1')).toBeInTheDocument();
    expect(screen.getByText('Owner 5')).toBeInTheDocument();
    expect(screen.queryByText('Owner 6')).not.toBeInTheDocument();
  });

  test('cambia a la página 2 al hacer click en el paginador', async () => {
    const user = userEvent.setup();
    const owners = Array.from({ length: 7 }, (_, i) => mkOwner(i + 1));
    render(<OwnerList owners={owners} onEdit={jest.fn()} onDelete={jest.fn()} />);

    await user.click(screen.getByRole('button', { name: '2' }));

    expect(screen.getByText(/Página 2 de 2/i)).toBeInTheDocument();
    expect(screen.getByText('Owner 6')).toBeInTheDocument();
    expect(screen.getByText('Owner 7')).toBeInTheDocument();
    expect(screen.queryByText('Owner 1')).not.toBeInTheDocument();
  });

  test('abre y cierra el modal de detalle con "Ver detalle"', async () => {
    const user = userEvent.setup();
    const owners = [mkOwner(1), mkOwner(2)];
    render(<OwnerList owners={owners} onEdit={jest.fn()} onDelete={jest.fn()} />);

    const row = screen.getByText('Owner 2').closest('tr');
    await user.click(within(row).getByRole('button', { name: /ver detalle/i }));

    expect(screen.getByTestId('owner-detail-modal')).toBeInTheDocument();
    expect(screen.getByText(/mock detail for:\s*owner 2/i)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /cerrar/i }));
    expect(screen.queryByTestId('owner-detail-modal')).not.toBeInTheDocument();
  });

  test('dispara onEdit con el owner correcto', async () => {
    const user = userEvent.setup();
    const onEdit = jest.fn();
    const owners = [mkOwner(1), mkOwner(2)];
    render(<OwnerList owners={owners} onEdit={onEdit} onDelete={jest.fn()} />);

    const row = screen.getByText('Owner 1').closest('tr');
    await user.click(within(row).getByRole('button', { name: /editar/i }));

    expect(onEdit).toHaveBeenCalledTimes(1);
    expect(onEdit).toHaveBeenCalledWith(expect.objectContaining({ idOwner: 'o1', name: 'Owner 1' }));
  });

  test('dispara onDelete con el idOwner correcto', async () => {
    const user = userEvent.setup();
    const onDelete = jest.fn();
    const owners = [mkOwner(3)];
    render(<OwnerList owners={owners} onEdit={jest.fn()} onDelete={onDelete} />);

    const row = screen.getByText('Owner 3').closest('tr');
    await user.click(within(row).getByRole('button', { name: /eliminar/i }));

    expect(onDelete).toHaveBeenCalledTimes(1);
    expect(onDelete).toHaveBeenCalledWith('o3');
  });

  test('muestra "N/A" cuando no hay foto', () => {
    const owners = [mkOwner(1, false)];
    render(<OwnerList owners={owners} onEdit={jest.fn()} onDelete={jest.fn()} />);

    const row = screen.getByText('Owner 1').closest('tr');
    expect(within(row).getByText('N/A')).toBeInTheDocument();
  });

  test('muestra estado vacío cuando no hay owners', () => {
    render(<OwnerList owners={[]} onEdit={jest.fn()} onDelete={jest.fn()} />);

    expect(screen.getByText(/no hay registros disponibles/i)).toBeInTheDocument();
    expect(screen.getByText(/Página 1 de 1/i)).toBeInTheDocument();
  });
});
