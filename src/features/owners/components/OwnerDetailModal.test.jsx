import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import OwnerDetailModal from './OwnerDetailModal.jsx';

describe('OwnerDetailModal', () => {
  test('muestra placeholder cuando no hay owner', () => {
    render(<OwnerDetailModal show onHide={jest.fn()} owner={null} />);

    expect(screen.getByText(/detalle de propiedades/i)).toBeInTheDocument();
    expect(screen.getByText(/seleccione un owner para ver detalles/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cerrar/i })).toBeInTheDocument();
  });

  test('muestra info del owner y la tabla con sus propiedades e imágenes', () => {
    const owner = {
      name: 'Juan Pérez',
      address: 'Calle 123',
      birthday: '1990-05-20T12:00:00.000Z',
      properties: [
        {
          idProperty: 'p1',
          name: 'Depto A',
          address: 'Av. Siempre Viva 1',
          price: 500,
          year: 2020,
          images: [{ file: 'https://img.test/1.jpg' }, { file: 'https://img.test/2.jpg' }],
        },
        {
          idProperty: 'p2',
          name: 'Casa B',
          address: 'Calle 5',
          price: 1000,
          year: 2018,
          images: [],
        },
      ],
    };

    render(<OwnerDetailModal show onHide={() => {}} owner={owner} />);

    expect(screen.getByText(/owner:\s*juan pérez/i)).toBeInTheDocument();
    expect(screen.getByText('Calle 123')).toBeInTheDocument();
    expect(screen.getByText(/fecha nacimiento:/i)).toBeInTheDocument();

    const table = screen.getByRole('table');
    const rows = within(table).getAllByRole('row');
    expect(rows).toHaveLength(1 + owner.properties.length);

    expect(within(rows[1]).getByText(/depto a/i)).toBeInTheDocument();
    expect(within(rows[2]).getByText(/casa b/i)).toBeInTheDocument();

    expect(screen.getAllByAltText(/property/i)).toHaveLength(2);
  });

  test('muestra aviso cuando no hay propiedades', () => {
    const owner = {
      name: 'Ana',
      address: 'Calle 9',
      birthday: '2001-01-01T12:00:00.000Z',
      properties: [],
    };

    render(<OwnerDetailModal show onHide={() => {}} owner={owner} />);

    expect(
      screen.getByText(/este owner no tiene propiedades registradas/i)
    ).toBeInTheDocument();
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });

  test('el botón "Cerrar" llama onHide', async () => {
    const onHide = jest.fn();
    const owner = {
      name: 'Luis',
      address: 'Av. 10',
      birthday: '1995-03-03T12:00:00.000Z',
      properties: [],
    };

    render(<OwnerDetailModal show onHide={onHide} owner={owner} />);
    await userEvent.click(screen.getByRole('button', { name: /cerrar/i }));
    expect(onHide).toHaveBeenCalledTimes(1);
  });
});
