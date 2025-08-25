import { render, screen, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

jest.mock('../services/PropertyService.js', () => ({
  propertyService: {
    create: jest.fn(),
    update: jest.fn(),
  },
}));

import { propertyService } from '../services/PropertyService.js';

import PropertyFormModal from './PropertyFormModal.jsx';

const OWNERS = [
  { idOwner: 'o1', name: 'Alice', email: 'a@a.com' },
  { idOwner: 'o2', name: 'Bob',   email: 'b@b.com' },
];

const renderModal = (props = {}) => {
  const defaultProps = {
    show: true,
    onHide: jest.fn(),
    onSuccess: jest.fn(),
    owners: OWNERS,
    defaultOwnerId: 'o2',
    mode: 'create',
    initialData: null,
  };
  return render(<PropertyFormModal {...defaultProps} {...props} />);
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('PropertyFormModal', () => {
  test('modo create: renderiza título, select y respeta defaultOwnerId', () => {
    renderModal({ mode: 'create' });

    const dialog = screen.getByRole('dialog');
    expect(within(dialog).getByText(/nueva propiedad/i)).toBeInTheDocument();

    const combo = screen.getByRole('combobox');
    expect(combo).toBeInTheDocument();

    const options = within(combo).getAllByRole('option');
    expect(options).toHaveLength(2);
    expect(combo).toHaveValue('o2');
  });

  test('modo create: envía payload normalizado y llama onSuccess/onHide', async () => {
    const user = userEvent.setup();
    propertyService.create.mockResolvedValueOnce({ idProperty: 'p-new' });

    const onHide = jest.fn();
    const onSuccess = jest.fn();
    renderModal({ mode: 'create', onHide, onSuccess });

    await user.type(screen.getByLabelText(/nombre/i), 'Casa Azul');
    await user.type(screen.getByLabelText(/dirección/i), 'Calle 1');
    await user.type(screen.getByLabelText(/precio/i), '123.45');
    await user.type(screen.getByLabelText(/código interno/i), 'ABC-123');
    await user.type(screen.getByLabelText(/año/i), '2020');

    const txt = screen.getByLabelText(/imágenes/i);
    await user.type(txt, 'https://x/1.jpg{enter} https://x/2.jpg');

    await user.click(screen.getByRole('button', { name: /crear/i }));

    await waitFor(() => expect(propertyService.create).toHaveBeenCalledTimes(1));

    expect(propertyService.create).toHaveBeenCalledWith({
      idOwner: 'o2',
      name: 'Casa Azul',
      address: 'Calle 1',
      price: 123.45,
      codeInternal: 'ABC-123',
      year: 2020,
      images: [
        { file: 'https://x/1.jpg', enabled: true },
        { file: 'https://x/2.jpg', enabled: true },
      ],
    });

    expect(onSuccess).toHaveBeenCalledTimes(1);
    expect(onHide).toHaveBeenCalledTimes(1);
  });

  test('modo create: si create rechaza, muestra alerta', async () => {
    const user = userEvent.setup();
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    propertyService.create.mockRejectedValueOnce(new Error('boom'));

    renderModal({ mode: 'create' });

    await user.type(screen.getByLabelText(/nombre/i), 'Casa Roja');
    await user.click(screen.getByRole('button', { name: /crear/i }));

    expect(await screen.findByText(/no se pudo crear la propiedad/i)).toBeInTheDocument();

    spy.mockRestore();
  });

  test('modo edit: precarga valores, convierte imágenes a textarea y actualiza', async () => {
    const user = userEvent.setup();
    propertyService.update.mockResolvedValueOnce({ ok: true });

    const initialData = {
      idProperty: 'p1',
      idOwner: 'o1',
      name: 'Casa Verde',
      address: 'Av. 9',
      price: 999.99,
      codeInternal: 'ZZZ-9',
      year: 2019,
      images: [{ file: 'https://img/1.jpg' }, { file: 'https://img/2.jpg' }],
    };

    const onHide = jest.fn();
    const onSuccess = jest.fn();

    renderModal({ mode: 'edit', initialData, onHide, onSuccess });

    const dialog = screen.getByRole('dialog');
    expect(within(dialog).getByText(/editar propiedad/i)).toBeInTheDocument();

    expect(screen.getByLabelText(/nombre/i)).toHaveValue('Casa Verde');

    const txt = screen.getByLabelText(/imágenes/i);
    expect(txt).toHaveValue('https://img/1.jpg\nhttps://img/2.jpg');

    await user.clear(screen.getByLabelText(/nombre/i));
    await user.type(screen.getByLabelText(/nombre/i), 'Casa Verde Editada');

    await user.click(screen.getByRole('button', { name: /guardar cambios/i }));

    await waitFor(() => expect(propertyService.update).toHaveBeenCalledTimes(1));

    expect(propertyService.update).toHaveBeenCalledWith('p1', {
      idOwner: 'o1',
      name: 'Casa Verde Editada',
      address: 'Av. 9',
      price: 999.99,
      codeInternal: 'ZZZ-9',
      year: 2019,
      images: [
        { file: 'https://img/1.jpg', enabled: true },
        { file: 'https://img/2.jpg', enabled: true },
      ],
    });

    expect(onSuccess).toHaveBeenCalledTimes(1);
    expect(onHide).toHaveBeenCalledTimes(1);
  });

  test('modo edit: si falta idProperty al enviar, muestra alerta "No se pudo actualizar..."', async () => {
    const user = userEvent.setup();
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});

    const initialData = {
      idOwner: 'o1',
      name: 'X',
      address: '',
      price: 0,
      codeInternal: '',
      year: 0,
      images: [],
    };

    renderModal({ mode: 'edit', initialData });

    await user.click(screen.getByRole('button', { name: /guardar cambios/i }));

    expect(await screen.findByText(/no se pudo actualizar la propiedad/i)).toBeInTheDocument();

    spy.mockRestore();
  });
});
